import { NativeModules } from 'react-native';
const { CTKAdManagerNativeManager } = NativeModules;

export class NativeAdsManager {
  isValid: boolean;
  adUnitID: string;

  constructor(adUnitID: string, testDevices: string[]) {
    // Indicates whether AdsManager is ready to serve ads
    this.isValid = true;
    this.adUnitID = adUnitID;
    CTKAdManagerNativeManager.init(adUnitID, testDevices);
  }

  /**
   * Set the native ad manager.
   */
  toJSON() {
    return this.adUnitID;
  }
}
