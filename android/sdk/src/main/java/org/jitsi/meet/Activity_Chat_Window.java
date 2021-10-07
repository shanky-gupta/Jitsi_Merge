package org.jitsi.meet;

import android.content.Context;
import android.content.Intent;
import android.view.View;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;


import org.jitsi.meet.sdk.ReactInstanceManagerHolder;

import java.lang.reflect.Array;
import java.util.ArrayList;

import javax.annotation.Nonnull;

public class Activity_Chat_Window extends ReactContextBaseJavaModule {
    static int count=0;
    ReactApplicationContext context;
    public Activity_Chat_Window(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
        context=reactContext;

    }

    @Nonnull
    @Override
    public String getName() {
        return "NativeCalls";
    }

    @ReactMethod
    public void showToast()
    {
        Intent i = new Intent();
        i.setAction("MeetCallBack");
        getReactApplicationContext().sendBroadcast(i);
       // ((MeetCallBacks)getReactApplicationContext()).chatbuttonlistener(0);
    }
    @ReactMethod
    public void wifiStatus(int status)
    {
        System.out.println("Wifi Staus---->"+status);
    }
    @ReactMethod
    public void addToCall()
    {
        Intent i = new Intent();
        i.setAction("MeetCallBackAddToCall");
        getReactApplicationContext().sendBroadcast(i);
        System.out.println("add to call------>");
        // ((MeetCallBacks)getReactApplicationContext()).chatbuttonlistener(0);
    }
    @ReactMethod
    public void etharpad()
    {
        System.out.println("url------------->");
        // ((MeetCallBacks)getReactApplicationContext()).chatbuttonlistener(0);
    }

    @ReactMethod
    public void etharpadinside(String url)
    {

        Intent i = new Intent();
        i.setAction("etharpadurl");
        i.putExtra("url",url);
        getReactApplicationContext().sendBroadcast(i);
        System.out.println("url----------etharpadinside--->"+url);
        // ((MeetCallBacks)getReactApplicationContext()).chatbuttonlistener(0);
    }


    @ReactMethod
    public void viewAttendees()
    {

        ReactInstanceManagerHolder.emitEvent("viewcalldata", null);

        System.out.println("----------------> viewcalldata");


       // Intent i = new Intent();
       // i.setAction("MeetCallBackViewAttendees");
       // getReactApplicationContext().sendBroadcast(i);
        // ((MeetCallBacks)getReactApplicationContext()).chatbuttonlistener(0);
    }
    @ReactMethod
    public void viewAttendeesjitsi(String str){

        Intent i = new Intent();
       // i.setAction("MeetCallBackViewAttendeesjitsi");
       // i.putExtra("arraylist",(ArrayList)emailList);
      //  getReactApplicationContext().sendBroadcast(i);
        System.out.println("Size--jitsi> items--->"+str);

    }


    @ReactMethod
    public void etharpadclick()
    {

        Intent i = new Intent();
        i.setAction("etharclicked");
        getReactApplicationContext().sendBroadcast(i);
        System.out.println("Etharpad Clicked------->");
    }

    @ReactMethod
    public void userjoin()
    {
        Intent i = new Intent();
        i.setAction("userjoin");
        i.putExtra("count",count+"");
        count++;
        getReactApplicationContext().sendBroadcast(i);
        // ((MeetCallBacks)getReactApplicationContext()).chatbuttonlistener(0);
    }


}
