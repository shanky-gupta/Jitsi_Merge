//
//  CallViewController.m
//  jitsi-meet
//
//  Created by Chandra Prakash on 10/18/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "CallViewController.h"
#import <CallKit/CallKit.h>
#import <AVFoundation/AVFoundation.h>
#import <JitsiMeet/JitsiMeet-Swift.h>
#import <React/RCTBridge.h>
#import <React/RCTEventEmitter.h>
#import <React/RCTBridgeModule.h>
#import "DocBrowser.h"

static NSString * const kARDAudioTrackId = @"ARDAMSa0";
@import CoreSpotlight;
@import MobileCoreServices;
@import Intents;  // Needed for NSUserActivity suggestedInvocationPhrase

@import JitsiMeet;
#import "Types.h"


#define CHATBUTTON_CLICKED   @"CHATBUTTON_CLICKED"
#define AUDIO_ONLY_TOGGLED   @"AUDIO_ONLY_TOGGLED"
#define INVITE_USER          @"INVITE_USER"
#define USER_JOINEDMEETING   @"USER_JOINEDMEETING"
#define USER_LEFTMEETING     @"USER_LEFTMEETING"
#define GET_REACT_BRIDGE_OBJECT     @"GET_REACT_BRIDGE_OBJECT"
#define VIDEO_BUTTON_TOGGLED  @"VIDEO_BUTTON_TOGGLED"
#define SHOW_DESKTOP  @"SHOW_DESKTOP"
#define OPEN_ATTENDIEES  @"OPEN_ATTENDIEES"
#define OPEN_DOCUMENT  @"OPEN_DOCUMENT"
#define HANGUPCALL_FROM_AUDIO_SCREEN   @"HANGUPCALL_FROM_AUDIO_SCREEN"


@interface CallViewController ()
{
  JitsiMeetView *jitsiview;
  RCTBridge * reactBridge;
  JitsiMeetConferenceOptions * options;
  RTCPeerConnection * localPeerConnection;
}
@end

@implementation CallViewController

- (void)viewDidLoad {
    [super viewDidLoad];
  self.navigationController.navigationBarHidden = true;
  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
    JitsiMeetUserInfo * info = [[JitsiMeetUserInfo alloc] initWithDisplayName:@"Jack" andEmail:@"chandra_melp@sysmind.com" andAvatar:[NSURL URLWithString:@"https://gravatar.com/avatar/abc123"]];
    
    JitsiMeetUserInfo * callerinfo = [[JitsiMeetUserInfo alloc]initWithCallerName:@"Nick" andCallerDetails:@"Developer" andcallerAvatarURL:[NSURL URLWithString:@"https://gravatar.com/avatar/abc123"]];
    
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(melpAppChatClicked) name:CHATBUTTON_CLICKED object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(audioOnlyToggled) name:AUDIO_ONLY_TOGGLED object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(inviteUser) name:INVITE_USER object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(userleftMeeting) name:USER_LEFTMEETING object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(userJoinedMeeting) name:USER_JOINEDMEETING object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(getRCTBridgeObject:) name:GET_REACT_BRIDGE_OBJECT object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(videoButtonToggled) name:VIDEO_BUTTON_TOGGLED object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(showDesktop) name:SHOW_DESKTOP object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(showAttendees) name:OPEN_ATTENDIEES object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(openDoc:) name:OPEN_DOCUMENT object:nil];
    
     [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(doHangup) name:HANGUPCALL_FROM_AUDIO_SCREEN object:nil];
    jitsiview  = (JitsiMeetView *) self.view;
    jitsiview.delegate = self;
    
    
    options = [JitsiMeetConferenceOptions fromBuilder:^(JitsiMeetConferenceOptionsBuilder * builder){
      
      builder.serverURL = [NSURL URLWithString:@"https://meet.melpapp.com:8090"]; //https://meet.jit.si   https://meet.melpapp.com:8090
      builder.room = @"melpcall";
      builder.audioMuted = NO;
      builder.audioOnly = YES;
      builder.videoMuted = NO;
      builder.welcomePageEnabled = NO;
      builder.userInfo = info;
      builder.isGroupCall = YES;
      builder.teamName = @"Test Team";
      builder.callerInfo = callerinfo;
    }];
    
    [jitsiview join:options];
  });
}

