//
//  OpenMelpAppChat.m
//  jitsi-meet
//
//  Created by Chandra Prakash on 7/23/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "OpenMelpAppChat.h"

@implementation OpenMelpAppChat

RCT_EXPORT_MODULE(OpenMelpAppChat);
RCT_EXPORT_METHOD(openMelpChat) {
  NSLog(@"RN binding - Native View - Loading MyViewController.swift");
 
}
RCT_EXPORT_METHOD(audioOnlyToggled) {
    NSLog(@"RN binding - Native View - Loading MyViewController.swift");
    [[NSNotificationCenter defaultCenter] postNotificationName:@"AUDIO_ONLY_TOGGLED" object:nil];
}
RCT_EXPORT_METHOD(videoButtonToggled) {
    NSLog(@"RN binding - Native View - Loading MyViewController.swift");
    [[NSNotificationCenter defaultCenter] postNotificationName:@"VIDEO_BUTTON_TOGGLED" object:nil];
}

RCT_EXPORT_METHOD(getNumberOfParticipants:(int)participants) {
    NSLog(@"RN binding - Native View - Loading MyViewController.swift");
    
}
RCT_EXPORT_METHOD(anyuserleftmeeting) {

     [[NSNotificationCenter defaultCenter] postNotificationName:@"USER_LEFTMEETING" object:nil];
    
}
RCT_EXPORT_METHOD(anyuserjoinmeeting) {

     [[NSNotificationCenter defaultCenter] postNotificationName:@"USER_JOINEDMEETING" object:nil];
    
}
RCT_EXPORT_METHOD(shareMeetingInfo) {
    [[NSNotificationCenter defaultCenter] postNotificationName:@"INVITE_USER" object:nil];
}
RCT_EXPORT_METHOD(showAttendees) {
    [[NSNotificationCenter defaultCenter] postNotificationName:@"OPEN_ATTENDIEES" object:nil];
}
RCT_EXPORT_METHOD(showDesktop) {
    [[NSNotificationCenter defaultCenter] postNotificationName:@"SHOW_DESKTOP" object:nil];
}



@end
