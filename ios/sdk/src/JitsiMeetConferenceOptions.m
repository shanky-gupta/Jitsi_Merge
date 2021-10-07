/*
 * Copyright @ 2019-present 8x8, Inc.
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

#import <React/RCTUtils.h>

#import "JitsiMeetConferenceOptions+Private.h"
#import "JitsiMeetUserInfo+Private.h"

/**
 * Backwards compatibility: turn the boolean property into a feature flag.
 */
static NSString *const WelcomePageEnabledFeatureFlag = @"welcomepage.enabled";


@implementation JitsiMeetConferenceOptionsBuilder {
    NSNumber *_audioOnly;
    NSNumber *_audioMuted;
    NSNumber *_videoMuted;
    NSNumber * _isGroupCall;
    NSMutableDictionary *_featureFlags;
    NSString * _teamName;
    JitsiMeetUserInfo * _callerInfo;
}

@dynamic audioOnly;
@dynamic audioMuted;
@dynamic videoMuted;
@dynamic isGroupCall;
@dynamic teamName;
@dynamic welcomePageEnabled;

- (instancetype)init {
    if (self = [super init]) {
        _serverURL = nil;
        _room = nil;
        _subject = nil;
        _token = nil;

        _colorScheme = nil;
        _featureFlags = [[NSMutableDictionary alloc] init];

        _audioOnly = nil;
        _audioMuted = nil;
        _videoMuted = nil;
        _isGroupCall = nil;

        _userInfo = nil;
        _callerInfo = nil;
    }
    
    return self;
}

- (void)setFeatureFlag:(NSString *)flag withBoolean:(BOOL)value {
    [self setFeatureFlag:flag withValue:[NSNumber numberWithBool:value]];
}

- (void)setFeatureFlag:(NSString *)flag withValue:(id)value {
    _featureFlags[flag] = value;
}

#pragma mark - Dynamic properties

- (void)setAudioOnly:(BOOL)audioOnly {
    _audioOnly = [NSNumber numberWithBool:audioOnly];
}
-(void)setTeamName:(NSString *)teamName{
    _teamName = teamName;
}

-(NSString *)teamName{
    return _teamName;
}
- (BOOL)audioOnly {
    return _audioOnly && [_audioOnly boolValue];
}

- (void)setAudioMuted:(BOOL)audioMuted {
    _audioMuted = [NSNumber numberWithBool:audioMuted];
}
- (void)setIsGroupCall:(BOOL)isgroupcall {
    _isGroupCall = [NSNumber numberWithBool:isgroupcall];
}
- (BOOL)audioMuted {
    return _audioMuted && [_audioMuted boolValue];
}

- (void)setVideoMuted:(BOOL)videoMuted {
    _videoMuted = [NSNumber numberWithBool:videoMuted];
}

- (BOOL)videoMuted {
    return _videoMuted && [_videoMuted boolValue];
}
-(BOOL)isGroupCall{
    return _isGroupCall && [_isGroupCall boolValue];
}

- (void)setWelcomePageEnabled:(BOOL)welcomePageEnabled {
    [self setFeatureFlag:WelcomePageEnabledFeatureFlag
               withBoolean:welcomePageEnabled];
}

- (BOOL)welcomePageEnabled {
    NSNumber *n = _featureFlags[WelcomePageEnabledFeatureFlag];

    return n != nil ? [n boolValue] : NO;
}
- (void)setAudioModeOnly:(BOOL)audioOnly{
    _audioOnly = [NSNumber numberWithBool:audioOnly];
}
- (void)setAudioMutedMode:(BOOL)audioMuted{
    _audioMuted = [NSNumber numberWithBool:audioMuted];
}
- (void)setVideoMutedMode:(BOOL)videoMuted{
     _videoMuted = [NSNumber numberWithBool:videoMuted];
}
#pragma mark - Private API

- (NSNumber *)getAudioOnly {
    return _audioOnly;
}

- (NSNumber *)getAudioMuted {
    return _audioMuted;
}

- (NSNumber *)getVideoMuted {
    return _videoMuted;
}
-(NSNumber *)getisGroupCall{
    return _isGroupCall;
}
-(NSString *)getTeamName{
    return _teamName;
}

@end

