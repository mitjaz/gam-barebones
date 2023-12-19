#import <GoogleMobileAds/GoogleMobileAds.h>
#import <React/RCTViewManager.h>

@interface RNAdManagerNativeManager : RCTViewManager

@property(strong, nonatomic) NSString *adUnitID;
@property(strong, nonatomic) NSArray *testDevices;

- (RNAdManagerNativeManager *)getAdsManager:(NSString *)adUnitID;
- (GADAdLoader *)getAdLoader:(NSString *)adUnitID
                validAdTypes:(NSArray *)validAdTypes
                 loaderIndex:(NSString *)loaderIndex;

@end
