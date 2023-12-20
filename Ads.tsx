import {Text, View} from 'react-native';
import {GamAd} from './GamAd';
import {NativeAdsManager, SIMULATOR_ID} from './modules/heja-gam/src';

const feedAdsManager = new NativeAdsManager('/22897783575/MULTI_FORMAT', [
  SIMULATOR_ID,
]);

const adManagerWithMedia = new NativeAdsManager('/256416529/H_MULTI_FEED', [
  SIMULATOR_ID,
]);

export const postAdsManager = new NativeAdsManager('/256416529/H_MULTI_POST', [
  SIMULATOR_ID,
]);

export default function Ads() {
  return (
    <View style={{flex: 1}}>
      <View style={{alignItems: 'center'}}>
        <Text style={{fontSize: 16, fontWeight: 'bold', color: '#000'}}>
          Ads
        </Text>
      </View>
      <GamAd
        adsManager={postAdsManager}
        renderNativeAd={ad => {
          console.log('ad', JSON.stringify(ad, null, 2));

          return null;
        }}
      />
    </View>
  );
}
