package com.texforever;

import android.content.Context;
import android.print.PrintAttributes;
import android.print.PrintManager;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.nio.charset.StandardCharsets;

@CapacitorPlugin(name = "PrintPlugin")
public class PrintPlugin extends Plugin {

    private WebView printWebView; // GC ஆகாம இருக்க field-ல வைக்கிறோம்

    // Android system print (A4)
    @PluginMethod
    public void printHtml(PluginCall call) {
        String html = call.getString("html", "");
        String jobName = call.getString("jobName", "TexForever Print");

        if (html == null || html.isEmpty()) {
            call.reject("Print செய்ய HTML இல்லை");
            return;
        }

        getActivity().runOnUiThread(() -> {
            printWebView = new WebView(getContext());
            printWebView.getSettings().setJavaScriptEnabled(true);

            printWebView.setWebViewClient(new WebViewClient() {
                private boolean printed = false;

                @Override
                public void onPageFinished(WebView view, String url) {
                    if (printed) return; // ஒரே முறை மட்டும் print
                    printed = true;

                    PrintManager pm = (PrintManager) getActivity()
                            .getSystemService(Context.PRINT_SERVICE);
                    if (pm == null) {
                        call.reject("Print service கிடைக்கவில்லை");
                        return;
                    }

                    PrintAttributes attrs = new PrintAttributes.Builder()
                            .setMediaSize(PrintAttributes.MediaSize.ISO_A4)
                            .setResolution(new PrintAttributes.Resolution("r1", "print", 600, 600))
                            .setMinMargins(new PrintAttributes.Margins(400, 400, 400, 400))
                            .build();

                    pm.print(jobName, view.createPrintDocumentAdapter(jobName), attrs);
                    call.resolve();
                }
            });

            printWebView.loadDataWithBaseURL(null, html, "text/html", "UTF-8", null);
        });
    }

    // Wi-Fi printer-க்கு நேரடியாக raw data (dialog இல்லை)
    @PluginMethod
    public void printRawWifi(PluginCall call) {
        String ip = call.getString("ip", "");
        int port = call.getInt("port", 9100);
        String data = call.getString("data", "");

        new Thread(() -> {
            try (Socket socket = new Socket()) {
                socket.connect(new InetSocketAddress(ip, port), 5000);
                OutputStream out = socket.getOutputStream();
                out.write(data.getBytes(StandardCharsets.UTF_8));
                out.flush();
                call.resolve();
            } catch (Exception e) {
                call.reject("Printer error: " + e.getMessage());
            }
        }).start();
    }
}