import { useContext, useRef, useEffect } from 'react';
import {
  findNodeHandle,
  Text,
  Image,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import type { ImageProps, TextProps } from 'react-native';
import { NativeAdViewContext } from './NativeAdViewProvider';
import { CTKAdManagerMediaView, getProgress } from './CTKAdManagerMediaView';

export const HeadlineTextView = ({
  parseHeadline,
  ...props
}: TextProps & {
  parseHeadline: (headline: string | undefined | null) => string;
}) => {
  const headlineTextRef = useRef(null);
  const { nativeAd, nativeAdView } = useContext(NativeAdViewContext);

  useEffect(() => {
    if (!nativeAd?.headline || !headlineTextRef.current) {
      return;
    }

    nativeAdView?.setNativeProps({
      headlineTextView: findNodeHandle(headlineTextRef.current),
    });
  }, [nativeAd]);

  return (
    <Text {...props} ref={headlineTextRef}>
      {parseHeadline(nativeAd?.headline) || null}
    </Text>
  );
};

export const AdvertiserNameView = (props: TextProps) => {
  const advertiserNameRef = useRef(null);
  const { nativeAd, nativeAdView } = useContext(NativeAdViewContext);

  useEffect(() => {
    if (!nativeAd?.advertiserName || !advertiserNameRef.current) {
      return;
    }

    nativeAdView?.setNativeProps({
      advertiserNameView: findNodeHandle(advertiserNameRef.current),
    });
  }, [nativeAd]);

  return (
    <Text {...props} ref={advertiserNameRef}>
      {nativeAd?.advertiserName || null}
    </Text>
  );
};

export const BodyTextView = (props: TextProps) => {
  const bodyTextRef = useRef(null);
  const { nativeAd, nativeAdView } = useContext(NativeAdViewContext);

  useEffect(() => {
    if (!nativeAd?.bodyText || !bodyTextRef.current) {
      return;
    }

    nativeAdView?.setNativeProps({
      bodyTextView: findNodeHandle(bodyTextRef.current),
    });
  }, [nativeAd]);

  return (
    <Text {...props} ref={bodyTextRef}>
      {nativeAd?.bodyText || null}
    </Text>
  );
};

export const CallToActionTextView = (props: TextProps) => {
  const callToActionTextRef = useRef(null);
  const { nativeAd, nativeAdView } = useContext(NativeAdViewContext);

  useEffect(() => {
    if (!nativeAd?.callToActionText || !callToActionTextRef.current) {
      return;
    }

    console.log('setNativeProp');

    nativeAdView?.setNativeProps({
      callToActionTextView: findNodeHandle(callToActionTextRef.current),
    });
  }, [nativeAd]);

  return (
    <Text {...props} ref={callToActionTextRef}>
      {nativeAd?.callToActionText || null}
    </Text>
  );
};

export const ImageView = (props: Omit<ImageProps, 'source'>) => {
  const imageRef = useRef(null);
  const { nativeAd, nativeAdView } = useContext(NativeAdViewContext);
  const image = nativeAd?.images?.[0];

  useEffect(() => {
    if (!nativeAd?.images || !imageRef.current) {
      return;
    }

    nativeAdView?.setNativeProps({
      imageView: findNodeHandle(imageRef.current),
    });
  }, [nativeAd]);

  return (
    <Image
      key={image?.uri}
      ref={imageRef}
      {...props}
      source={{ uri: image?.uri }}
    />
  );
};

export const IconView = (props: Omit<ImageProps, 'source'>) => {
  const iconRef = useRef(null);
  const { nativeAd, nativeAdView } = useContext(NativeAdViewContext);

  useEffect(() => {
    if (!nativeAd?.icon || !iconRef.current) {
      return;
    }

    nativeAdView?.setNativeProps({
      iconView: findNodeHandle(iconRef.current),
    });
  }, [nativeAd]);

  return (
    <Image {...props} ref={iconRef} source={{ uri: nativeAd?.icon?.uri }} />
  );
};

let timers: any = {};

export const MediaView = (props: any) => {
  const { nativeAd, nativeAdView } = useContext(NativeAdViewContext);
  const mediaRef = useRef(null);
  let nodeHandle: any = null;
  useEffect(() => {
    if (!nativeAd?.images || !mediaRef.current) {
      return;
    }

    nodeHandle = findNodeHandle(mediaRef.current);
    nativeAdView?.setNativeProps({
      mediaView: nodeHandle,
    });
  }, [nativeAd]);

  useEffect(() => {
    return () => {
      _clearInterval();
    };
  }, [nativeAd, nativeAdView]);

  const _setInterval = () => {
    _clearInterval();
    timers[nodeHandle] = setInterval(() => {
      if (!mediaRef.current) {
        clearInterval(timers[nodeHandle]);
        return;
      }
      getProgress(nodeHandle);
    }, 1000);
  };

  const _clearInterval = () => {
    clearInterval(timers[nodeHandle]);
    timers[nodeHandle] = null;
  };

  const onVideoPlay = () => {
    _setInterval();
    props.onVideoPlay && props.onVideoPlay();
  };
  const onVideoPause = () => {
    _clearInterval();
    props.onVideoPause && props.onVideoPause();
  };

  const onVideoEnd = () => {
    _clearInterval();
    props.onVideoEnd && props.onVideoEnd();
  };

  const onVideoProgress = (event: any) => {
    if (Platform.OS === 'android') {
      let progress = event.nativeEvent;
      let duration = parseFloat(progress.duration);
      let current = parseFloat(progress.currentTime);
      if (current + 4 > duration) {
        _clearInterval();
      }
    }
    props.onVideoProgress && props.onVideoProgress(event.nativeEvent);
  };

  const onVideoMute = (event: any) => {
    props.onVideoMute && props.onVideoMute(event.nativeEvent?.muted);
  };

  return (
    <CTKAdManagerMediaView
      {...props}
      pause={props.paused}
      onVideoPlay={onVideoPlay}
      onVideoPause={onVideoPause}
      onVideoEnd={onVideoEnd}
      onVideoProgress={onVideoProgress}
      onVideoMute={onVideoMute}
      ref={mediaRef}
    />
  );
};
