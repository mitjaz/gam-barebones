import {Image, UIManager, View, requireNativeComponent} from 'react-native';

/**
 * Composes `View`.
 *
 * - src: string
 * - borderRadius: number
 * - resizeMode: 'cover' | 'contain' | 'stretch'
 */

const RCTImageView2 =
  UIManager.getViewManagerConfig('RCTImageView2') != null
    ? requireNativeComponent('RCTImageView2')
    : () => {
        throw new Error('Linking error');
      };

export default function ImageView() {
  return (
    <View>
      <RCTImageView2
        src={[
          {
            uri: 'https://blog.cloudflare.com/content/images/2023/03/pasted-image-0-8.png',
          },
        ]}
        style={{
          height: 200,
        }}
      />
    </View>
  );
}
