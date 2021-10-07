//
//  JSCommunicateComponent.m
//  JitsiMeet
//
//  Created by Chandra Prakash on 7/31/19.
//  Copyright © 2019 Jitsi. All rights reserved.
//

#import "JSCommunicateComponent.h"

@implementation JSCommunicateComponent
{
    bool hasListeners;
}
RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents
{
    return @[@"startTimer", @"stopTimer" , @"connectionStatus", @"selfTileView"];
}
-(void)startObserving {
    hasListeners = YES;
}

// Will be called when this module's last listener is removed, or on dealloc.
-(void)stopObserving {
    hasListeners = NO;
}
-(void)startTimer{
    
    [self sendEventWithName:@"startTimer" body:@{@"name": @"startTimer"}];

}
-(void)stopTimer{
    
    [self sendEventWithName:@"stopTimer" body:@{@"name": @"stopTimer"}];
    
}
-(void)sendConnectionStatus:(NSString *)statusString{
     [self sendEventWithName:@"connectionStatus" body:@{@"status": statusString}];
}
-(void)selfTileView{
    [self sendEventWithName:@"selfTileView" body:@{@"name": @"selfTileView"}];
}
@end
