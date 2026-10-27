// ===== Backup folder handle சேமிப்பு (IndexedDB) =====
const TF_DB_NAME = "texforever_storage";
const TF_STORE = "handles";
const TF_FOLDER_KEY = "backupFolder";

let backupDirHandle = null;

function tfOpenDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(TF_DB_NAME, 1);
        req.onupgradeneeded = () => {
            req.result.createObjectStore(TF_STORE);
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

async function tfSaveHandle(handle) {
    const db = await tfOpenDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(TF_STORE, "readwrite");
        tx.objectStore(TF_STORE).put(handle, TF_FOLDER_KEY);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

async function tfLoadHandle() {
    const db = await tfOpenDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(TF_STORE, "readonly");
        const req = tx.objectStore(TF_STORE).get(TF_FOLDER_KEY);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
    });
}

// Backup folder handle-ஐ பெறும். நினைவகத்தில் இல்லையென்றால் IndexedDB-யிலிருந்து எடுக்கும்.
// அனுமதி இல்லையென்றால் கேட்கும். (இந்த function ஒரு button click-ல் இருந்து அழைக்கப்பட வேண்டும்)
async function getBackupFolderHandle() {
    if (!backupDirHandle) {
        backupDirHandle = await tfLoadHandle();
    }
    if (!backupDirHandle) {
        return null;
    }

    const opts = { mode: "readwrite" };
    if ((await backupDirHandle.queryPermission(opts)) === "granted") {
        return backupDirHandle;
    }
    if ((await backupDirHandle.requestPermission(opts)) === "granted") {
        return backupDirHandle;
    }
    return null;
}

// Backup file-ஐ தேர்ந்தெடுத்த folder-க்குள் நேரடியாக எழுதும்
async function saveBackupToFolder(filename, content, mime = "application/json") {
    const dir = await getBackupFolderHandle();

    if (!dir) {
        throw new Error("Backup folder தேர்வு செய்யப்படவில்லை அல்லது அனுமதி இல்லை. Folder-ஐ மீண்டும் தேர்வு செய்யவும்.");
    }

    const fileHandle = await dir.getFileHandle(filename, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(new Blob([content], { type: mime }));
    await writable.close();

    return true;
}

async function selectTexforeverFolder() {

    try {

        const isCapacitor =
            !!(
                window.Capacitor &&
                typeof window.Capacitor.isNativePlatform === "function" &&
                window.Capacitor.isNativePlatform()
            );

        if (isCapacitor) {

            const plugin =
                window.Capacitor?.Plugins?.TexforeverStorage ||
                window.Capacitor?.registerPlugin?.("TexforeverStorage");

            if (!plugin || typeof plugin.selectFolder !== "function") {
                throw new Error("Android folder picker is not available.");
            }

            const result = await plugin.selectFolder();

            if (!result || !result.uri) {
                throw new Error("No folder was selected.");
            }

            localStorage.setItem(
                "texforever_selected_folder",
                result.name || "Selected Folder"
            );

            localStorage.setItem(
                "texforever_selected_folder_uri",
                result.uri
            );

            localStorage.setItem(
                "texforever_save_mode",
                "android_folder"
            );

            alert(
                "📁 Folder Selected Successfully!\n\n" +
                "Folder: " +
                (result.name || "Selected Folder") +
                "\n\nBackup files will be saved in this folder."
            );

            return result;
        }

        // Electron Desktop
        if (
            window.texforeverStorage &&
            typeof window.texforeverStorage.selectFolder === "function"
        ) {
            const result = await window.texforeverStorage.selectFolder();

            if (!result || !result.success) {
                throw new Error(
                    result?.message || "Electron folder selection failed."
                );
            }

            localStorage.setItem(
                "texforever_selected_folder",
                result.folder
            );

            localStorage.setItem(
                "texforever_save_mode",
                "electron_folder"
            );

            alert(
                "📁 Folder Selected Successfully!\n\n" +
                "Folder: " +
                result.folder +
                "\n\nERP data will be saved in this folder."
            );

            return result;
        }

        // Browser (Chrome Android / Desktop)
        if (typeof window.showDirectoryPicker !== "function") {

            alert(
                "📁 Folder selection is not supported on this browser/device."
            );

            return null;
        }

        // readwrite அனுமதியுடன் folder தேர்வு
        const handle = await window.showDirectoryPicker({ mode: "readwrite" });

        // handle-ஐ நினைவகத்திலும் IndexedDB-யிலும் சேமிக்கவும்
        backupDirHandle = handle;
        await tfSaveHandle(handle);

        localStorage.setItem(
            "texforever_selected_folder",
            handle.name
        );

        localStorage.setItem(
            "texforever_save_mode",
            "desktop_folder"
        );

        if (typeof syncToCloudStorage === "function") {
            await syncToCloudStorage(handle);
        }

        alert(
            "📁 Folder successfully selected:\n" +
            handle.name
        );

        return handle;

    } catch (err) {

        if (err && err.name === "AbortError") {
            return null;
        }

        console.error(
            "Folder selection failed:",
            err
        );

        alert(
            "❌ Folder selection failed.\n\n" +
            (err?.message || "Please try again.")
        );

        return null;
    }
}