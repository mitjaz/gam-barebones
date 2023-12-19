import { Platform, UIManager, requireNativeComponent } from 'react-native';
import { NativeAdNativeProps } from '../types/native';
import { LINKING_ERROR } from '../Constants';

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
