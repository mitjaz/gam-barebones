package com.awesomeproject2;

import static android.os.Looper.*;

import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

public class HelloPTModule extends ReactContextBaseJavaModule {
    public HelloPTModule (@Nullable ReactApplicationContext reactContext){
        super(reactContext);
    }
    @Override
    public String getName() {
        return "HelloPT";
    }

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    private int listenerCount = 0;

    @ReactMethod
    public void addListener(String eventName) {
        if (listenerCount == 0) {
            // Set up any upstream listeners or background tasks as necessary
        }

        listenerCount += 1;
    }

    @ReactMethod
    public void removeListeners(Integer count) {
        listenerCount -= count;
        if (listenerCount == 0) {
            // Remove upstream listeners, stop unnecessary background tasks
        }
    }


    @ReactMethod
    public void sayHello (String name, Callback cb) {
        try {
            String hello = "Hello " + name;
            cb.invoke(null, hello);
        } catch (Exception err) {
            cb.invoke(err, null);
        }
    }

    @ReactMethod
    public void createCalendarEvent(String name, String location, Promise promise) {
        Log.d("CalendarModule", "Create event called with name: " + name
                + " and location: " + location);

        try {
            Integer eventId = 7 /2;
            promise.resolve(eventId);
        } catch(Exception e) {
            promise.reject("Create Event error", "Error parsing event", e);
        }


        Handler handler = new Handler(getMainLooper());
        handler.postDelayed(() -> {
            WritableMap params = Arguments.createMap();
            params.putString("eventProperty", "someValue");

            ReactContext reactContext = getReactApplicationContext();
            sendEvent(reactContext, "EventReminder", params);
        }, 2000);
    }
}
