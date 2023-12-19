#import "RNAdManagerNativeView.h"
#import "RNAdManagerMediaView.h"
#import "RNAdManagerNativeManager.h"
#import "RNAdManagerUtils.h"

#import <React/RCTBridgeModule.h>
#import <React/RCTConvert.h>
#import <React/RCTLog.h>
#import <React/RCTUIManagerUtils.h>
#import <React/RCTUtils.h>
#import <React/UIView+React.h>

#include "RCTConvert+GADAdSize.h"

#define HEADLINE_TEXT_TAG 1
#define IMAGE_VIEW_CONTAINER_TAG 2
#define ICON_VIEW_TAG 3
#define BODY_VIEW_TAG 4
#define CALL_TO_ACTION_VIEW_TAG 5
#define ADVERTISER_VIEW_TAG 6
#define MEDIA_VIEW_CONTAINER_TAG 7

static NSString *const kAdTypeBanner = @"banner";
static NSString *const kAdTypeNative = @"native";
static NSString *const kAdTypeTemplate = @"template";

@interface RNAdManagerNativeView ()

@property(nonatomic, strong) IBOutlet RCTBridge *bridge;

@end

@implementation RNAdManagerNativeView {
  NSString *_nativeCustomTemplateAdClickableAsset;
  NSString *_adUnitID;
  NSArray *_testDevices;
}

RCTBridge *bridge;

- (void)layoutSubviews {
  [super layoutSubviews];

  self.nativeAdView.bounds = self.bounds;
  self.nativeAdView.frame = self.bounds;

  if (self.nativeAdView != nil && self.bounds.size.height > 0) {
    [self.nativeAdView removeFromSuperview];
    [self addSubview:self.nativeAdView];
  }
}

- (instancetype)initWithBridge:(RCTBridge *)bridge {
  self = [super init];

  if (self) {
    self.bridge = bridge;
    self.isLoading = NO;
    self.clickableViews = [NSMutableArray array];
  }

  return self;
}

- (void)setClickableViews {
  for (UIView *view in self.clickableViews) {
    if (view.tag == HEADLINE_TEXT_TAG) {
      [self.nativeAdView setHeadlineView:view];
    } else if (view.tag == ICON_VIEW_TAG) {
      [self.nativeAdView setIconView:view];
    } else if (view.tag == BODY_VIEW_TAG) {
      [self.nativeAdView setBodyView:view];
    } else if (view.tag == ADVERTISER_VIEW_TAG) {
      [self.nativeAdView setAdvertiserView:view];
    } else if (view.tag == IMAGE_VIEW_CONTAINER_TAG) {
      [self.nativeAdView setImageView:view];
    } else if (view.tag == CALL_TO_ACTION_VIEW_TAG) {
      [self.nativeAdView setCallToActionView:view];
    } else if (view.tag == MEDIA_VIEW_CONTAINER_TAG) {
      if (self.nativeAd.mediaContent) {
        GADMediaContent *mediaContent = self.nativeAd.mediaContent;
        GADMediaView *gadMediaView = view.subviews.firstObject;
        [gadMediaView setMediaContent:mediaContent];
        [self.nativeAdView setMediaView:gadMediaView];
      }
    }
  }
}

- (void)didSetProps:(NSArray<NSString *> *)changedProps {
  if (self.isLoading == NO && self.nativeAd != nil) {
    [self setClickableViews];
  }
}

- (void)loadAd:(RNAdManagerNativeManager *)adManager {
  NSLog(@"[HEJA] Load ad");
  _adUnitID = adManager.adUnitID;
  _testDevices = adManager.testDevices;

  if (_validAdTypes == nil) {
    _validAdTypes = @[ kAdTypeBanner, kAdTypeNative, kAdTypeTemplate ];
  }

  self.adLoader = [adManager getAdLoader:_adUnitID
                            validAdTypes:_validAdTypes
                             loaderIndex:_loaderIndex];
  self.adLoader.delegate = self;

  GADMobileAds.sharedInstance.requestConfiguration.testDeviceIdentifiers =
      _testDevices;
}

