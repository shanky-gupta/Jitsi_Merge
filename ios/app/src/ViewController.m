/*
 * Copyright @ 2018-present 8x8, Inc.
 * Copyright @ 2017-2018 Atlassian Pty Ltd
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#import <Availability.h>
#import <CallKit/CallKit.h>
#import <AVFoundation/AVFoundation.h>
#import <JitsiMeet/JitsiMeet-Swift.h>
#import "StartIncomingCall.h"



static NSString * const kARDAudioTrackId = @"ARDAMSa0";


@import CoreSpotlight;
@import MobileCoreServices;
@import Intents;  // Needed for NSUserActivity suggestedInvocationPhrase

@import JitsiMeet;

#import "Types.h"
#import "ViewController.h"


#define CHATBUTTON_CLICKED   @"CHATBUTTON_CLICKED"
#define AUDIO_ONLY_TOGGLED   @"AUDIO_ONLY_TOGGLED"
#define INVITE_USER          @"INVITE_USER"
#define USER_JOINEDMEETING   @"USER_JOINEDMEETING"
#define USER_LEFTMEETING     @"USER_LEFTMEETING"


@implementation ViewController {
  JitsiMeetView *jitsiview;
  JitsiMeetConferenceOptions * options;
  RTCPeerConnection * localPeerConnection;
  
}

- (void)viewDidLoad {
    [super viewDidLoad];

  
  
  
  
  
  

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
   
 // [jitsiview join:options];
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
        @"JitsiMeetViewDelegate %@ method invoked on a non-main thread",
        name);
#endif
}

- (void)conferenceJoined:(NSDictionary *)data {
    
}

- (void)conferenceTerminated:(NSDictionary *)data {
    [self _onJitsiMeetViewDelegateEvent:@"CONFERENCE_TERMINATED" withData:data];
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
  
  
  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
    [self convertToVideo];
    
    
  });
  
}
-(void)audioOnlyToggled{
  
}
-(void)inviteUser{
  
}
-(void)userJoinedMeeting{
  NSLog(@" ** join ** ");
}
-(void)userleftMeeting{
  
  NSLog(@" ** left ** ");
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






@end
