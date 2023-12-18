import type { AdManagerTemplateImage } from './native';

export type AdManagerEventBase = {
  target?: number;
};

export type AdManagerEventErrorPayload = {
  message: string;
  framesToPop?: number;
};

export type AdManagerEventError = AdManagerEventBase & {
  error: AdManagerEventErrorPayload;
};

export type AdManagerEventAppEvent = AdManagerEventBase & {
  name: string;
  info: string;
};

export enum AdFormatLabel {
  TEMPLATE = 'template',
  BANNER = 'banner',
  NATIVE = 'native',
}

export type AdManagerEventLoadedBanner = AdManagerEventBase & {
  type: AdFormatLabel.BANNER;
  gadSize: {
    adSize: string;
    width: number;
    height: number;
  };
  isFluid?: string;
  measurements?: {
    adWidth: number;
    adHeight: number;
    width: number;
    height: number;
    left: number;
    top: number;
  };
};

export type AdManagerEventLoadedTemplate = {
  type: AdFormatLabel.TEMPLATE;
  templateID: string;
  [key: string]: AdManagerTemplateImage | string;
};

export type AdManagerEventLoadedNative = {
  type: AdFormatLabel.NATIVE;
  headline?: string;
  bodyText?: string;
  callToActionText?: string;
  advertiserName?: string;
  starRating?: string;
  storeName?: string;
  price?: string;
  icon?: AdManagerTemplateImage;
  images?: AdManagerTemplateImage[];
  socialContext?: string;
};

export type AdManagerEventSize = AdManagerEventBase & {
  type: AdFormatLabel.BANNER;
  width: number;
  height: number;
};

export type AdManagerEventCustomClick = {
  assetName: string;
  [key: string]: string;
};
