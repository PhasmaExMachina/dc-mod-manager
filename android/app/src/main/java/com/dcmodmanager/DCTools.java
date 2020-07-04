package com.dcmodmanager;

import android.widget.Toast;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import android.util.Log;
import com.dcmodmanager.DCTools;

import java.util.Map;
import java.util.HashMap;

public class DCTools extends ReactContextBaseJavaModule {
  private static ReactApplicationContext reactContext;

  DCTools(ReactApplicationContext context) {
    super(context);
    reactContext = context;
  }

  private static final String DURATION_SHORT_KEY = "SHORT";
  private static final String DURATION_LONG_KEY = "LONG";

  @Override
  public String getName() {
    return "DCTools";
  }

  @ReactMethod
  public void show(String message, int duration) {
    Toast.makeText(getReactApplicationContext(), message, duration).show();
  }

  @ReactMethod
  public void setConsoleLog() {
    // DCTools.log = log;
    // DCTools.log("Hello from Java");
    Log.i("Foo", "Hello from JAVA");
  }

  @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();
    constants.put(DURATION_SHORT_KEY, Toast.LENGTH_SHORT);
    constants.put(DURATION_LONG_KEY, Toast.LENGTH_LONG);
    return constants;
  }
}