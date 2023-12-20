import { Platform, UIManager, requireNativeComponent } from 'react-native';
import { NativeAdNativeProps } from '../types/native';

const LINKING_ERROR =
  `The package 'react-native-heja-gam' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const ComponentName = 'CTKAdManagerNative';

export const CTKAdManagerNative =
  UIManager.getViewManagerConfig(ComponentName) != null
    ? requireNativeComponent<NativeAdNativeProps>(ComponentName)
    : () => {
        throw new Error(LINKING_ERROR);
      };

export const reloadAd = (nodeHandle: number) => {
  UIManager.dispatchViewManagerCommand(
    nodeHandle,
    UIManager.getViewManagerConfig(ComponentName).Commands.reloadAd,
    []
  );
};