- (void)reloadAd {
  NSLog(@"[HEJA] Reload %@ - %d", self.adLoader, self.isLoading);
  if (self.adLoader == nil || self.isLoading == YES) {
    return;
  }

  self.isLoading = YES;

  GAMRequest *request = [GAMRequest request];

  if (_targeting != nil) {
    NSDictionary *customTargeting =
        [_targeting objectForKey:@"customTargeting"];
    if (customTargeting != nil) {
      request.customTargeting = customTargeting;
    }
    NSArray *categoryExclusions =
        [_targeting objectForKey:@"categoryExclusions"];
    if (categoryExclusions != nil) {
      request.categoryExclusions = categoryExclusions;
    }
    NSArray *keywords = [_targeting objectForKey:@"keywords"];
    if (keywords != nil) {
      request.keywords = keywords;
    }
    NSString *content_url = [_targeting objectForKey:@"content_url"];
    if (content_url != nil) {
      request.contentURL = content_url;
    }
    NSString *publisherProvidedID =
        [_targeting objectForKey:@"publisherProvidedID"];
    if (publisherProvidedID != nil) {
      request.publisherProvidedID = publisherProvidedID;
    }
  }

  @try {
    [self.adLoader loadRequest:request];
  } @catch (NSException *e) {
    NSLog(@"[HEJA] Loader Error %@", e);
    if (self.onAdFailedToLoad) {
      self.onAdFailedToLoad(@{
        @"error" :
            @{@"message" : [e.userInfo valueForKey:NSLocalizedDescriptionKey]}
      });
    }
  }
}

#pragma mark React props setters

- (void)setHeadlineTextView:(NSNumber *)tag {
  UIView *view = [self.bridge.uiManager viewForReactTag:tag];
  view.tag = HEADLINE_TEXT_TAG;
  view.userInteractionEnabled = NO;
  [self.clickableViews addObject:view];
}

- (void)setBodyTextView:(NSNumber *)tag {
  UIView *view = [self.bridge.uiManager viewForReactTag:tag];
  view.tag = BODY_VIEW_TAG;
  view.userInteractionEnabled = NO;
  [self.clickableViews addObject:view];
}

- (void)setAdvertiserNameView:(NSNumber *)tag {
  UIView *view = [self.bridge.uiManager viewForReactTag:tag];
  view.tag = ADVERTISER_VIEW_TAG;
  view.userInteractionEnabled = NO;
  [self.clickableViews addObject:view];
}

- (void)setIconView:(NSNumber *)tag {
  UIView *view = [self.bridge.uiManager viewForReactTag:tag];
  view.tag = ICON_VIEW_TAG;
  view.userInteractionEnabled = NO;
  [self.clickableViews addObject:view];
}

- (void)setImageView:(NSNumber *)tag {
  UIView *view = [self.bridge.uiManager viewForReactTag:tag];
  view.tag = IMAGE_VIEW_CONTAINER_TAG;
  view.userInteractionEnabled = NO;
  [self.clickableViews addObject:view];
}

- (void)setMediaView:(NSNumber *)tag {
  RNAdManagerMediaView *view = [self.bridge.uiManager viewForReactTag:tag];
  view.tag = MEDIA_VIEW_CONTAINER_TAG;
  view.userInteractionEnabled = NO;
  [self.clickableViews addObject:view];
}

- (void)setCallToActionTextView:(NSNumber *)tag {
  UIView *view = [self.bridge.uiManager viewForReactTag:tag];
  view.tag = CALL_TO_ACTION_VIEW_TAG;
  view.userInteractionEnabled = NO;
  [self.clickableViews addObject:view];
}

- (void)setCustomTemplateIds:(NSArray *)customTemplateIds {
  _customTemplateIds = customTemplateIds;
}

- (void)setCustomClickTemplateIds:(NSArray *)customClickTemplateIds {
  _customClickTemplateIds = customClickTemplateIds;
}

- (void)setValidAdTypes:(NSArray *)adTypes {
  __block NSMutableArray *validAdTypes =
      [[NSMutableArray alloc] initWithCapacity:adTypes.count];
  [adTypes enumerateObjectsUsingBlock:^(id jsonValue, NSUInteger idx,
                                        __unused BOOL *stop) {
    [validAdTypes addObject:[RCTConvert NSString:jsonValue]];
  }];
  _validAdTypes = validAdTypes;
}

- (void)setAdSize:(NSString *)adSize {
  _adSize = adSize;
}

