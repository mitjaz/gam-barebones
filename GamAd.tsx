import React, {ReactNode, useRef, useState} from 'react';
import {
  AdType,
  NativeAdProps,
  NativeAdRef,
  NativeAdView,
  NativeAdsManager,
} from 'react-native-heja-gam';
import NativeFeedAd from './NativeFeedAd';

type Props = {
  adsManager: NativeAdsManager;
  renderNativeAd: (ad: AdType) => ReactNode;
  validAdSizes?: ('300x250' | '320x50')[];
  validAdTypes?: NativeAdProps['validAdTypes'];
};

export const GamAd = ({
  adsManager,
  renderNativeAd,
  validAdSizes = ['300x250', '320x50'],
  validAdTypes = ['banner', 'native', 'template'],
}: Props) => {
  const [adResponse, setAdResponse] = useState<AdType>();
  const adRef = useRef<NativeAdRef>(null);
  const customTargeting = {
    gender: 'unknown',
    role: 'coach',
    userId: '657c1144c9a1f88913de07e5',
    isHeja: 'yes',
    yearOfBirth: '2004',
    sport: 'soccer',
    teamYearOfBirth: '',
    isAdmin: 'yes',
  };

  return (
    <NativeAdView
      ref={adRef}
      adsManager={adsManager}
      renderNativeAd={(ad: AdType) => (
        <NativeFeedAd adHasIcon={true} adAspectRatio={1.5} />
      )}
      targeting={{customTargeting}}
      validAdTypes={validAdTypes}
      onAdLoaded={event => {
        console.log('adResponse', JSON.stringify(event, null, 2));

        setAdResponse(event);
      }}
      onAdFailedToLoad={error => {
        console.log(error);
        Bugsnag.notify(error);
      }}
      onAdPress={() => {
        setAllowDeepLinks();
      }}
      validAdSizes={validAdSizes}
      style={{width: '100%'}}
    />
  );
};
