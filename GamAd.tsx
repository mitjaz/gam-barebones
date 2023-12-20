import React, {ReactNode, useRef, useState} from 'react';
import {
  AdType,
  NativeAdProps,
  NativeAdRef,
  NativeAdView,
  NativeAdsManager,
} from 'react-native-heja-gam';
import NativeFeedAd from './NativeFeedAd';
import {Text, TouchableOpacity} from 'react-native';
import {reloadAd} from 'react-native-heja-gam/src/native-ads/CTKAdManagerNative';
import {adHasIcon, getAdAspectRatio} from './utils';

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
    <>
      <NativeAdView
        ref={adRef}
        adsManager={adsManager}
        renderNativeAd={(ad: AdType) => (
          <NativeFeedAd
            adHasIcon={adHasIcon(ad)}
            adAspectRatio={getAdAspectRatio(ad)}
          />
        )}
        targeting={{customTargeting}}
        validAdTypes={validAdTypes}
        onAdLoaded={event => {
          console.log('adResponse', JSON.stringify(event, null, 2));

          setAdResponse(event);
        }}
        onAdFailedToLoad={error => {
          console.log(error);
        }}
        onAdPress={() => {}}
        validAdSizes={validAdSizes}
        style={{width: '100%'}}
      />
      <TouchableOpacity
        style={{backgroundColor: 'black', padding: 8, margin: 8}}
        onPress={() => {
          adRef.current?.reloadAd();
        }}>
        <Text style={{color: 'white'}}>Reload ad 🔄</Text>
      </TouchableOpacity>
    </>
  );
};
