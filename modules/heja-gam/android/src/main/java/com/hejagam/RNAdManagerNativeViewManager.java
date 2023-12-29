package com.hejagam;

import android.content.Context;
import android.location.Location;
import android.util.Log;
import android.view.View;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.ReadableNativeArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.views.view.ReactViewGroup;
import com.google.android.gms.ads.AdSize;
import com.hejagam.customClasses.CustomTargeting;
import com.hejagam.enums.TargetingEnums;
import com.hejagam.enums.TargetingEnums.TargetingTypes;
import com.hejagam.utils.AdSizeUtil;
import com.hejagam.utils.Targeting;

import java.util.ArrayList;
import java.util.Map;

public class RNAdManagerNativeViewManager extends ViewGroupManager<NativeAdViewContainer> {
    public static final String PROP_AD_MANAGER = "adsManager";
    public static final String PROP_CUSTOM_TEMPLATE_IDS = "customTemplateIds";
    public static final String PROP_CUSTOM_CLICK_TEMPLATE_IDS = "customClickTemplateIds";
    public static final String PROP_AD_SIZE = "adSize";
    public static final String PROP_VALID_AD_SIZES = "validAdSizes";
    public static final String PROP_VALID_AD_TYPES = "validAdTypes";
    public static final String PROP_TARGETING = "targeting";
    public static final String PROP_CORRELATOR = "correlator";

    public static final String PROP_HEADLINE_TEXT_VIEW = "headlineTextView";
    public static final String PROP_BODY_TEXT_VIEW = "bodyTextView";
    public static final String PROP_ADVERTISER_NAME_VIEW = "advertiserNameView";
    public static final String PROP_CALL_TO_ACTION_TEXT_VIEW = "callToActionTextView";
    public static final String PROP_ICON_VIEW = "iconView";
    public static final String PROP_IMAGE_VIEW = "imageView";
    public static final String PROP_MEDIA_VIEW = "mediaView";

    public static final String EVENT_AD_LOADED = "onAdLoaded";
    public static final String EVENT_SIZE_CHANGE = "onSizeChange";
    public static final String EVENT_AD_FAILED_TO_LOAD = "onAdFailedToLoad";
    public static final String EVENT_AD_OPENED = "onAdOpened";
    public static final String EVENT_AD_CLOSED = "onAdClosed";
    public static final String EVENT_AD_CLICKED = "onAdClicked";
    public static final String EVENT_AD_CUSTOM_CLICK = "onAdCustomClick";
    public static final String EVENT_APP_EVENT = "onAppEvent";
    public static final String EVENT_AD_RECORD_IMPRESSION = "onAdRecordImpression";
    public static final int COMMAND_RELOAD_AD = 1;
    public static final int COMMAND_SHOW_INSPECTOR = 2;

    private static final String REACT_CLASS = "CTKAdManagerNative";
    private final ReactApplicationContext applicationContext;

    public RNAdManagerNativeViewManager(ReactApplicationContext context) {
        super();
        this.applicationContext = context;
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public void onDropViewInstance(NativeAdViewContainer view) {
        if (view.nativeAdView != null) {
            view.nativeAdView.destroy();
        }
        if (view.adManagerAdView != null) {
            view.adManagerAdView.destroy();
        }
        if (view.nativeCustomTemplateAd != null) {
            view.nativeCustomTemplateAd.destroy();
        }
        super.onDropViewInstance(view);
    }

    @Override
    protected NativeAdViewContainer createViewInstance(ThemedReactContext reactContext) {
        return new NativeAdViewContainer(reactContext, applicationContext);
    }

    @ReactProp(name = PROP_AD_MANAGER)
    public void setAdsManager(final NativeAdViewContainer view, final String adUnitID) {
        Context viewContext = view.getContext();
        if (viewContext instanceof ReactContext) {
            ReactContext reactContext = (ReactContext) viewContext;
            RNAdManagerNativeManager adManager = reactContext.getNativeModule(RNAdManagerNativeManager.class);
            RNAdManagerNativeManager.AdsManagerProperties adsManagerProperties = adManager.getAdsManagerProperties(adUnitID);

            view.loadAd(adsManagerProperties);
        } else {
            Log.e("E_NOT_RCT_CONTEXT", "View's context is not a ReactContext, so it's not possible to get AdLoader.");
        }
    }

    @Override
    @Nullable
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        MapBuilder.Builder<String, Object> builder = MapBuilder.builder();
        String[] events = {
                EVENT_AD_LOADED,
                EVENT_SIZE_CHANGE,
                EVENT_AD_FAILED_TO_LOAD,
                EVENT_AD_OPENED,
                EVENT_AD_CLOSED,
                EVENT_AD_CLICKED,
                EVENT_AD_CUSTOM_CLICK,
                EVENT_APP_EVENT,
                EVENT_AD_RECORD_IMPRESSION
        };
        for (int i = 0; i < events.length; i++) {
            builder.put(events[i], MapBuilder.of("registrationName", events[i]));
        }
        return builder.build();
    }

