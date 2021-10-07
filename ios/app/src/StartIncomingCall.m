//
//  StartIncomingCall.m
//  jitsi-meet
//
//  Created by Chandra Prakash on 8/16/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "StartIncomingCall.h"
#import <JitsiMeet/JitsiMeet-Swift.h>
#import "CallViewController.h"


@interface StartIncomingCall ()

@end

@implementation StartIncomingCall

- (void)viewDidLoad {
    [super viewDidLoad];
    [JitsiMeet sharedInstance];
    // Do any additional setup after loading the view from its nib.
}


-(IBAction)startcall:(id)sender{
  
  
  [self makeIncomingCall];
  
}
-(void)makeIncomingCall{
  CallViewController * call = [[CallViewController alloc] initWithNibName:@"CallViewController" bundle:nil];
  [self.navigationController pushViewController:call animated:true];
 // [self presentViewController:call animated:true completion:nil];
  
}


/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
