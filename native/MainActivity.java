package com.texforever;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(PrintPlugin.class);
        registerPlugin(TexforeverStoragePlugin.class);
        super.onCreate(savedInstanceState);
    }
}