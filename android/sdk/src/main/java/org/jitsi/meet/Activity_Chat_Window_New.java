package org.jitsi.meet;

import android.content.Intent;
import android.view.Gravity;
import android.widget.Toast;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;

import java.util.ArrayList;

import javax.annotation.Nonnull;
import android.media.ToneGenerator;
import android.media.AudioManager;

import org.jitsi.meet.sdk.ReactInstanceManagerHolder;



public class Activity_Chat_Window_New extends ReactContextBaseJavaModule {
    static int count = 0;
    ReactApplicationContext context;
    ArrayList<String> emailList;

    public Activity_Chat_Window_New(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
        context = reactContext;
        emailList = new ArrayList<>();

    }

    @Nonnull
    @Override
    public String getName() {
        return "NativeCallsNew";
    }

    @ReactMethod
    public void showToast() {
        Intent i = new Intent();
        i.setAction("MeetCallBack");
        getReactApplicationContext().sendBroadcast(i);
        // ((MeetCallBacks)getReactApplicationContext()).chatbuttonlistener(0);
    }

    @ReactMethod
    public void wifiStatus(int status) {
        System.out.println("Wifi Staus---->" + status);
    }

    @ReactMethod
    public void showDesktop() {
        try {

            for (int i = 0; i < 2; i++) {
                Toast toast = Toast.makeText(context, "Coming soon...", Toast.LENGTH_SHORT);
                toast.setGravity(Gravity.TOP, 0, 10);
                toast.show();
            }

        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    @ReactMethod
    public void addToCall() {
        Intent i = new Intent();
        i.setAction("MeetCallBackAddToCall");
        getReactApplicationContext().sendBroadcast(i);
        System.out.println("add to call------>");
        // ((MeetCallBacks)getReactApplicationContext()).chatbuttonlistener(0);
    }

    @ReactMethod
    public void etharpad() {
        System.out.println("url------------->");
        // ((MeetCallBacks)getReactApplicationContext()).chatbuttonlistener(0);
    }

    @ReactMethod
    public void etharpadinside(String url) {

        Intent i = new Intent();
        i.setAction("etharpadurl");
        i.putExtra("url", url);
        getReactApplicationContext().sendBroadcast(i);
        System.out.println("url----------etharpadinside--->" + url);
        // ((MeetCallBacks)getReactApplicationContext()).chatbuttonlistener(0);
    }
   
    @ReactMethod
    public void playbeep() {
        
        try
        {

        ToneGenerator toneGen1 = new ToneGenerator(AudioManager.STREAM_MUSIC, 100);             
        toneGen1.startTone(ToneGenerator.TONE_CDMA_PIP,150); 


          // Intent i = new Intent();
          // i.setAction("playbeep");
         //  getReactApplicationContext().sendBroadcast(i);

        }catch (Exception ex)
        {
            ex.printStackTrace();
        }
    }
      @ReactMethod
      public void isslownetwork() {
        try
        {
             ToneGenerator toneGen1 = new ToneGenerator(AudioManager.STREAM_MUSIC, 100);             
             toneGen1.startTone(ToneGenerator.TONE_CDMA_PIP,150); 

          //  ReactInstanceManagerHolder.emitEvent("connectionStatus","Reconnecting");

         //  Intent i = new Intent();
         //  i.setAction("isslownetwork");
         //  getReactApplicationContext().sendBroadcast(i);

        }catch (Exception ex)
        {
            ex.printStackTrace();
        }
    }
    @ReactMethod
      public void isupnetwork() {
        try
        {

         //   ReactInstanceManagerHolder.emitEvent("connectionStatus","Connected");


        }catch (Exception ex)
        {
            ex.printStackTrace();
        }
    }


    


    @ReactMethod
    public void viewAttendeesjitsi(ReadableArray strings) {

        try {
            emailList.clear();
            for (int j = 0; j < strings.size(); j++) {
                emailList.add(strings.getString(j));
            }
          //  Intent i = new Intent();
          //  i.setAction("MeetCallBackViewAttendeesjitsi");
            //  i.putExtra("arraylist",(ArrayList)strings);
          //  getReactApplicationContext().sendBroadcast(i);
            System.out.println("Size--jitsi> items---Chat_window_new--" + strings.toString());
            System.out.println("Size--jitsi> items---Chat_window_email List--" + emailList.toString() + "  Size-->" + emailList.size());
        } catch (Exception ex) {
            ex.printStackTrace();
        }


    }

    @ReactMethod
    public void viewAttendees() {
        Intent i = new Intent();
        i.setAction("MeetCallBackViewAttendeesjitsi");
        i.putExtra("arraylist",emailList);
     //   i.setAction("MeetCallBackViewAttendees");
        getReactApplicationContext().sendBroadcast(i);
        // ((MeetCallBacks)getReactApplicationContext()).chatbuttonlistener(0);
    }


    @ReactMethod
    public void etharpadclick() {

        Intent i = new Intent();
        i.setAction("etharclicked");
        getReactApplicationContext().sendBroadcast(i);
        System.out.println("Etharpad Clicked------->");
    }

    @ReactMethod
    public void userjoin() {
        Intent i = new Intent();
        i.setAction("userjoin");
        i.putExtra("count", count + "");
        count++;
        getReactApplicationContext().sendBroadcast(i);
        // ((MeetCallBacks)getReactApplicationContext()).chatbuttonlistener(0);
    }


}
