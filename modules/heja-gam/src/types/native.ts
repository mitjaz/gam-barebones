import { NativeSyntheticEvent, ViewProps } from 'react-native';
import {
  AdManagerEventAppEvent,
  AdManagerEventBase,
  AdManagerEventCustomClick,
  AdManagerEventError,
  AdManagerEventLoadedBanner,
  AdManagerEventLoadedNative,
  AdManagerEventLoadedTemplate,
  AdManagerEventSize,
} from './events';
import { NativeAdsManager } from '../native-ads/NativeAdsManager';
import { ReactNode } from 'react';

export type AdManagerTargeting = {
  /**
   * Arbitrary object of custom targeting information.
   */
  customTargeting?: Record<string, string>;

  /**
   * Array of exclusion labels.
   */
  categoryExclusions?: string[];

  /**
   * Array of keyword strings.
   */
  keywords?: string[];

  /**
   * Applications that monetize content matching a webpage's content may pass
   * a content URL for keyword targeting.
   */
  contentURL?: string;

  /**
   * You can set a publisher provided identifier (PPID) for use in frequency
   * capping, audience segmentation and targeting, sequential ad rotation, and
   * other audience-based ad delivery controls across devices.
   */
  publisherProvidedID?: string;
};

export type AdManagerTemplateImage = {
  uri: string;
  width: number;
  height: number;
  scale: number;
};

export type AdType =
  | AdManagerEventLoadedBanner
  | AdManagerEventLoadedTemplate
  | AdManagerEventLoadedNative;

export type NativeAdPropsBase = ViewProps & {
  adSize?: string;
  customTemplateIds?: string[];
  validAdSizes?: string[];
  validAdTypes?: ('banner' | 'native' | 'template')[];
  customClickTemplateIds?: string[];
  targeting?: AdManagerTargeting;
};

export type NativeAdNativeProps = NativeAdPropsBase & {
  ref?: any;
  children: React.ReactNode;
  adsManager: string;
  loaderIndex?: string;
  onSizeChange?: (event: NativeSyntheticEvent<AdManagerEventSize>) => void;
  onAdLoaded?: (event: NativeSyntheticEvent<AdType>) => void;
  onAdFailedToLoad?: (event: NativeSyntheticEvent<AdManagerEventError>) => void;
  onAppEvent?: (event: NativeSyntheticEvent<AdManagerEventAppEvent>) => void;
  onAdOpened?: (event: NativeSyntheticEvent<AdManagerEventBase>) => void;
  onAdClosed?: (event: NativeSyntheticEvent<AdManagerEventBase>) => void;
  onAdCustomClick?: (
    event: NativeSyntheticEvent<AdManagerEventCustomClick>
  ) => void;
  onAdRecordImpression?: (
    event: NativeSyntheticEvent<AdManagerEventBase>
  ) => void;
  onAdPress?: (event: NativeSyntheticEvent<AdManagerEventBase>) => void;
};

export type NativeAdProps = NativeAdPropsBase & {
  adsManager: NativeAdsManager;
  adLoaderIndex?: string;
  onSizeChange?: (event: AdManagerEventSize) => void;
  onAdLoaded?: (event: AdType) => void;
  onAdFailedToLoad?: (error: Error) => void;
  onAppEvent?: (event: AdManagerEventAppEvent) => void;
  onAdClosed?: (event: AdManagerEventBase) => void;
  onAdOpened?: (event: AdManagerEventBase) => void;
  onAdCustomClick?: (event: AdManagerEventCustomClick) => void;
  onAdRecordImpression?: (event: AdManagerEventBase) => void;
  onAdPress?: (event: AdManagerEventBase) => void;
  renderNativeAd: (ad: AdType) => ReactNode;
};

export type NativeAdRef = {
  reloadAd: () => void;
  showInspector: () => void;
};