    @ReactProp(name = PROP_CUSTOM_TEMPLATE_IDS)
    public void setPropCustomTemplateIds(final NativeAdViewContainer view, final ReadableArray customTemplateIdsString) {
        ReadableNativeArray nativeArray = (ReadableNativeArray) customTemplateIdsString;
        ArrayList<Object> list = nativeArray.toArrayList();
        String[] customTemplateIdsStringArray = list.toArray(new String[list.size()]);
        view.setCustomTemplateIds(customTemplateIdsStringArray);
    }

    @ReactProp(name = PROP_AD_SIZE)
    public void setPropAdSize(final NativeAdViewContainer view, final String sizeString) {
        AdSize adSize = AdSizeUtil.getAdSizeFromString(sizeString);
        view.setAdSize(adSize);
    }

    @ReactProp(name = PROP_VALID_AD_SIZES)
    public void setPropValidAdSizes(final NativeAdViewContainer view, final ReadableArray adSizeStrings) {
        ReadableNativeArray nativeArray = (ReadableNativeArray) adSizeStrings;
        ArrayList<Object> list = nativeArray.toArrayList();
        String[] adSizeStringsArray = list.toArray(new String[list.size()]);
        AdSize[] adSizes = new AdSize[list.size()];

        for (int i = 0; i < adSizeStringsArray.length; i++) {
            String adSizeString = adSizeStringsArray[i];
            adSizes[i] = AdSizeUtil.getAdSizeFromString(adSizeString);
        }
        view.setValidAdSizes(adSizes);
    }

    @ReactProp(name = PROP_VALID_AD_TYPES)
    public void setPropValidAdTypes(final NativeAdViewContainer view, final ReadableArray adTypesStrings) {
        ReadableNativeArray nativeArray = (ReadableNativeArray) adTypesStrings;
        ArrayList<Object> list = nativeArray.toArrayList();
        String[] adTypesStringsArray = list.toArray(new String[list.size()]);

        view.setValidAdTypes(adTypesStringsArray);
    }

    @ReactProp(name = PROP_TARGETING)
    public void setPropTargeting(final NativeAdViewContainer view, final ReadableMap targetingObjects) {

        ReadableMapKeySetIterator targetings = targetingObjects.keySetIterator();

        if (targetings.hasNextKey()) {
            for (
                    ReadableMapKeySetIterator it = targetingObjects.keySetIterator();
                    it.hasNextKey();
            ) {
                String targetingType = it.nextKey();

                if (targetingType.equals(TargetingEnums.getEnumString(TargetingTypes.CUSTOMTARGETING))) {
                    view.hasTargeting = true;
                    ReadableMap customTargetingObject = targetingObjects.getMap(targetingType);
                    CustomTargeting[] customTargetingArray = Targeting.getCustomTargeting(customTargetingObject);
                    view.setCustomTargeting(customTargetingArray);
                }

                if (targetingType.equals(TargetingEnums.getEnumString(TargetingTypes.CATEGORYEXCLUSIONS))) {
                    view.hasTargeting = true;
                    ReadableArray categoryExclusionsArray = targetingObjects.getArray(targetingType);
                    ReadableNativeArray nativeArray = (ReadableNativeArray) categoryExclusionsArray;
                    ArrayList<Object> list = nativeArray.toArrayList();
                    view.setCategoryExclusions(list.toArray(new String[list.size()]));
                }

                if (targetingType.equals(TargetingEnums.getEnumString(TargetingTypes.KEYWORDS))) {
                    view.hasTargeting = true;
                    ReadableArray keywords = targetingObjects.getArray(targetingType);
                    ReadableNativeArray nativeArray = (ReadableNativeArray) keywords;
                    ArrayList<Object> list = nativeArray.toArrayList();
                    view.setKeywords(list.toArray(new String[list.size()]));
                }

                if (targetingType.equals(TargetingEnums.getEnumString(TargetingTypes.CONTENTURL))) {
                    view.hasTargeting = true;
                    String content_url = targetingObjects.getString(targetingType);
                    view.setContentURL(content_url);
                }

                if (targetingType.equals(TargetingEnums.getEnumString(TargetingTypes.PUBLISHERPROVIDEDID))) {
                    view.hasTargeting = true;
                    String publisherProvidedID = targetingObjects.getString(targetingType);
                    view.setPublisherProvidedID(publisherProvidedID);
                }

                if (targetingType.equals(TargetingEnums.getEnumString(TargetingTypes.LOCATION))) {
                    view.hasTargeting = true;
                    ReadableMap locationObject = targetingObjects.getMap(targetingType);
                    Location location = Targeting.getLocation(locationObject);
                    view.setLocation(location);
                }
            }
        }
    }

