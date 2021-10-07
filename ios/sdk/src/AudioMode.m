/*
 * Copyright @ 2017-present 8x8, Inc.
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

#import <AVFoundation/AVFoundation.h>
#import "JitsiMeet.h"
#import <React/RCTEventEmitter.h>
#import <React/RCTLog.h>
#import <WebRTC/WebRTC.h>
#import "LogUtils.h"
#import <MediaPlayer/MediaPlayer.h>

// Audio mode
typedef enum {
    kAudioModeDefault,
    kAudioModeAudioCall,
    kAudioModeVideoCall
} JitsiMeetAudioMode;

// Events
static NSString * const kDevicesChanged = @"org.jitsi.meet:features/audio-mode#devices-update";

// Device types (must match JS and Java)
static NSString * const kDeviceTypeHeadphones = @"HEADPHONES";
static NSString * const kDeviceTypeBluetooth  = @"BLUETOOTH";
static NSString * const kDeviceTypeEarpiece   = @"EARPIECE";
static NSString * const kDeviceTypeSpeaker    = @"SPEAKER";
static NSString * const kDeviceTypeUnknown    = @"UNKNOWN";


@interface AudioMode : RCTEventEmitter<RTCAudioSessionDelegate>

@property(nonatomic, strong) dispatch_queue_t workerQueue;
@property(nonatomic, assign) BOOL speakerEnabled;
@property(nonatomic, assign) BOOL isholdPlaced;

@end

@implementation AudioMode {
    JitsiMeetAudioMode activeMode;
    RTCAudioSessionConfiguration *defaultConfig;
    RTCAudioSessionConfiguration *audioCallConfig;
    RTCAudioSessionConfiguration *videoCallConfig;
    RTCAudioSessionConfiguration *earpieceConfig;
    BOOL forceSpeaker;
    BOOL forceEarpiece;
    BOOL isSpeakerOn;
    BOOL isEarpieceOn;
}

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup {
    return NO;
}

- (NSArray<NSString *> *)supportedEvents {
    return @[ kDevicesChanged ];
}

- (NSDictionary *)constantsToExport {
    return @{
        @"DEVICE_CHANGE_EVENT": kDevicesChanged,
        @"AUDIO_CALL" : [NSNumber numberWithInt: kAudioModeAudioCall],
        @"DEFAULT"    : [NSNumber numberWithInt: kAudioModeDefault],
        @"VIDEO_CALL" : [NSNumber numberWithInt: kAudioModeVideoCall]
    };
};

- (instancetype)init {
    self = [super init];
    if (self) {
        dispatch_queue_attr_t attributes =
        dispatch_queue_attr_make_with_qos_class(DISPATCH_QUEUE_SERIAL, QOS_CLASS_USER_INITIATED, -1);
        _workerQueue = dispatch_queue_create("AudioMode.queue", attributes);

        activeMode = kAudioModeDefault;

        defaultConfig = [[RTCAudioSessionConfiguration alloc] init];
        defaultConfig.category = AVAudioSessionCategoryAmbient;
        defaultConfig.categoryOptions = 0;
        defaultConfig.mode = AVAudioSessionModeDefault;

//        audioCallConfig = [[RTCAudioSessionConfiguration alloc] init];
//        audioCallConfig.category = AVAudioSessionCategoryPlayAndRecord;
//        audioCallConfig.categoryOptions = AVAudioSessionCategoryOptionAllowBluetooth | AVAudioSessionCategoryOptionDefaultToSpeaker;
//        audioCallConfig.mode = AVAudioSessionModeVoiceChat;

          audioCallConfig = [[RTCAudioSessionConfiguration alloc] init];
          audioCallConfig.category = AVAudioSessionCategoryPlayAndRecord;
           audioCallConfig.categoryOptions = AVAudioSessionCategoryOptionAllowBluetooth;
            audioCallConfig.mode = AVAudioSessionModeVoiceChat;
        
        videoCallConfig = [[RTCAudioSessionConfiguration alloc] init];
        videoCallConfig.category = AVAudioSessionCategoryPlayAndRecord;
        videoCallConfig.categoryOptions = AVAudioSessionCategoryOptionAllowBluetooth;
        videoCallConfig.mode = AVAudioSessionModeVideoChat;

        // Manually routing audio to the earpiece doesn't quite work unless one disables BT (weird, I know).
        earpieceConfig = [[RTCAudioSessionConfiguration alloc] init];
        earpieceConfig.category = AVAudioSessionCategoryPlayAndRecord;
        earpieceConfig.categoryOptions = 0;
        earpieceConfig.mode = AVAudioSessionModeVoiceChat;

        forceSpeaker = NO;
        forceEarpiece = NO;
        isSpeakerOn = NO;
        isEarpieceOn = NO;

        RTCAudioSession *session = [RTCAudioSession sharedInstance];
        [session addDelegate:self];
    }

    return self;
}

- (dispatch_queue_t)methodQueue {
    // Use a dedicated queue for audio mode operations.
    return _workerQueue;
}

- (BOOL)setConfig:(RTCAudioSessionConfiguration *)config
            error:(NSError * _Nullable *)outError {

    RTCAudioSession *session = [RTCAudioSession sharedInstance];
    [session lockForConfiguration];
    BOOL success = [session setConfiguration:config error:outError];
    [session unlockForConfiguration];

    return success;
}

#pragma mark - Exported methods

RCT_EXPORT_METHOD(setMode:(int)mode
                  resolve:(RCTPromiseResolveBlock)resolve
                   reject:(RCTPromiseRejectBlock)reject) {
    RTCAudioSessionConfiguration *config = [self configForMode:mode];
    NSError *error;

    switch (mode) {
    case kAudioModeAudioCall:
        config = audioCallConfig;
        break;
    case kAudioModeDefault:
        config = defaultConfig;
        break;
    case kAudioModeVideoCall:
        config = videoCallConfig;
        break;
    default:
        reject(@"setMode", @"Invalid mode", nil);
        return;
    }

    // Reset.
    if (mode == kAudioModeDefault) {
        forceSpeaker = NO;
        forceEarpiece = NO;
    }

    activeMode = mode;

    if ([self setConfig:config error:&error]) {
        resolve(nil);
    } else {
        reject(@"setMode", error.localizedDescription, error);
    }
    if (self.speakerEnabled && mode != 2) {
        [self enableHandfree];
    }
    [self notifyDevicesChanged];
}

RCT_EXPORT_METHOD(setAudioDevice:(NSString *)device
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    DDLogInfo(@"[AudioMode] Selected device: %@", device);
    
    RTCAudioSession *session = [RTCAudioSession sharedInstance];
    [session lockForConfiguration];
    BOOL success;
    NSError *error = nil;
    
    // Reset these, as we are about to compute them.
    forceSpeaker = NO;
    forceEarpiece = NO;
    
    // The speaker is special, so test for it first.
    if ([device isEqualToString:kDeviceTypeSpeaker]) {
        forceSpeaker = NO;
        success = [session overrideOutputAudioPort:AVAudioSessionPortOverrideSpeaker error:&error];
    } else {
        // Here we use AVAudioSession because RTCAudioSession doesn't expose availableInputs.
        AVAudioSession *_session = [AVAudioSession sharedInstance];
        AVAudioSessionPortDescription *port = nil;

        // Find the matching input device.
        for (AVAudioSessionPortDescription *portDesc in _session.availableInputs) {
            if ([portDesc.UID isEqualToString:device]) {
                port = portDesc;
                break;
            }
        }
        
        if (port != nil) {
            // First remove the override if we are going to select a different device.
            if (isSpeakerOn) {
                [session overrideOutputAudioPort:AVAudioSessionPortOverrideNone error:nil];
            }
            
            // Special case for the earpiece.
            if ([port.portType isEqualToString:AVAudioSessionPortBuiltInMic]) {
                forceEarpiece = YES;
                [self setConfig:earpieceConfig error:nil];
            } else if (isEarpieceOn) {
                // Reset the config.
                RTCAudioSessionConfiguration *config = [self configForMode:activeMode];
                [self setConfig:config error:nil];
            }

            // Select our preferred input.
            success = [session setPreferredInput:port error:&error];
        } else {
            success = NO;
            error = RCTErrorWithMessage(@"Could not find audio device");
        }
    }
    
    [session unlockForConfiguration];
    
    if (success) {
        resolve(nil);
    } else {
        reject(@"setAudioDevice", error != nil ? error.localizedDescription : @"", error);
    }
  
  
    
}

RCT_EXPORT_METHOD(updateDeviceList) {
    [self notifyDevicesChanged];
}

#pragma mark - RTCAudioSessionDelegate

- (void)audioSessionDidChangeRoute:(RTCAudioSession *)session
                            reason:(AVAudioSessionRouteChangeReason)reason
                     previousRoute:(AVAudioSessionRouteDescription *)previousRoute {
  
    // Update JS about the changes.
    [self notifyDevicesChanged];

    dispatch_async(_workerQueue, ^{
        switch (reason) {
            case AVAudioSessionRouteChangeReasonNewDeviceAvailable:
            case AVAudioSessionRouteChangeReasonOldDeviceUnavailable:
                // If the device list changed, reset our overrides.
                self->forceSpeaker = NO;
                self->forceEarpiece = NO;
                break;
            case AVAudioSessionRouteChangeReasonCategoryChange:
                // The category has changed. Check if it's the one we want and adjust as
                // needed.
                break;
            default:
                return;
        }

        // We don't want to touch the category when in default mode.
        // This is to play well with other components which could be integrated
        // into the final application.
        if (self->activeMode != kAudioModeDefault) {
            DDLogInfo(@"[AudioMode] Route changed, reapplying RTCAudioSession config");
            RTCAudioSessionConfiguration *config = [self configForMode:self->activeMode];
            [self setConfig:config error:nil];
            if (self->forceSpeaker && !self->isSpeakerOn) {
                RTCAudioSession *session = [RTCAudioSession sharedInstance];
                [session lockForConfiguration];
                [session overrideOutputAudioPort:AVAudioSessionPortOverrideSpeaker error:nil];
                [session unlockForConfiguration];
            }
        }
    });
     
     
    
    
}

- (void)audioSession:(RTCAudioSession *)audioSession didSetActive:(BOOL)active {
    DDLogInfo(@"[AudioMode] Audio session didSetActive:%d", active);
}

#pragma mark - Helper methods

- (RTCAudioSessionConfiguration *)configForMode:(int) mode {
    if (mode != kAudioModeDefault && forceEarpiece) {
        return earpieceConfig;
    }

    switch (mode) {
        case kAudioModeAudioCall:
            return audioCallConfig;
        case kAudioModeDefault:
            return defaultConfig;
        case kAudioModeVideoCall:
            return videoCallConfig;
        default:
            return nil;
    }
}

// Here we convert input and output port types into a single type.
- (NSString *)portTypeToString:(AVAudioSessionPort) portType {
    if ([portType isEqualToString:AVAudioSessionPortHeadphones]
            || [portType isEqualToString:AVAudioSessionPortHeadsetMic]) {
        return kDeviceTypeHeadphones;
    } else if ([portType isEqualToString:AVAudioSessionPortBuiltInMic]
            || [portType isEqualToString:AVAudioSessionPortBuiltInReceiver]) {
        return kDeviceTypeEarpiece;
    } else if ([portType isEqualToString:AVAudioSessionPortBuiltInSpeaker]) {
        return kDeviceTypeSpeaker;
    } else if ([portType isEqualToString:AVAudioSessionPortBluetoothHFP]
            || [portType isEqualToString:AVAudioSessionPortBluetoothLE]
            || [portType isEqualToString:AVAudioSessionPortBluetoothA2DP]) {
        return kDeviceTypeBluetooth;
    } else {
        return kDeviceTypeUnknown;
    }
}

- (void)notifyDevicesChanged {
    
    dispatch_async(_workerQueue, ^{
        NSMutableArray *data = [[NSMutableArray alloc] init];
        // Here we use AVAudioSession because RTCAudioSession doesn't expose availableInputs.
        AVAudioSession *session = [AVAudioSession sharedInstance];
        NSString *currentPort = @"";
        AVAudioSessionRouteDescription *currentRoute = session.currentRoute;
        
        // Check what the current device is. Because the speaker is somewhat special, we need to
        // check for it first.
        if (currentRoute != nil) {
            AVAudioSessionPortDescription *output = currentRoute.outputs.firstObject;
            AVAudioSessionPortDescription *input = currentRoute.inputs.firstObject;
            if (output != nil && [output.portType isEqualToString:AVAudioSessionPortBuiltInSpeaker]) {
                currentPort = kDeviceTypeSpeaker;
                self->isSpeakerOn = YES;
            } else if (input != nil) {
                currentPort = input.UID;
                self->isSpeakerOn = NO;
                self->isEarpieceOn = [input.portType isEqualToString:AVAudioSessionPortBuiltInMic];
            }
        }
        
        BOOL headphonesAvailable = NO;
        for (AVAudioSessionPortDescription *portDesc in session.availableInputs) {
            if ([portDesc.portType isEqualToString:AVAudioSessionPortHeadsetMic] || [portDesc.portType isEqualToString:AVAudioSessionPortHeadphones]) {
                headphonesAvailable = YES;
                break;
            }
        }
        
        for (AVAudioSessionPortDescription *portDesc in session.availableInputs) {
            // Skip "Phone" if headphones are present.
            if (headphonesAvailable && [portDesc.portType isEqualToString:AVAudioSessionPortBuiltInMic]) {
                continue;
            }
            id deviceData
                = @{
                    @"type": [self portTypeToString:portDesc.portType],
                    @"name": portDesc.portName,
                    @"uid": portDesc.UID,
                    @"selected": [NSNumber numberWithBool:[portDesc.UID isEqualToString:currentPort]]
                };
            [data addObject:deviceData];
        }

        // We need to manually add the speaker because it will never show up in the
        // previous list, as it's not an input.
        [data addObject:
            @{ @"type": kDeviceTypeSpeaker,
               @"name": @"Speaker",
               @"uid": kDeviceTypeSpeaker,
               @"selected": [NSNumber numberWithBool:[kDeviceTypeSpeaker isEqualToString:currentPort]]
        }];
        
        [self sendEventWithName:kDevicesChanged body:data];
    });
     
    
}
RCT_EXPORT_METHOD(setSpeakerOn :(BOOL)isAudioMode resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    
    if (isAudioMode ) {
        resolve(nil);
       [self enableHandfree];
    }else{
         resolve(nil);
         [self disableHandfree];
    }

}
RCT_EXPORT_METHOD(onHold :(BOOL)isHoldDisabled resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    
    
    if (self.isholdPlaced) {
        self.isholdPlaced = NO;
      //  [self makeSpeakerMute:YES];
      //  [self configureAudioSession];
//        [self setupExternalaudio];
        [self setInputGain:1];
         [self setConfig:audioCallConfig error:nil];
        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
            // int val =  [AVAudioSession sharedInstance].outputVolume;
             [self makeVolume:1];
        });
        
    }else{
        self.isholdPlaced = YES;
      //  [self makeSpeakerMute:NO];
        [self setInputGain:0];
        [self makeVolume:0];
         [self setConfig:earpieceConfig error:nil];
    }
    resolve(nil);
    
    
}
RCT_EXPORT_METHOD(isHold :(BOOL)isHoldDisabled resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    

}
//

RCT_EXPORT_METHOD(networkfail :(id)error resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    

}


-(void)disableHandfree{
    AVAudioSession *session = [AVAudioSession sharedInstance];
    [session setCategory:AVAudioSessionCategoryPlayAndRecord
             withOptions:AVAudioSessionCategoryOptionAllowBluetooth
                   error:nil];
    [session overrideOutputAudioPort:AVAudioSessionPortOverrideNone error:nil];
    [session setActive:YES error : nil];
    self.speakerEnabled = false;
    [[JitsiMeet sharedInstance] updateAudioSpeakerStatus:self.speakerEnabled];
   
    
}
-(void)enableHandfree{
    AVAudioSession *session = [AVAudioSession sharedInstance];
    [session setCategory:AVAudioSessionCategoryPlayAndRecord
             withOptions:AVAudioSessionCategoryOptionAllowBluetooth
                   error:nil];
    [session overrideOutputAudioPort:AVAudioSessionPortOverrideSpeaker error:nil];
    [session setActive:YES error : nil];
    self.speakerEnabled = true;
    [[JitsiMeet sharedInstance] updateAudioSpeakerStatus:self.speakerEnabled];

    
    
}
-(void)makeSpeakerMute :(BOOL)setActive{
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        AVAudioSession *session = [AVAudioSession sharedInstance];
        [session setActive:setActive error : nil];
    });
    

}
- (void)setInputGain:(CGFloat)gain
{
   AVAudioSession *audioSession = [AVAudioSession sharedInstance];
   NSError *error = nil;
   BOOL success = [audioSession setInputGain:gain error:&error];
   if (!success) {
     NSLog(@"%@", error);
   }
}
// For example

-(void)makeVolume:(float)volume{
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        MPVolumeView* volumeView = [[MPVolumeView alloc] init];
        UISlider* volumeViewSlider = nil;
        for (UIView *view in [volumeView subviews]){
            if ([view.class.description isEqualToString:@"MPVolumeSlider"]){
                volumeViewSlider = (UISlider*)view;
                break;
            }
        }
        [volumeViewSlider setValue:volume animated:YES];
        [volumeViewSlider sendActionsForControlEvents:UIControlEventTouchUpInside];
    });
  
    
}

- (void) configureAudioSession
{
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        BOOL success;
        NSError* error;
        AVAudioSession  * audioSession = [AVAudioSession sharedInstance];
        success = [audioSession setCategory:AVAudioSessionCategoryPlayAndRecord error:&error];
        if (!success)  NSLog(@"AVAudioSession error setting category:%@",error);
        success = [audioSession setMode:AVAudioSessionModeVoiceChat error:&error];
        if (!success)  NSLog(@"AVAudioSession error setting mode:%@",error);
        success = [audioSession overrideOutputAudioPort:AVAudioSessionPortOverrideNone error:&error];
        [audioSession setPreferredOutputNumberOfChannels:0 error:nil];
        if (!success)  NSLog(@"AVAudioSession error overrideOutputAudioPort:%@",error);
        [audioSession setActive:YES error:&error];
        if (!success) NSLog(@"AVAudioSession error activating: %@",error);
        else {
            NSLog(@"audioSession active");
            [[RTCAudioSession sharedInstance] audioSessionDidActivate:audioSession];
            [RTCAudioSession sharedInstance].isAudioEnabled = true;
        }
        if ( self.speakerEnabled) {
            [self enableHandfree];
        }
    });
    
    
}
-(void)setupExternalaudio{

    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        NSError * error;
         AVAudioSession *session = [AVAudioSession sharedInstance];
         [session setCategory:AVAudioSessionCategoryPlayAndRecord
                  withOptions:AVAudioSessionCategoryOptionAllowBluetooth
                        error:nil];
         [session overrideOutputAudioPort:AVAudioSessionPortOverrideNone error:nil];
         OSStatus propertySetError = 0;
         UInt32 allowMixing = true;
         propertySetError = AudioSessionSetProperty (
                                                     kAudioSessionProperty_OverrideCategoryMixWithOthers,
                                                     sizeof (allowMixing),
                                                     &allowMixing
                                                     );
         [[UIApplication sharedApplication] beginReceivingRemoteControlEvents];
         NSLog(@"** error = %@", error.localizedDescription);
    });
    
}

RCT_EXPORT_METHOD (openMelpChat:(BOOL)isAudioMode resolve:(RCTPromiseResolveBlock)resolve
                   reject:(RCTPromiseRejectBlock)reject){
     resolve(nil);
     [[NSNotificationCenter defaultCenter] postNotificationName:@"CHATBUTTON_CLICKED" object:nil];
}
RCT_EXPORT_METHOD (audioOnlyToggled:(BOOL)isAudioMode resolve:(RCTPromiseResolveBlock)resolve
                   reject:(RCTPromiseRejectBlock)reject){
     resolve(nil);
      [[NSNotificationCenter defaultCenter] postNotificationName:@"AUDIO_ONLY_TOGGLED" object:nil];
}
RCT_EXPORT_METHOD (videoButtonToggled:(BOOL)isAudioMode resolve:(RCTPromiseResolveBlock)resolve
                   reject:(RCTPromiseRejectBlock)reject){
     resolve(nil);
    [[NSNotificationCenter defaultCenter] postNotificationName:@"VIDEO_BUTTON_TOGGLED" object:nil];
}

RCT_EXPORT_METHOD (anyuserleftmeeting:(BOOL)isAudioMode resolve:(RCTPromiseResolveBlock)resolve
                   reject:(RCTPromiseRejectBlock)reject){
     resolve(nil);
    [[NSNotificationCenter defaultCenter] postNotificationName:@"USER_LEFTMEETING" object:nil];
}
  
RCT_EXPORT_METHOD (anyuserjoinmeeting:(BOOL)isAudioMode resolve:(RCTPromiseResolveBlock)resolve
                   reject:(RCTPromiseRejectBlock)reject){
     resolve(nil);
    [[NSNotificationCenter defaultCenter] postNotificationName:@"USER_JOINEDMEETING" object:nil];
}
RCT_EXPORT_METHOD (shareMeetingInfo:(BOOL)isAudioMode resolve:(RCTPromiseResolveBlock)resolve
                       reject:(RCTPromiseRejectBlock)reject){
         resolve(nil);
        [[NSNotificationCenter defaultCenter] postNotificationName:@"INVITE_USER" object:nil];
    }
  RCT_EXPORT_METHOD (showAttendees:(BOOL)isAudioMode resolve:(RCTPromiseResolveBlock)resolve
                     reject:(RCTPromiseRejectBlock)reject){
       resolve(nil);
      [[NSNotificationCenter defaultCenter] postNotificationName:@"OPEN_ATTENDIEES" object:nil];
  }
   RCT_EXPORT_METHOD (showDesktop:(BOOL)isAudioMode resolve:(RCTPromiseResolveBlock)resolve
                       reject:(RCTPromiseRejectBlock)reject){
         resolve(nil);
        [[NSNotificationCenter defaultCenter] postNotificationName:@"SHOW_DESKTOP" object:nil];
    }

RCT_EXPORT_METHOD (checkEtherpad:(BOOL)isAudioMode resolve:(RCTPromiseResolveBlock)resolve
                      reject:(RCTPromiseRejectBlock)reject){
        resolve(nil);
    
    NSString * urlstring = [[NSUserDefaults standardUserDefaults] valueForKey:@"documenturl"];
    if (!urlstring) {
        urlstring  = @"undefined";
    }
    NSDictionary * dict = [[NSDictionary alloc] initWithObjectsAndKeys:urlstring , @"documenturl", nil];
    [[NSNotificationCenter defaultCenter] postNotificationName:@"OPEN_DOCUMENT" object:nil userInfo:dict];
       
   }
RCT_EXPORT_METHOD (documentURl:(NSURL *)url resolve:(RCTPromiseResolveBlock)resolve
                   reject:(RCTPromiseRejectBlock)reject){
     resolve(nil);
    NSString * urlstring = [url absoluteString];
    NSLog(@"********  document url = %@", urlstring);
    [[NSUserDefaults standardUserDefaults] setObject:urlstring forKey:@"documenturl"];
    
}
RCT_EXPORT_METHOD (hangUpFromAudioCallScreen:(BOOL)isAudioMode resolve:(RCTPromiseResolveBlock)resolve
                      reject:(RCTPromiseRejectBlock)reject){
        resolve(nil);
       [[NSNotificationCenter defaultCenter] postNotificationName:@"HANGUPCALL_FROM_AUDIO_SCREEN" object:nil];
   }

   RCT_EXPORT_METHOD (tileView:(BOOL)isAudioMode resolve:(RCTPromiseResolveBlock)resolve
                      reject:(RCTPromiseRejectBlock)reject){
        resolve(nil);
       
   }
RCT_EXPORT_METHOD (coloums:(NSNumber *)count resolve:(RCTPromiseResolveBlock)resolve
                     reject:(RCTPromiseRejectBlock)reject){
       resolve(nil);
      
  }


@end
