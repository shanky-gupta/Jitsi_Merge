package org.jitsi.meet.sdk;

import android.content.Intent;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.module.annotations.ReactModule;

import java.util.ArrayList;

import javax.annotation.Nonnull;

@ReactModule(name = OpenMelpChatModule.NAME)
public class OpenMelpChatModule extends ReactContextBaseJavaModule {
    public static final String NAME = "OpenMelpChat";
    ArrayList<String> emailList;


    public OpenMelpChatModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
        emailList = new ArrayList<>();

    }

    @ReactMethod
    public  void holdclick(boolean ishold)
    {
        System.out.println("is Hold----->"+ishold);
    }

    @ReactMethod
    public void showAttendees(ReadableArray strings){

        try {
            emailList.clear();
            for (int j = 0; j < strings.size(); j++) {
                emailList.add(strings.getString(j));
            }
            Intent i = new Intent();
            i.setAction("MeetCallBackViewAttendeesjitsi");
            i.putExtra("arraylist",emailList);
           // i.setAction("showattendees");
            getReactApplicationContext().sendBroadcast(i);
            Log.d("OpenMelpChat", "showAttendees");
            System.out.println("Size--jitsi> items---openMelpchatmodule--" + strings.toString());
            System.out.println("Size--jitsi> items---openMelpchatmodule List--" + emailList.toString() + "  Size-->" + emailList.size());
        } catch (Exception ex) {
            ex.printStackTrace();
        }

    }

    @ReactMethod
    public void isAudioMode(boolean isAudioMode) {
        Log.d("OpenMelpChat", "isAudioMode:" + isAudioMode);
        Intent i = new Intent();
        i.setAction("audiomode");
        if(isAudioMode)
        {
            i.putExtra("value","1");
        }
        else
        {
            i.putExtra("value","0");

        }
        getReactApplicationContext().sendBroadcast(i);
    }

     

    @ReactMethod
    public void showDesktop() {
        Log.d("OpenMelpChat", "showDesktop");
        try
        {
            Toast.makeText(getReactApplicationContext(), "Coming soon...", Toast.LENGTH_SHORT).show();

        }catch (Exception ex)
        {
            ex.printStackTrace();
        }
    }

    @Nonnull
    @Override
    public String getName() {
        return NAME;
    }
}
