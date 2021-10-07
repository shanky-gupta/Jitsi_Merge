//
//  JSCommunicateComponent.h
//  JitsiMeet
//
//  Created by Chandra Prakash on 7/31/19.
//  Copyright © 2019 Jitsi. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>



NS_ASSUME_NONNULL_BEGIN

@interface JSCommunicateComponent : RCTEventEmitter <RCTBridgeModule>

-(void)stopTimer;
-(void)startTimer;
-(void)sendConnectionStatus:(NSString *)statusString;
-(void)selfTileView;
@end

NS_ASSUME_NONNULL_END