    @ReactProp(name = PROP_CORRELATOR)
    public void setCorrelator(final NativeAdViewContainer view, final String correlator) {
        view.setCorrelator(correlator);
    }

    @ReactProp(name = PROP_HEADLINE_TEXT_VIEW)
    public void setPropHeadlineTextView(final NativeAdViewContainer view, final int tagId) {
        view.setHeadlineTextView(tagId);
    }

    @ReactProp(name = PROP_ADVERTISER_NAME_VIEW)
    public void setPropAdvertiserNameView(final NativeAdViewContainer view, final int tagId) {
        view.setAdvertiserNameView(tagId);
    }

    @ReactProp(name = PROP_BODY_TEXT_VIEW)
    public void setPropBodyTextView(final NativeAdViewContainer view, final int tagId) {
        view.setBodyTextView(tagId);
    }

    @ReactProp(name = PROP_CALL_TO_ACTION_TEXT_VIEW)
    public void setPropCallToActionTextView(final NativeAdViewContainer view, final int tagId) {
        view.setCallToActionTextView(tagId);
    }

    @ReactProp(name = PROP_IMAGE_VIEW)
    public void setPropImageView(final NativeAdViewContainer view, final int tagId) {
        view.setImageView(tagId);
    }

    @ReactProp(name = PROP_ICON_VIEW)
    public void setPropIconView(final NativeAdViewContainer view, final int tagId) {
        view.setIconView(tagId);
    }

    @ReactProp(name = PROP_MEDIA_VIEW)
    public void setPropMediaView(final NativeAdViewContainer view, final int tagId) {
        view.setMediaView(tagId);
    }

    @ReactProp(name = PROP_CUSTOM_CLICK_TEMPLATE_IDS)
    public void setPropCustomClickTemplateIds(final NativeAdViewContainer view, final ReadableArray customClickTemplateIdsString) {
        ReadableNativeArray nativeArray = (ReadableNativeArray) customClickTemplateIdsString;
        ArrayList<Object> list = nativeArray.toArrayList();
        String[] customTemplateClickIdsStringArray = list.toArray(new String[list.size()]);
        view.setCustomClickTemplateIds(customTemplateClickIdsStringArray);
    }

    @Override
    public void addView(NativeAdViewContainer parent, View child, int index) {
        parent.reactViewGroup = (ReactViewGroup) child;
        parent.addView(child, index);
    }

    @Override
    public int getChildCount(NativeAdViewContainer parent) {
        return parent.getChildCount();
    }

    @Override
    public View getChildAt(NativeAdViewContainer parent, int index) {
        return parent.getChildAt(index);
    }

    @Override
    public void removeViewAt(NativeAdViewContainer parent, int index) {
        parent.removeViewAt(index);
    }

    @Nullable
    @Override
    public Map<String, Integer> getCommandsMap() {
        return MapBuilder.of(
                "reloadAd", COMMAND_RELOAD_AD,
                "showInspector", COMMAND_SHOW_INSPECTOR
        );
    }

    @Override
    public void receiveCommand(NativeAdViewContainer root, int commandId, @javax.annotation.Nullable ReadableArray args) {
        if (commandId == COMMAND_RELOAD_AD) {
            root.reloadAd();
        } else if (commandId == COMMAND_SHOW_INSPECTOR) {
            root.showInspector();
        }
    }
}