- (void)setLoaderIndex:(NSString *)loaderIndex {
  _loaderIndex = loaderIndex;
}

- (void)setValidAdSizes:(NSArray *)adSizes {
  __block NSMutableArray *validAdSizes =
      [[NSMutableArray alloc] initWithCapacity:adSizes.count];
  [adSizes enumerateObjectsUsingBlock:^(id jsonValue, NSUInteger idx,
                                        __unused BOOL *stop) {
    GADAdSize adSize = [RCTConvert GADAdSize:jsonValue];
    if (GADAdSizeEqualToSize(adSize, GADAdSizeInvalid)) {
      RCTLogWarn(@"Invalid adSize %@", jsonValue);
    } else if (![validAdSizes containsObject:NSValueFromGADAdSize(adSize)]) {
      [validAdSizes addObject:NSValueFromGADAdSize(adSize)];
    }
  }];
  _validAdSizes = validAdSizes;
}

#pragma mark GADAdLoaderDelegate implementation

/// Tells the delegate an ad request failed.UnifiedNativeAdView
- (void)adLoader:(nonnull GADAdLoader *)adLoader
    didFailToReceiveAdWithError:(nonnull NSError *)error {
  self.isLoading = NO;

  if (self.onAdFailedToLoad) {
    self.onAdFailedToLoad(
        @{@"error" : @{@"message" : [error localizedDescription]}});
  }

  self.nativeAdView = nil;

  if (self.bannerView != nil) {
    self.bannerView.delegate = nil;
    self.bannerView.adSizeDelegate = nil;
    self.bannerView.appEventDelegate = nil;
    self.bannerView.rootViewController = nil;
    self.bannerView = nil;
  }

  self.nativeCustomTemplateAd = nil;

  if (self.nativeAd != nil) {
    self.nativeAd.delegate = nil;
    self.nativeAd = nil;
  }
}

#pragma mark GADNativeAdLoaderDelegate implementation

- (void)adLoader:(GADAdLoader *)adLoader
    didReceiveNativeAd:(GADNativeAd *)nativeAd {
  NSLog(@"[HEJA] didReceiveNativeAd");

  self.isLoading = NO;
  self.nativeAd = nativeAd;

  [self.bannerView removeFromSuperview];
  [self.nativeAdView removeFromSuperview];

  self.nativeAdView = [[GADNativeAdView alloc] init];
  self.nativeAdView.nativeAd = _nativeAd;

  // Set ourselves as the ad delegate to be notified of native ad events.
  self.nativeAd.delegate = self;

  [self addSubview:self.nativeAdView];

  [self triggerAdLoadedEvent:self.nativeAd];

  if (self.bannerView != nil) {
    self.bannerView.delegate = nil;
    self.bannerView.adSizeDelegate = nil;
    self.bannerView.appEventDelegate = nil;
    self.bannerView.rootViewController = nil;
    self.bannerView = nil;
  }

  self.nativeCustomTemplateAd = nil;
}

- (void)triggerAdLoadedEvent:(GADNativeAd *)nativeAd {
  if (self.onAdLoaded) {
    NSMutableDictionary *ad = [[NSMutableDictionary alloc]
        initWithObjectsAndKeys:kAdTypeNative, @"type", nativeAd.headline,
                               @"headline", nativeAd.body, @"bodyText",
                               nativeAd.callToAction, @"callToActionText",
                               nativeAd.advertiser, @"advertiserName",
                               nativeAd.starRating, @"starRating",
                               nativeAd.store, @"storeName", nativeAd.price,
                               @"price", nil, @"icon", nil, @"images", nil];

    if (nativeAd.icon != nil) {
      ad[@"icon"] = [[NSMutableDictionary alloc]
          initWithObjectsAndKeys:
              nativeAd.icon.imageURL.absoluteString, @"uri",
              [[NSNumber numberWithFloat:nativeAd.icon.image.size.width]
                  stringValue],
              @"width",
              [[NSNumber numberWithFloat:nativeAd.icon.image.size.height]
                  stringValue],
              @"height",
              [[NSNumber numberWithFloat:nativeAd.icon.scale] stringValue],
              @"scale", nil];
    }

    if (nativeAd.images != nil) {
      NSMutableArray *images = [[NSMutableArray alloc] init];
      [nativeAd.images enumerateObjectsUsingBlock:^(GADNativeAdImage *value,
                                                    NSUInteger idx,
                                                    __unused BOOL *stop) {
        [images
            addObject:[[NSMutableDictionary alloc]
                          initWithObjectsAndKeys:
                              value.imageURL.absoluteString, @"uri",
                              [[NSNumber numberWithFloat:value.image.size.width]
                                  stringValue],
                              @"width",
                              [[NSNumber
                                  numberWithFloat:value.image.size.height]
                                  stringValue],
                              @"height",
                              [[NSNumber numberWithFloat:value.scale]
                                  stringValue],
                              @"scale", nil]];
      }];
      ad[@"images"] = images;
    }

    self.onAdLoaded(ad);
  }
}

