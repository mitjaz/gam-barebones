import {Text, View} from 'react-native';
import {GamAd} from './GamAd';
import {NativeAdsManager, SIMULATOR_ID} from './modules/heja-gam/src';

export const feedAdsManager = new NativeAdsManager(
  '/22897783575/MULTI_FORMAT',
  [SIMULATOR_ID],
);

export default function Ads() {
  return (
    <View style={{flex: 1}}>
      <View style={{alignItems: 'center'}}>
        <Text style={{fontSize: 16, fontWeight: 'bold', color: '#000'}}>
          Ads
        </Text>
      </View>
      <GamAd
        adsManager={feedAdsManager}
        renderNativeAd={ad => {
          console.log('ad', JSON.stringify(ad, null, 2));

          return null;
        }}
      />
    </View>
  );
}