@implementation JitsiMeetConferenceOptions {
    NSNumber *_audioOnly;
    NSNumber *_audioMuted;
    NSNumber *_videoMuted;
    NSNumber *_isGroupCall;
    NSDictionary *_featureFlags;
    NSString * _teamName;
    JitsiMeetUserInfo * _callerInfo;
    
    
}

@dynamic audioOnly;
@dynamic audioMuted;
@dynamic videoMuted;
@dynamic isGroupCall;
@dynamic welcomePageEnabled;
@dynamic teamName;
@dynamic callerInfo;

#pragma mark - Dynamic properties

- (BOOL)audioOnly {
    return _audioOnly && [_audioOnly boolValue];
}

- (BOOL)audioMuted {
    return _audioMuted && [_audioMuted boolValue];
}

- (BOOL)videoMuted {
    return _videoMuted && [_videoMuted boolValue];
}
- (BOOL)isGroupCall {
    return _isGroupCall && [_isGroupCall boolValue];
}
-(NSString *)teamName{
    return _teamName;
}
-(JitsiMeetUserInfo *)callerInfo{
    return _callerInfo;
}

- (BOOL)welcomePageEnabled {
    NSNumber *n = _featureFlags[WelcomePageEnabledFeatureFlag];

    return n != nil ? [n boolValue] : NO;
}

#pragma mark - Internal initializer

- (instancetype)initWithBuilder:(JitsiMeetConferenceOptionsBuilder *)builder {
    if (self = [super init]) {
        _serverURL = builder.serverURL;
        _room = builder.room;
        _subject = builder.subject;
        _token = builder.token;

        _colorScheme = builder.colorScheme;

        _audioOnly = [builder getAudioOnly];
        _audioMuted = [builder getAudioMuted];
        _videoMuted = [builder getVideoMuted];
        _isGroupCall = [builder getisGroupCall];
        _featureFlags = [NSDictionary dictionaryWithDictionary:builder.featureFlags];

        _userInfo = builder.userInfo;
        _teamName = [builder teamName];
        _callerInfo = builder.callerInfo;
        
       
    }

    return self;
}

#pragma mark - API

+ (instancetype)fromBuilder:(void (^)(JitsiMeetConferenceOptionsBuilder *))initBlock {
    JitsiMeetConferenceOptionsBuilder *builder = [[JitsiMeetConferenceOptionsBuilder alloc] init];
    initBlock(builder);
    return [[JitsiMeetConferenceOptions alloc] initWithBuilder:builder];
}

#pragma mark - Private API

- (NSDictionary *)asProps {
    NSMutableDictionary *props = [[NSMutableDictionary alloc] init];

    props[@"flags"] = [NSMutableDictionary dictionaryWithDictionary:_featureFlags];

    if (_colorScheme != nil) {
        props[@"colorScheme"] = self.colorScheme;
    }

    NSMutableDictionary *config = [[NSMutableDictionary alloc] init];
    if (_audioOnly != nil) {
        config[@"startAudioOnly"] = @(self.audioOnly);
    }
    if (_audioMuted != nil) {
        config[@"startWithAudioMuted"] = @(self.audioMuted);
    }
    if (_videoMuted != nil) {
        config[@"startWithVideoMuted"] = @(self.videoMuted);
    }
    if (_isGroupCall != nil) {
        config[@"isGroupCall"] = @(self.isGroupCall);
    }
    if (_subject != nil) {
        config[@"subject"] = self.subject;
    }
    if (_teamName != nil) {
        config[@"teamName"] = self.teamName;
    }

    NSMutableDictionary *urlProps = [[NSMutableDictionary alloc] init];

    // The room is fully qualified.
    if (_room != nil && [_room containsString:@"://"]) {
        urlProps[@"url"] = _room;
    } else {
        if (_serverURL != nil) {
            urlProps[@"serverURL"] = [_serverURL absoluteString];
        }

        if (_room != nil) {
            urlProps[@"room"] = _room;
        }
    }

    if (_token != nil) {
        urlProps[@"jwt"] = _token;
    }

    if (_token == nil && _userInfo != nil) {
        props[@"userInfo"] = [self.userInfo asDict];
    }
    if (_token == nil && _callerInfo != nil) {
        props[@"incomingCallInfo"] = [self.callerInfo asCallerDict];
    }

    urlProps[@"config"] = config;
    props[@"url"] = urlProps;

    return props;
}

@end
