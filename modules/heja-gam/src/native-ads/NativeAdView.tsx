import {
  NativeSyntheticEvent,
  View,
  ViewStyle,
  findNodeHandle,
} from 'react-native';
import { createErrorFromErrorData } from '../utils';
import {
  ForwardedRef,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { NativeAdProps, AdType, NativeAdRef } from '../types/native';
import { AdFormatLabel, AdManagerEventSize } from '../types/events';
import { CTKAdManagerNative, reloadAd } from './CTKAdManagerNative';
import {
  NativeAdViewContext,
  NativeAdViewProvider,
  NativeAdViewType,
} from './NativeAdViewProvider';
import { MEDIA_VIEW_REF } from './NativeComponents';

export const NativeAdView = forwardRef(
  (props: NativeAdProps, ref: ForwardedRef<NativeAdRef>) => {
    const nativeAdViewRef = useRef<any | null>(null);

    const {
      style,
      adSize,
      adLoaderIndex,
      customTemplateIds,
      validAdSizes,
      validAdTypes,
      onSizeChange,
      onAdLoaded,
      onAdFailedToLoad,
      onAppEvent,
      onAdOpened,
      onAdClosed,
      onAdCustomClick,
      targeting,
      customClickTemplateIds,
      adsManager,
      onAdRecordImpression,
      onAdPress,
      renderNativeAd,
    } = props;

    const [nativeStyle, setNativeStyle] = useState<ViewStyle>({});
    const [adResponse, setAdResponse] = useState<AdType>();

    const { setNativeAd, setNativeAdView, mediaViewRef } =
      useContext(NativeAdViewContext);

    const reload = () => {
      const nodeHandle = findNodeHandle(nativeAdViewRef.current);

      if (!nodeHandle) {
        console.warn('No node handle found');
        return;
      }

      reloadAd(nodeHandle);
    };

    useImperativeHandle(ref, () => ({ reloadAd: reload }));

    const handleSizeChange = ({
      nativeEvent,
    }: NativeSyntheticEvent<AdManagerEventSize>) => {
      const { height, width } = nativeEvent;
      setNativeStyle({ width, height });
      onSizeChange?.(nativeEvent);
    };

    const handleAdLoaded = ({ nativeEvent }: NativeSyntheticEvent<AdType>) => {
      if (nativeEvent.type === AdFormatLabel.NATIVE) {
        setNativeAd(nativeEvent);
        setNativeStyle({});
      }

      setAdResponse(nativeEvent);
      onAdLoaded?.(nativeEvent);
    };

    useEffect(() => {
      reload();
    }, []);

    const saveElement = useCallback((element: NativeAdViewType | null) => {
      if (element) {
        nativeAdViewRef.current = element;
        setNativeAdView(element);
      }
    }, []);

    const canRenderNativeAd =
      !!renderNativeAd &&
      !!adResponse &&
      adResponse.type === AdFormatLabel.NATIVE;

    return (
      <CTKAdManagerNative
        ref={saveElement}
        style={[style, nativeStyle]}
        adSize={adSize}
        loaderIndex={adLoaderIndex}
        customTemplateIds={customTemplateIds}
        validAdSizes={validAdSizes}
        validAdTypes={validAdTypes}
        onSizeChange={handleSizeChange}
        onAdLoaded={handleAdLoaded}
        onAdFailedToLoad={(event) =>
          onAdFailedToLoad?.(createErrorFromErrorData(event.nativeEvent.error))
        }
        onAppEvent={(event) => onAppEvent?.(event.nativeEvent)}
        onAdOpened={(event) => onAdOpened?.(event.nativeEvent)}
        onAdClosed={(event) => onAdClosed?.(event.nativeEvent)}
        onAdCustomClick={(event) => onAdCustomClick?.(event.nativeEvent)}
        onAdRecordImpression={(event) =>
          onAdRecordImpression?.(event.nativeEvent)
        }
        onAdPress={(event) => {
          onAdPress?.(event.nativeEvent);
        }}
        targeting={targeting}
        customClickTemplateIds={customClickTemplateIds}
        adsManager={adsManager.toJSON()}
        mediaView={mediaViewRef || undefined}
      >
        <View style={{ display: canRenderNativeAd ? 'flex' : 'none' }}>
          {renderNativeAd(adResponse)}
        </View>
      </CTKAdManagerNative>
    );
  }
);

export default forwardRef(
  (props: NativeAdProps, ref: ForwardedRef<{ reloadAd: () => void }>) => {
    return (
      <NativeAdViewProvider>
        <NativeAdView {...props} ref={ref} />
      </NativeAdViewProvider>
    );
  }
);
