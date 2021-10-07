//
//  IncominCallerInfo.h
//  JitsiMeet
//
//  Created by Chandra Prakash on 10/21/19.
//  Copyright © 2019 Jitsi. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface IncominCallerInfo : NSObject


/**
 * User display name.
 */
@property (nonatomic, copy, nullable) NSString *callerName;
/**
 * User e-mail.
 */
@property (nonatomic, copy, nullable) NSString *callerDetails;
/**
 * URL for the user avatar.
 */
@property (nonatomic, copy, nullable) NSURL *callerAvatarURL;

- (instancetype _Nullable)initWithCallerName:(NSString *_Nullable)callerName
                                     andCallerDetails:(NSString *_Nullable)callerDetails
                                    andcallerAvatarURL:(NSURL *_Nullable) callerAvatarURL;

- (NSMutableDictionary *)asDict;


@end

NS_ASSUME_NONNULL_END
