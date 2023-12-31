#import "RNAdManagerNativeManager.h"
#import "RNAdManagerNativeView.h"

#import <React/RCTAssert.h>
#import <React/RCTBridge.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTConvert.h>
#import <React/RCTUIManager.h>
#import <React/RCTUtils.h>

#import "RNAdManagerUtils.h"

@interface RNAdManagerNativeManager ()

@property(nonatomic, strong) NSString *myAdChoiceViewAdUnitID;

@end

@implementation RNAdManagerNativeManager

RCT_EXPORT_MODULE(CTKAdManagerNativeManager)

@synthesize bridge = _bridge;

- (instancetype)init {
  self = [super init];
  if (self) {
    if (adsManagers == nil) {
      adsManagers = [NSMutableDictionary new];
    }
    if (adLoaders == nil) {
      adLoaders = [NSMutableDictionary new];
    }
  }
  return self;
}

static NSMutableDictionary<NSString *, RNAdManagerNativeManager *> *adsManagers;
static NSMutableDictionary<NSString *, GADAdLoader *> *adLoaders;

+ (BOOL)requiresMainQueueSetup {
  return NO;
}

RCT_EXPORT_METHOD(registerViewsForInteraction
                  : (nonnull NSNumber *)nativeAdViewTag clickableViewsTags
                  : (nonnull NSArray *)tags resolve
                  : (RCTPromiseResolveBlock)resolve reject
                  : (RCTPromiseRejectBlock)reject) {
  [_bridge.uiManager addUIBlock:^(
                         __unused RCTUIManager *uiManager,
                         NSDictionary<NSNumber *, UIView *> *viewRegistry) {
    RNAdManagerNativeView *nativeAdView = nil;

    if ([viewRegistry objectForKey:nativeAdViewTag] == nil) {
      reject(@"E_NO_NATIVEAD_VIEW", @"Could not find nativeAdView", nil);
      return;
    }

    if ([[viewRegistry objectForKey:nativeAdViewTag]
            isKindOfClass:[RNAdManagerNativeView class]]) {
      nativeAdView =
          (RNAdManagerNativeView *)[viewRegistry objectForKey:nativeAdViewTag];
    } else {
      reject(@"E_INVALID_VIEW_CLASS",
             @"View returned for passed native ad view tag is not an instance "
             @"of RNAdManagerNativeView",
             nil);
      return;
    }

    NSMutableArray<UIView *> *clickableViews = [NSMutableArray new];
    for (id tag in tags) {
      if ([viewRegistry objectForKey:tag]) {
        [clickableViews addObject:[viewRegistry objectForKey:tag]];
      } else {
        reject(@"E_INVALID_VIEW_TAG",
               [NSString stringWithFormat:@"Could not find view for tag:  %@",
                                          [tag stringValue]],
               nil);
        return;
      }
    }

    [nativeAdView registerViewsForInteraction:clickableViews];
    resolve(@[]);
  }];
}

RCT_EXPORT_METHOD(init
                  : (NSString *)adUnitID testDevices
                  : (NSArray *)testDevices) {
  if (adsManagers == nil) {
    adsManagers = [NSMutableDictionary new];
  }

  RNAdManagerNativeManager *adsManager = [RNAdManagerNativeManager alloc];

  adsManager.adUnitID = adUnitID;
  adsManager.testDevices =
      RNAdManagerProcessTestDevices(testDevices, GADSimulatorID);

  _myAdChoiceViewAdUnitID = adUnitID;

  [adsManagers setValue:adsManager forKey:adUnitID];
}

- (RNAdManagerNativeManager *)getAdsManager:(NSString *)adUnitID {
  return adsManagers[adUnitID];
}

