//
//  IncominCallerInfo.m
//  JitsiMeet
//
//  Created by Chandra Prakash on 10/21/19.
//  Copyright © 2019 Jitsi. All rights reserved.
//

#import "IncominCallerInfo.h"

@implementation IncominCallerInfo

- (instancetype _Nullable)initWithCallerName:(NSString *_Nullable)callerName
                            andCallerDetails:(NSString *_Nullable)callerDetails
                          andcallerAvatarURL:(NSURL *_Nullable) callerAvatarURL {
    self = [super init];
    if (self) {
        self.callerName = callerName;
        self.callerDetails = callerDetails;
        self.callerAvatarURL = callerAvatarURL;
    }
    
    return self;
}

- (NSDictionary *)asDict {
    NSMutableDictionary *dict = [[NSMutableDictionary alloc] init];
    
    if (self.callerName != nil) {
        dict[@"callerName"] = self.callerName;
    }
    
    if (self.callerDetails != nil) {
        dict[@"callerDetails"] = self.callerDetails;
    }
    
    if (self.callerAvatarURL != nil) {
        NSString *avatarURL = [self.callerAvatarURL absoluteString];
        if (avatarURL != nil) {
            dict[@"callerAvatarURL"] = avatarURL;
        }
    }
    
    return dict;
}



@end
