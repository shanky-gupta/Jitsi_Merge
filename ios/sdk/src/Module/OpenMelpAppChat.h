//
//  OpenMelpAppChat.h
//  jitsi-meet
//
//  Created by Chandra Prakash on 7/23/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

NS_ASSUME_NONNULL_BEGIN

@interface OpenMelpAppChat : NSObject<RCTBridgeModule>
-(void)openMelpChat;
-(void)audioOnlyToggled;
-(void)shareMeetingInfo;
-(void)anyuserleftmeeting;
-(void)anyuserjoinmeeting;
-(void)videoButtonToggled;
-(void)showAttendees;
-(void)showDesktop;
-(void)setSpeakerOn;
-(void)getNumberOfParticipants:(int)participants;
@end

NS_ASSUME_NONNULL_END
