import {StyleSheet, View, Text} from 'react-native';
import {
  BodyTextView,
  HeadlineTextView,
  IconView,
  CallToActionTextView,
  MediaView,
} from 'react-native-heja-gam';
import {parseGamAdHeadline} from './utils';
import {NativeAdInfo} from './NativeAdInfo';
import {ImageView} from 'react-native-heja-gam/src';
import {NativeAdMediaView} from './NativeAdMediaView';

type Props = {
  adAspectRatio?: number;
  adHasIcon?: boolean;
  badge?: boolean;
};

export default function NativeFeedAd({
  adAspectRatio,
  adHasIcon,
  badge = true,
}: Props) {
  return (
    <View style={styles.postOuterWrapper}>
      <View style={styles.top}>
        <View style={styles.sender}>
          {adHasIcon && <IconView style={styles.profile_image} />}
          <HeadlineTextView
            numberOfLines={1}
            style={styles.nameText}
            parseHeadline={parseGamAdHeadline}
          />

          {badge && (
            <NativeAdInfo
              style={{
                backgroundColor: '#ccc',
                paddingHorizontal: 12,
                borderRadius: 50,
              }}>
              <Text style={{fontSize: 12}}>Ad</Text>
            </NativeAdInfo>
          )}
        </View>
      </View>
      <BodyTextView style={{marginTop: 8}} />
      <NativeAdMediaView />
      <ImageView style={{height: 300}} />
      <View style={styles.cta}>
        <CallToActionTextView style={styles.ctaText} />
        <View style={styles.ctaIcon} pointerEvents="none">
          <Text>➡️</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  postOuterWrapper: {
    marginBottom: 8,

    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  profile_image: {
    width: 24,
    height: 24,
    borderRadius: 24,
    marginRight: 12,
  },
  nameText: {
    fontWeight: 'bold',
    paddingRight: 32,
    fontSize: 16,
    flex: 1,
    marginRight: 16,
  },
  sender: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageWrapper: {
    width: '100%',
    marginTop: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: 'hidden',
  },
  ctaText: {
    fontSize: 14,
    flex: 1,
    paddingVertical: 11,
    paddingHorizontal: 8,
  },
  cta: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
  },
  ctaIcon: {
    marginTop: -2,
    position: 'absolute',
    right: 8,
    top: 8,
  },
});
