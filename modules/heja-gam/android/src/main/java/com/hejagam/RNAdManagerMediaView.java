package com.hejagam;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.google.android.gms.ads.MediaContent;
import com.google.android.gms.ads.VideoController;
import com.google.android.gms.ads.nativead.MediaView;

public class RNAdManagerMediaView extends MediaView {
    private final ReactContext reactContext;
    private MediaContent mediaContent;

    private VideoController vc;

    private final Runnable measureAndLayout = () -> {
        measure(
                MeasureSpec.makeMeasureSpec(getWidth(), MeasureSpec.EXACTLY),
                MeasureSpec.makeMeasureSpec(getHeight(), MeasureSpec.EXACTLY));
        layout(getLeft(), getTop(), getRight(), getBottom());
    };

    public RNAdManagerMediaView(ReactContext context) {
        super(context);
        this.reactContext = context;
    }

    public  void setMedia(MediaContent mc) {
        this.mediaContent = mc;
    }

    public void setVideoController(VideoController videoController) {
        vc = videoController;
    }

    public void getCurrentProgress() {
        if (vc == null) return;
        WritableMap progress = Arguments.createMap();
        if (vc.getPlaybackState() == VideoController.PLAYBACK_STATE_PLAYING) {
            if (mediaContent != null) {
                progress.putString("currentTime", String.valueOf(mediaContent.getCurrentTime()));
                progress.putString("duration", String.valueOf(mediaContent.getDuration()));
                sendEvent(RNAdManagerMediaViewManager.EVENT_ON_VIDEO_PROGRESS, progress);
            }
        }
    }

    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();

    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        requestLayout();
    }

    public VideoController.VideoLifecycleCallbacks videoLifecycleCallbacks = new VideoController.VideoLifecycleCallbacks() {
        @Override
        public void onVideoStart() {
            super.onVideoStart();
            sendEvent(RNAdManagerMediaViewManager.EVENT_ON_VIDEO_START, null);
        }

        @Override
        public void onVideoPlay() {
            super.onVideoPlay();
            sendEvent(RNAdManagerMediaViewManager.EVENT_ON_VIDEO_PLAY, null);
        }

        @Override
        public void onVideoPause() {
            super.onVideoPause();
            sendEvent(RNAdManagerMediaViewManager.EVENT_ON_VIDEO_PAUSE, null);
        }

        @Override
        public void onVideoEnd() {
            super.onVideoEnd();
            sendEvent(RNAdManagerMediaViewManager.EVENT_ON_VIDEO_END, null);
        }

        @Override
        public void onVideoMute(boolean b) {
            super.onVideoMute(b);

            WritableMap event = Arguments.createMap();
            event.putBoolean("muted", b);
            sendEvent(RNAdManagerMediaViewManager.EVENT_ON_VIDEO_MUTE, event);

        }
    };

    public void sendEvent(String name, @Nullable WritableMap event) {
        ReactContext reactContext = this.reactContext;
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                getId(),
                name,
                event);
    }

    @Override
    public void requestLayout() {
        super.requestLayout();
        post(measureAndLayout);
    }
}
