#import "RNAdManagerNativeManager.h"

#import <React/RCTView.h>
#import <React/RCTBridge.h>
#import <React/RCTComponent.h>
#import <React/RCTUIManager.h>

#import <GoogleMobileAds/GoogleMobileAds.h>

@class RCTEventDispatcher;

@interface RNAdManagerNativeView : RCTView <GADNativeAdLoaderDelegate, GADNativeAdDelegate, GAMBannerAdLoaderDelegate, GADCustomNativeAdLoaderDelegate, GADVideoControllerDelegate>

@property(nonatomic) NSMutableArray<UIView *> *clickableViews;

@property(nonatomic) BOOL isLoading;

/// You must keep a strong reference to the GADAdLoader during the ad loading process.
@property(nonatomic, strong) IBOutlet GADAdLoader *adLoader;

/// The native ad that is being loaded.
@property(nonatomic, strong) IBOutlet GADNativeAd *nativeAd;

/// The native ad view
@property(nonatomic, strong) IBOutlet GADNativeAdView *nativeAdView;

/// The DFP banner view.
@property(nonatomic, strong) IBOutlet GAMBannerView *bannerView;

/// The native custom template ad
@property(nonatomic, strong) IBOutlet GADCustomNativeAd *nativeCustomTemplateAd;

@property (nonatomic, copy) NSString *loaderIndex;
@property (nonatomic, copy) NSArray *customTemplateIds;
@property (nonatomic, copy) NSArray *customClickTemplateIds;
@property (nonatomic, copy) NSArray *validAdTypes;
@property (nonatomic, copy) NSString *adSize;
@property (nonatomic, copy) NSArray *validAdSizes;
@property (nonatomic, copy) NSDictionary *targeting;

@property (nonatomic, copy) NSNumber *headlineTextView;
@property (nonatomic, copy) NSNumber *bodyTextView;
@property (nonatomic, copy) NSNumber *advertiserNameView;
@property (nonatomic, copy) NSNumber *iconView;
@property (nonatomic, copy) NSNumber *imageView;
@property (nonatomic, copy) NSNumber *callToActionTextView;
@property (nonatomic, copy) NSNumber *mediaView;

@property (nonatomic, copy) RCTBubblingEventBlock onSizeChange;
@property (nonatomic, copy) RCTBubblingEventBlock onAppEvent;
@property (nonatomic, copy) RCTBubblingEventBlock onAdLoaded;
@property (nonatomic, copy) RCTBubblingEventBlock onAdFailedToLoad;
@property (nonatomic, copy) RCTBubblingEventBlock onAdOpened;
@property (nonatomic, copy) RCTBubblingEventBlock onAdPress;
@property (nonatomic, copy) RCTBubblingEventBlock onAdClosed;
@property (nonatomic, copy) RCTBubblingEventBlock onAdCustomClick;
@property (nonatomic, copy) RCTBubblingEventBlock onAdRecordImpression;

- (instancetype)initWithBridge:(RCTBridge *)bridge;
- (void)registerViewsForInteraction:(NSArray<UIView *> *)clickableViews;
- (void)reloadAd;
- (void)loadAd:(RNAdManagerNativeManager *)adManager;

@end
