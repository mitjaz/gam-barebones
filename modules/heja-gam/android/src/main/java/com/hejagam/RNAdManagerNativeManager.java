package com.hejagam;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableNativeArray;
import com.facebook.react.module.annotations.ReactModule;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@ReactModule(name = "CTKAdManagerNativeManager")
public class RNAdManagerNativeManager extends ReactContextBaseJavaModule {

    public static final String REACT_CLASS = "CTKAdManagerNativeManager";
    /**
     * @{Map} with all registered managers
     **/
    private final Map<String, AdsManagerProperties> propertiesMap = new HashMap<>();

    public RNAdManagerNativeManager(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    /**
     * Initialises native ad manager for a given placement id and ads to request.
     * This method is run on the UI thread
     *
     * @param adUnitID
     */
    @ReactMethod
    public void init(final String adUnitID, ReadableArray testDevices) {
        final AdsManagerProperties adsManagerProperties = new AdsManagerProperties();
        adsManagerProperties.setAdUnitID(adUnitID);

        if (testDevices != null && testDevices.size() > 0) {
            ReadableNativeArray nativeArray = (ReadableNativeArray) testDevices;
            ArrayList<Object> list = nativeArray.toArrayList();
            adsManagerProperties.setTestDevices(list.toArray(new String[list.size()]));
        }

        propertiesMap.put(adUnitID, adsManagerProperties);
    }

    /**
     * Returns AdsManagerProperties for a given ad unit id
     *
     * @param adUnitID
     * @return
     */
    public AdsManagerProperties getAdsManagerProperties(String adUnitID) {
        return propertiesMap.get(adUnitID);
    }

    // Required for rn built in EventEmitter Calls.
    @ReactMethod
    public void addListener(String eventName) {

    }

    @ReactMethod
    public void removeListeners(Integer count) {

    }

    public static class AdsManagerProperties {
        String[] testDevices;
        String adUnitID;

        public String[] getTestDevices() {
            return testDevices;
        }

        public void setTestDevices(String[] testDevices) {
            this.testDevices = testDevices;
        }

        public String getAdUnitID() {
            return adUnitID;
        }

        public void setAdUnitID(String adUnitID) {
            this.adUnitID = adUnitID;
        }
    }
}