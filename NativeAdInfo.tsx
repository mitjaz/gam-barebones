import {useState} from 'react';
import {TouchableOpacity, ViewStyle} from 'react-native';
// import InfoSheet from './InfoSheet';

type Props = {
  style?: ViewStyle;
  children: React.ReactNode;
};

export const NativeAdInfo = ({children, style}: Props) => {
  const [infoOpen, setInfoOpen] = useState(false);
  return (
    <>
      <TouchableOpacity
        style={style}
        onPress={() => setInfoOpen(true)}
        hitSlop={16}>
        {children}
      </TouchableOpacity>
      {/* <InfoSheet isVisible={infoOpen} onClosed={() => setInfoOpen(false)} /> */}
    </>
  );
};
