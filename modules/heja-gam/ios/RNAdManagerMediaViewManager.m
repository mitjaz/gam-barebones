#import "RNAdManagerMediaViewManager.h"
#import "RNAdManagerMediaView.h"

@implementation RNAdManagerMediaViewManager

RCT_EXPORT_MODULE(CTKAdManagerMediaViewManager);

@synthesize bridge = _bridge;

-(UIView *)view
{

 return [[RNAdManagerMediaView alloc] init];
    
}

RCT_EXPORT_VIEW_PROPERTY(pause, BOOL)
RCT_EXPORT_VIEW_PROPERTY(muted, BOOL)

RCT_EXPORT_VIEW_PROPERTY(onVideoPlay, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onVideoPause, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onVideoEnd, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onVideoMute, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onVideoStart, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onVideoProgress, RCTDirectEventBlock)



RCT_EXPORT_METHOD(getProgress:(nonnull NSNumber *)reactTag)
{
  [_bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, RNAdManagerMediaView *> *viewRegistry) {
    RNAdManagerMediaView *view = viewRegistry[reactTag];
    if (![view isKindOfClass:[RNAdManagerMediaView class]]) {
      RCTLogError(@"Invalid view returned from registry, expecting RNGADNativeView, got: %@", view);
    } else {
      [view getCurrentProgress];
    }
  }];
}


@end
