package com.texforever;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(PrintPlugin.class);   // super.onCreate-க்கு முன் இருக்க வேண்டும்
        super.onCreate(savedInstanceState);
    }
}
