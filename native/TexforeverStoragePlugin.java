package com.texforever; 

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.util.Base64;

import androidx.activity.result.ActivityResult;
import androidx.documentfile.provider.DocumentFile;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.OutputStream;

@CapacitorPlugin(name = "TexforeverStorage")
public class TexforeverStoragePlugin extends Plugin {

    /* ----- FOLDER SELECT ----- */
    @PluginMethod
    public void selectFolder(PluginCall call) {
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT_TREE);
        intent.addFlags(
            Intent.FLAG_GRANT_READ_URI_PERMISSION |
            Intent.FLAG_GRANT_WRITE_URI_PERMISSION |
            Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION
        );
        startActivityForResult(call, intent, "folderResult");
    }

    @ActivityCallback
    private void folderResult(PluginCall call, ActivityResult result) {
        if (call == null) return;

        if (result.getResultCode() != Activity.RESULT_OK
                || result.getData() == null
                || result.getData().getData() == null) {
            call.reject("No folder was selected.");
            return;
        }

        Uri uri = result.getData().getData();

        getContext().getContentResolver().takePersistableUriPermission(
            uri,
            Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_GRANT_WRITE_URI_PERMISSION
        );

        DocumentFile doc = DocumentFile.fromTreeUri(getContext(), uri);

        JSObject ret = new JSObject();
        ret.put("uri", uri.toString());
        ret.put("name", doc != null && doc.getName() != null ? doc.getName() : "Selected Folder");
        call.resolve(ret);
    }

    /* ----- SAVE BACKUP (JSON / CSV) ----- */
    @PluginMethod
    public void saveBackup(PluginCall call) {
        String fileName = call.getString("fileName");
        String data = call.getString("data");
        String folderUri = call.getString("folderUri");

        if (fileName == null || data == null || folderUri == null) {
            call.reject("Missing parameters");
            return;
        }

        try {
            DocumentFile dir = DocumentFile.fromTreeUri(getContext(), Uri.parse(folderUri));
            if (dir == null || !dir.canWrite()) {
                call.reject("Selected folder is not writable");
                return;
            }

            // பழைய file இருந்தால் நீக்கவும் (same name-ல் backup மீண்டும் எடுக்க)
            DocumentFile existing = dir.findFile(fileName);
            if (existing != null) existing.delete();

            String mime = fileName.endsWith(".csv") ? "text/csv" : "application/json";
            String baseName = fileName.replaceAll("\\.(json|csv)$", "");

            DocumentFile file = dir.createFile(mime, baseName);
            if (file == null) {
                call.reject("Could not create backup file");
                return;
            }

            byte[] bytes = Base64.decode(data, Base64.DEFAULT);
            try (OutputStream os = getContext().getContentResolver().openOutputStream(file.getUri())) {
                if (os == null) {
                    call.reject("Could not open backup file");
                    return;
                }
                os.write(bytes);
            }

            JSObject ret = new JSObject();
            ret.put("success", true);
            ret.put("name", file.getName());
            call.resolve(ret);

        } catch (Exception e) {
            call.reject("Backup failed: " + e.getMessage());
        }
    }
}