-(void)convertToVideo{
  options = [JitsiMeetConferenceOptions fromBuilder:^(JitsiMeetConferenceOptionsBuilder * builder){
    builder.audioMuted = NO;
    builder.audioOnly = NO;
    builder.videoMuted = NO;
    builder.serverURL = [NSURL URLWithString:@"https://meet.jit.si"]; //https://meet.jit.si   https://meet.melpapp.com:8090
    builder.room = @"melpapptigers";
    builder.welcomePageEnabled = NO;
  }];
  [jitsiview join:options];
  
}
-(void)doHangup{
  [jitsiview leave];
}
-(void)convertToMUteAudio{
  options = [JitsiMeetConferenceOptions fromBuilder:^(JitsiMeetConferenceOptionsBuilder * builder){
    builder.audioMuted = YES;
    builder.audioOnly = YES;
    builder.videoMuted = YES;
    builder.serverURL = [NSURL URLWithString:@"https://meet.jit.si"]; //https://meet.jit.si   https://meet.melpapp.com:8090
    builder.room = @"melpapptigers";
    builder.welcomePageEnabled = NO;
  }];
  [jitsiview join:options];
}


// JitsiMeetViewDelegate

- (void)_onJitsiMeetViewDelegateEvent:(NSString *)name
                             withData:(NSDictionary *)data {
  NSLog(
        @"[%s:%d] JitsiMeetViewDelegate %@ %@",
        __FILE__, __LINE__, name, data);
  
#if DEBUG
  NSAssert(
           [NSThread isMainThread],
           @"JitsiMeetViewDelegate %@ ",
           name);
#endif
}

- (void)conferenceJoined:(NSDictionary *)data {
  
  [JitsiMeetView sendConnectionStatus:@"Connected"];
  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(2 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
    [JitsiMeetView selfTileView];
  });
}

- (void)conferenceTerminated:(NSDictionary *)data {
  [self dismissViewControllerAnimated:true completion:nil];
  [self.navigationController popViewControllerAnimated:true];
}

- (void)conferenceWillJoin:(NSDictionary *)data {
  [self _onJitsiMeetViewDelegateEvent:@"CONFERENCE_WILL_JOIN" withData:data];
}

#if 0
- (void)enterPictureInPicture:(NSDictionary *)data {
  [self _onJitsiMeetViewDelegateEvent:@"ENTER_PICTURE_IN_PICTURE" withData:data];
}
#endif


-(void)melpAppChatClicked{
  
  [jitsiview startTimer];
  [[JitsiMeet sharedInstance] audioSpeakerClickedStatus];
 

}
-(void)getRCTBridgeObject:(NSNotification *)notification{
    reactBridge = notification.object;
}
-(void)audioOnlyToggled{
  
}
-(void)videoButtonToggled{
  
}
-(void)inviteUser{
  
}
-(void)userJoinedMeeting{
 // NSLog(@" ** join ** ");
}
-(void)userleftMeeting{
  
 // NSLog(@" ** left *** ");
}
- (void)requestTransaction:(CXTransaction *)transaction {
  [JMCallKitProxy request:transaction
               completion:^(NSError * _Nullable error) {
                 if (error) {
                   NSLog(@"%@", error);
                   
                 } else {
                   
                 }
               }];
  
  
}


-(void)makeIncomingCall{
  
}
-(void)showDesktop{
  
}
-(void)showAttendees{
  
}
-(void)openDoc:(NSNotification *)notification{
  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
    NSDictionary * dict = [notification userInfo];
      NSString * urlStr = dict[@"documenturl"];
    DocBrowser * doc = [[DocBrowser alloc] initWithNibName:@"DocBrowser" bundle:nil];
    doc.urlString = urlStr;
    [self.navigationController pushViewController:doc animated:true];
  });
    
    
}

@end
