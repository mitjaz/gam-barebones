import { UIManager, requireNativeComponent } from 'react-native';
import { NativeAdNativeProps } from '../types/native';
import { LINKING_ERROR } from '../Constants';

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
