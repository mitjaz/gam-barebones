import * as React from 'react';
import { useState, createContext } from 'react';
import type { NativeMethods } from 'react-native';
import type { AdType, NativeAdProps } from '../types/native';
import { AdManagerEventLoadedNative } from '../types/events';

export type NativeAdViewType = React.Component<NativeAdProps> & NativeMethods;

export type NativeAdViewContextType = {
  nativeAd: AdManagerEventLoadedNative | null;
  nativeAdView: NativeAdViewType | null;
  setNativeAd: React.Dispatch<React.SetStateAction<AdType>>;
  setNativeAdView: React.Dispatch<React.SetStateAction<NativeAdViewType>>;
};

export const NativeAdViewContext = createContext<NativeAdViewContextType>({
  nativeAd: null,
  nativeAdView: null,
  setNativeAd: () => {},
  setNativeAdView: () => {},
});

export const NativeAdViewProvider: React.FC<{ children: React.ReactNode }> = (
  props
) => {
  const [nativeAd, setNativeAd] = useState(null);
  const [nativeAdView, setNativeAdView] = useState(null);

  return (
    <NativeAdViewContext.Provider
      value={
        {
          nativeAd,
          nativeAdView,
          setNativeAd,
          setNativeAdView,
        } as any
      }
    >
      {props.children}
    </NativeAdViewContext.Provider>
  );
};
