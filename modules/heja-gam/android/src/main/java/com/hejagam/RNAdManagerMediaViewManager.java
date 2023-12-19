package com.hejagam;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;

import java.util.Map;

public class RNAdManagerMediaViewManager extends ViewGroupManager<RNAdManagerMediaView> {
    private static final String REACT_CLASS = "CTKAdManagerMediaView";

    public static final String EVENT_ON_VIDEO_START = "onVideoStart";
    public static final String EVENT_ON_VIDEO_END = "onVideoEnd";
    public static final String EVENT_ON_VIDEO_PAUSE = "onVideoPause";
    public static final String EVENT_ON_VIDEO_PLAY = "onVideoPlay";
    public static final String EVENT_ON_VIDEO_MUTE = "onVideoMute";
    public static final String EVENT_ON_VIDEO_PROGRESS = "onVideoProgress";

    public static final String PROP_PAUSE = "pause";
    public static final String PROP_MUTE = "muted" ;

    public static final int COMMAND_GET_PROGRESS = 1;
    private final ReactApplicationContext applicationContext;

    public RNAdManagerMediaViewManager(ReactApplicationContext context) {
        super();
        this.applicationContext = context;
    }

    @Nullable
    @Override
    public Map<String, Integer> getCommandsMap() {
        return MapBuilder.<String, Integer>builder()
                .put("getProgress", COMMAND_GET_PROGRESS)
                .build();
    }

    @Override
    public void receiveCommand(@NonNull RNAdManagerMediaView root, int commandId, @Nullable ReadableArray args) {
        switch (commandId) {
            case COMMAND_GET_PROGRESS:
                root.getCurrentProgress();
                break;
        }
    }

    @NonNull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @NonNull
    @Override
    protected RNAdManagerMediaView createViewInstance(@NonNull ThemedReactContext themedReactContext) {
        return new RNAdManagerMediaView(themedReactContext);
    }
}
