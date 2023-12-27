package com.hejagam;

import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.google.android.gms.ads.MediaContent;
import com.google.android.gms.ads.VideoController;
import com.google.android.gms.ads.nativead.MediaView;

import javax.annotation.Nullable;

public class RNAdMediaView extends MediaView {

    private final Runnable measureAndLayout = new Runnable() {
        @Override
        public void run() {
            Log.d("RNAdMediaView", getWidth() + "w " + getHeight() + "h " + getLeft() + "l " + getTop() + "t " + getRight() + "r " + getBottom() + "b");
            measure(
                    MeasureSpec.makeMeasureSpec(getWidth(), MeasureSpec.EXACTLY),
                    MeasureSpec.makeMeasureSpec(getHeight(), MeasureSpec.EXACTLY));
            layout(getLeft(), getTop(), getRight(), getBottom());
        }
    };
    ReactContext mContext;
    public VideoController.VideoLifecycleCallbacks videoLifecycleCallbacks = new VideoController.VideoLifecycleCallbacks() {
        @Override
        public void onVideoStart() {
            super.onVideoStart();
            sendEvent(RNAdMediaViewManager.EVENT_ON_VIDEO_START, null);
        }

        @Override
        public void onVideoPlay() {
            super.onVideoPlay();
            sendEvent(RNAdMediaViewManager.EVENT_ON_VIDEO_PLAY, null);
        }

        @Override
        public void onVideoPause() {
            super.onVideoPause();
            sendEvent(RNAdMediaViewManager.EVENT_ON_VIDEO_PAUSE, null);
        }

        @Override
        public void onVideoEnd() {
            super.onVideoEnd();
            sendEvent(RNAdMediaViewManager.EVENT_ON_VIDEO_END, null);
        }

        @Override
        public void onVideoMute(boolean b) {
            super.onVideoMute(b);

            WritableMap event = Arguments.createMap();
            event.putBoolean("muted", b);
            sendEvent(RNAdMediaViewManager.EVENT_ON_VIDEO_MUTE, event);

        }
    };
    VideoController vc;
    MediaContent mediaContent;

    public RNAdMediaView(ReactContext context) {
        super(context);
        mContext = context;
        requestLayout();
    }

    public void setVideoController(VideoController videoController) {
        vc = videoController;
    }

    public void setMedia(MediaContent mc) {
        mediaContent = mc;
    }

    public void getCurrentProgress() {
        if (vc == null) return;
        WritableMap progress = Arguments.createMap();
        if (vc.getPlaybackState() == VideoController.PLAYBACK_STATE_PLAYING) {
            if (mediaContent != null) {
                progress.putString("currentTime", String.valueOf(mediaContent.getCurrentTime()));
                progress.putString("duration", String.valueOf(mediaContent.getDuration()));
                sendEvent(RNAdMediaViewManager.EVENT_ON_VIDEO_PROGRESS, progress);
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

    public void setPause(boolean pause) {
        if (vc == null) return;
        if (pause) {
            vc.pause();
        } else {
            vc.play();
        }
    }

    public void setMuted(boolean muted) {
        if (vc == null) return;
        vc.mute(muted);

    }


    @Override
    public void requestLayout() {
        Log.d("RNAdMediaView", "requestLayout");
        super.requestLayout();
        post(measureAndLayout);
    }


    public void sendEvent(String name, @Nullable WritableMap event) {

        ReactContext reactContext = (ReactContext) mContext;
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                getId(),
                name,
                event);
    }

}