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
  [[NSNotificationCenter defaultCenter] postNotificationName:@"CHATBUTTON_CLICKED" object:nil];
}
@end
