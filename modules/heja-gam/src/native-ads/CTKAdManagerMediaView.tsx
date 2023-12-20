import { Platform, UIManager, requireNativeComponent } from 'react-native';
import { NativeAdNativeProps } from '../types/native';

const LINKING_ERROR =
  `The package 'react-native-heja-gam' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const ComponentName = 'CTKAdManagerMediaView';

export const CTKAdManagerMediaView =
  UIManager.getViewManagerConfig(ComponentName) != null
    ? requireNativeComponent<NativeAdNativeProps>(ComponentName)
    : () => {
        // CURRENTLY ONLY EXISTS ON IOS
        /*if (Platform.OS === 'android') {
          console.warn('CTKAdManagerMediaView is returning null!!');
          return null;
        }*/

        throw new Error(LINKING_ERROR);
      };

export const getProgress = (nodeHandle: number) =>
  UIManager.dispatchViewManagerCommand(
    nodeHandle,
    UIManager.getViewManagerConfig(ComponentName).Commands.getProgress,
    []
  );