- (void)triggerAdCustomClickEvent:(nonnull NSString *)assetID {
  if (self.onAdCustomClick) {
    NSMutableDictionary *ad = [[NSMutableDictionary alloc]
        initWithObjectsAndKeys:assetID, @"assetName", nil];

    [self.nativeCustomTemplateAd.availableAssetKeys
        enumerateObjectsUsingBlock:^(NSString *value, NSUInteger idx,
                                     __unused BOOL *stop) {
          if ([self.nativeCustomTemplateAd stringForKey:value] != nil) {
            NSString *assetVal =
                [self.nativeCustomTemplateAd stringForKey:value];
            ad[value] = assetVal;
          }
        }];

    self.onAdCustomClick(ad);
  }
}

#pragma mark GAMBannerAdLoaderDelegate implementation

- (nonnull NSArray<NSValue *> *)validBannerSizesForAdLoader:
    (nonnull GADAdLoader *)adLoader {
  NSMutableArray *validAdSizes = [NSMutableArray arrayWithArray:_validAdSizes];
  if (_adSize != nil) {
    GADAdSize adSize = [RCTConvert GADAdSize:_adSize];
    if (GADAdSizeEqualToSize(adSize, GADAdSizeInvalid)) {
      RCTLogWarn(@"Invalid adSize %@", _adSize);
    } else if (![validAdSizes containsObject:NSValueFromGADAdSize(adSize)]) {
      [validAdSizes addObject:NSValueFromGADAdSize(adSize)];
    }
  }
  return validAdSizes;
}

- (void)adLoader:(nonnull GADAdLoader *)adLoader
    didReceiveGAMBannerView:(nonnull GAMBannerView *)bannerView {
  NSLog(@"[HEJA] didReceiveGAMBannerView");
  self.isLoading = NO;
  [self.bannerView removeFromSuperview];
  [self.nativeAdView removeFromSuperview];
  self.bannerView = bannerView;
  self.bannerView.translatesAutoresizingMaskIntoConstraints = YES;

  [self addSubview:self.bannerView];

  if (self.onSizeChange) {
    self.onSizeChange(@{
      @"type" : kAdTypeBanner,
      @"width" : @(self.bannerView.frame.size.width),
      @"height" : @(self.bannerView.frame.size.height)
    });
  }

  if (self.onAdLoaded) {
    self.onAdLoaded(@{
      @"type" : kAdTypeBanner,
      @"gadSize" : @{
        @"adSize" : NSStringFromGADAdSize(self.bannerView.adSize),
        @"width" : @(self.bannerView.frame.size.width),
        @"height" : @(self.bannerView.frame.size.height)
      },
      @"isFluid" : GADAdSizeIsFluid(self.bannerView.adSize) ? @"true"
                                                            : @"false",
      @"measurements" : @{
        @"adWidth" : @(self.bannerView.adSize.size.width),
        @"adHeight" : @(self.bannerView.adSize.size.height),
        @"width" : @(self.bannerView.frame.size.width),
        @"height" : @(self.bannerView.frame.size.height),
        @"left" : @(self.bannerView.frame.origin.x),
        @"top" : @(self.bannerView.frame.origin.y)
      },
    });
  }

  self.nativeAdView = nil;

  self.nativeCustomTemplateAd = nil;

  if (self.nativeAd != nil) {
    self.nativeAd.delegate = nil;
    self.nativeAd = nil;
  }
}

#pragma mark GADCustomNativeAdLoaderDelegate implementation

