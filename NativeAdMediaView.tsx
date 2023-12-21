import React, {useState} from 'react';
import {View, ViewStyle} from 'react-native';
import {MediaView} from 'react-native-heja-gam';

type Props = {
  adAspectRatio?: number;
  style?: ViewStyle;
};

export const NativeAdMediaView = ({style, adAspectRatio}: Props) => {
  const [adWidth, setAdWidth] = useState<number>();

  // Max height will be based on an aspect ratio of 1.49
  // This is to prevent square or portrait images
  const maxAdHeight = adWidth ? adWidth / 1.49 : undefined;
  const adHeight = adWidth && adAspectRatio ? adWidth / adAspectRatio : 0;
  console.log({
    adHeight,
    adWidth,
    adAspectRatio,
  });

  return (
    <View
      style={[style, {zIndex: 1, alignItems: 'center'}]}
      onLayout={e => setAdWidth(e.nativeEvent.layout.width)}>
      <View>
        <MediaView
          style={{
            zIndex: 1, // Required for Android to work
            maxHeight: maxAdHeight,
            width: adWidth,
            height: adHeight,
            minHeight: 100,
            backgroundColor: '#ccc',
          }}
        />
      </View>
    </View>
  );
};
