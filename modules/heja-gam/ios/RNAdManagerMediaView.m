#import "RNAdManagerMediaView.h"

@implementation RNAdManagerMediaView : UIView

GADMediaView *gadMediaView;
GADVideoController *vc;

- (instancetype)initWithFrame:(CGRect)frame {
  if ((self = [super initWithFrame:frame])) {
      gadMediaView = [[GADMediaView alloc] init];
      [self addSubview:gadMediaView];
      gadMediaView.translatesAutoresizingMaskIntoConstraints = NO;
      gadMediaView.frame = self.bounds;
      [NSLayoutConstraint activateConstraints:
       @[[gadMediaView.topAnchor constraintEqualToAnchor:self.topAnchor],
         [gadMediaView.bottomAnchor constraintEqualToAnchor:self.bottomAnchor],
         [gadMediaView.leadingAnchor constraintEqualToAnchor:self.leadingAnchor],
         [gadMediaView.trailingAnchor constraintEqualToAnchor:self.trailingAnchor],
       ]];
  }
  return self;
}

- (void)setPause:(BOOL *)pause {
    if (pause) {
        
        if (gadMediaView.mediaContent != nil && vc != nil) {
            [vc pause];
        }
    } else {
        if (gadMediaView.mediaContent != nil && vc != nil) {
            [vc play];
        }
    }
}

- (void)setMuted:(BOOL *)muted {
    if (gadMediaView.mediaContent != nil && vc != nil) {
        [vc setMute:muted? YES : NO];
    }
}

- (void)videoControllerDidPlayVideo:(GADVideoController *)videoController {
    if (self.onVideoPlay) {
        vc = videoController;
        self.onVideoPlay(@{});
    }
}

- (void)videoControllerDidPauseVideo:(GADVideoController *)videoController {
    if (self.onVideoPause) {
        self.onVideoPause(@{});
    }
}

- (void)videoControllerDidMuteVideo:(GADVideoController *)videoController {
    if (self.onVideoMute) {
        self.onVideoMute(@{@"muted":@YES});
    }
}

- (void)videoControllerDidUnmuteVideo:(GADVideoController *)videoController {
    if (self.onVideoMute) {
        self.onVideoMute(@{@"muted":@NO});
    }
}

- (void)videoControllerDidEndVideoPlayback:(GADVideoController *)videoController {
    if (self.onVideoEnd) {
        self.onVideoEnd(@{});
    }
}

- (void)getCurrentProgress
{
    
    if (self.onVideoProgress) {
        if (gadMediaView.mediaContent != nil && gadMediaView.mediaContent.hasVideoContent && gadMediaView.mediaContent.duration > 0  ) {
            self.onVideoProgress(@{
                @"duration":[NSString stringWithFormat: @"%f", gadMediaView.mediaContent.duration],
                @"currentTime":[NSString stringWithFormat: @"%f", gadMediaView.mediaContent.currentTime]
                                 });
        }
    }
}

@end