- (void)adLoader:(nonnull GADAdLoader *)adLoader
    didReceiveCustomNativeAd:(nonnull GADCustomNativeAd *)customNativeAd {
  NSLog(@"[HEJA] didReceiveCustomNativeAd");
  self.isLoading = NO;
  [self.bannerView removeFromSuperview];
  [self.nativeAdView removeFromSuperview];

  self.nativeCustomTemplateAd = customNativeAd;

  if (self.customClickTemplateIds != nil &&
      [self.customClickTemplateIds containsObject:customNativeAd.formatID]) {
    [self.nativeCustomTemplateAd setCustomClickHandler:^(NSString *assetID) {
      [self triggerAdCustomClickEvent:assetID];
    }];
  }

  [self triggerCustomAdLoadedEvent:self.nativeCustomTemplateAd];

  [self.nativeCustomTemplateAd recordImpression];

  self.nativeAdView = nil;

  if (self.bannerView != nil) {
    self.bannerView.delegate = nil;
    self.bannerView.adSizeDelegate = nil;
    self.bannerView.appEventDelegate = nil;
    self.bannerView.rootViewController = nil;
    self.bannerView = nil;
  }

  if (self.nativeAd != nil) {
    self.nativeAd.delegate = nil;
    self.nativeAd = nil;
  }
}

- (nonnull NSArray<NSString *> *)customNativeAdFormatIDsForAdLoader:
    (nonnull GADAdLoader *)adLoader {
  if (_customTemplateIds == nil) {
    _customTemplateIds = @[ @"11891103" ];
  }

  return _customTemplateIds;
}

- (void)triggerCustomAdLoadedEvent:(GADCustomNativeAd *)nativeCustomTemplateAd {
  if (self.onAdLoaded) {
    NSMutableDictionary *ad = [[NSMutableDictionary alloc]
        initWithObjectsAndKeys:kAdTypeTemplate, @"type",
                               nativeCustomTemplateAd.formatID, @"templateID",
                               nil];

    [nativeCustomTemplateAd.availableAssetKeys enumerateObjectsUsingBlock:^(
                                                   NSString *value,
                                                   NSUInteger idx,
                                                   __unused BOOL *stop) {
      if ([nativeCustomTemplateAd stringForKey:value] != nil) {
        NSString *assetVal = [nativeCustomTemplateAd stringForKey:value];
        if (_nativeCustomTemplateAdClickableAsset == nil &&
            assetVal.length > 2) {
          _nativeCustomTemplateAdClickableAsset = value;
        }
        ad[value] = assetVal;
      } else if ([nativeCustomTemplateAd imageForKey:value] != nil) {
        GADNativeAdImage *image = [nativeCustomTemplateAd imageForKey:value];
        ad[value] = [[NSMutableDictionary alloc]
            initWithObjectsAndKeys:image.imageURL.absoluteString, @"uri",
                                   [[NSNumber
                                       numberWithFloat:image.image.size.width]
                                       stringValue],
                                   @"width",
                                   [[NSNumber
                                       numberWithFloat:image.image.size.height]
                                       stringValue],
                                   @"height",
                                   [[NSNumber numberWithFloat:image.scale]
                                       stringValue],
                                   @"scale", nil];
      }
    }];

    self.onAdLoaded(ad);
  }
}

#pragma mark GADNativeAdDelegate

- (void)nativeAdDidRecordImpression:(nonnull GADNativeAd *)nativeAd {
  if (self.onAdRecordImpression) {
    self.onAdRecordImpression(@{});
  }
}

- (void)nativeAdWillPresentScreen:(nonnull GADNativeAd *)nativeAd {
  if (self.onAdOpened) {
    self.onAdOpened(@{});
  }
}

- (void)nativeAdDidRecordClick:(nonnull GADNativeAd *)nativeAd {
  if (self.onAdPress) {
    self.onAdPress(@{});
  }
}

- (void)nativeAdDidDismissScreen:(nonnull GADNativeAd *)nativeAd {
  if (self.onAdClosed) {
    self.onAdClosed(@{});
  }
}

#pragma mark Old triggerable view implementation

- (void)registerViewsForInteraction:(NSArray<UIView *> *)clickableViews {
  NSLog(@"[HEJA] registerViewsForInteraction");
}

@end
