//
//  DocBrowser.m
//  jitsi-meet
//
//  Created by MelpApp on 2/28/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import "DocBrowser.h"

@interface DocBrowser ()

@end

@implementation DocBrowser

- (void)viewDidLoad {
    [super viewDidLoad];
    UIWebView *webView = [[UIWebView alloc] initWithFrame:CGRectMake(0, 0, [UIScreen mainScreen].bounds.size.width, [UIScreen mainScreen].bounds.size.height)];

    NSURL *url = [NSURL URLWithString:self.urlString];
    NSURLRequest *requestObj = [NSURLRequest requestWithURL:url];
    [webView loadRequest:requestObj];

    [self.view addSubview:webView];
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