- (GADAdLoader *)getAdLoader:(NSString *)adUnitID
                validAdTypes:(NSArray *)validAdTypes
                 loaderIndex:(NSString *)loaderIndex {
  if (adLoaders == nil) {
    adLoaders = [NSMutableDictionary new];
  }

  NSString *adLoaderKey = adUnitID;
  if ([validAdTypes containsObject:@"native"]) {
    adLoaderKey = [NSString stringWithFormat:@"%@%@", adLoaderKey, @"native"];
  }
  if ([validAdTypes containsObject:@"banner"]) {
    adLoaderKey = [NSString stringWithFormat:@"%@%@", adLoaderKey, @"banner"];
  }
  if ([validAdTypes containsObject:@"template"]) {
    NSString *index = loaderIndex ? loaderIndex : @"";
    adLoaderKey =
        [NSString stringWithFormat:@"%@%@%@", adLoaderKey, @"template", index];
  }

  GADAdLoader *adLoader = [adLoaders objectForKey:adLoaderKey];
  if (adLoader == nil) {
    // Loads an ad for any of app install, content, or custom native ads.
    NSMutableArray *adTypes = [[NSMutableArray alloc] init];
    if ([validAdTypes containsObject:@"native"]) {
      [adTypes addObject:GADAdLoaderAdTypeNative];
    }
    if ([validAdTypes containsObject:@"banner"]) {
      [adTypes addObject:GADAdLoaderAdTypeGAMBanner];
    }
    if ([validAdTypes containsObject:@"template"]) {
      [adTypes addObject:GADAdLoaderAdTypeCustomNative];
    }

    GADVideoOptions *videoOptions = [[GADVideoOptions alloc] init];
    videoOptions.startMuted = YES;

    adLoader = [[GADAdLoader alloc]
          initWithAdUnitID:adUnitID
        rootViewController:[UIApplication sharedApplication]
                               .delegate.window.rootViewController
                   adTypes:adTypes
                   options:@[ videoOptions ]];

    [adLoaders setValue:adLoader forKey:adLoaderKey];
  }

  return adLoader;
}

- (UIView *)view {
  return [[RNAdManagerNativeView alloc] initWithBridge:_bridge];
}

RCT_EXPORT_METHOD(reloadAd : (nonnull NSNumber *)reactTag) {
  [_bridge.uiManager
      addUIBlock:^(
          __unused RCTUIManager *uiManager,
          NSDictionary<NSNumber *, RNAdManagerNativeView *> *viewRegistry) {
        RNAdManagerNativeView *view = viewRegistry[reactTag];
        if (![view isKindOfClass:[RNAdManagerNativeView class]]) {
          RCTLogError(@"Invalid view returned from registry, expecting "
                      @"RNAdManagerNativeView, got: %@",
                      view);
        } else {
          [view reloadAd];
        }
      }];
}

RCT_CUSTOM_VIEW_PROPERTY(adsManager, NSString, RNAdManagerNativeView) {
  RNAdManagerNativeManager *_adsManager = [[_bridge
      moduleForClass:[RNAdManagerNativeManager class]] getAdsManager:json];
  [view loadAd:_adsManager];
}

RCT_EXPORT_VIEW_PROPERTY(loaderIndex, NSString)
RCT_EXPORT_VIEW_PROPERTY(customTemplateIds, NSArray)
RCT_EXPORT_VIEW_PROPERTY(customClickTemplateIds, NSArray)
RCT_EXPORT_VIEW_PROPERTY(validAdTypes, NSArray)
RCT_EXPORT_VIEW_PROPERTY(adSize, NSString)
RCT_EXPORT_VIEW_PROPERTY(validAdSizes, NSArray)
RCT_EXPORT_VIEW_PROPERTY(targeting, NSDictionary)

RCT_EXPORT_VIEW_PROPERTY(headlineTextView, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(bodyTextView, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(advertiserNameView, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(iconView, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(imageView, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(callToActionTextView, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(mediaView, NSNumber)

RCT_EXPORT_VIEW_PROPERTY(onSizeChange, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onAppEvent, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onAdLoaded, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onAdFailedToLoad, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onAdOpened, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onAdClosed, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onAdCustomClick, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onAdRecordImpression, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onAdPress, RCTBubblingEventBlock)

@end
