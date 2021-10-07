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

package org.jitsi.meet.sdk;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.os.Handler;
import android.os.SystemClock;
import android.view.View;
import android.widget.Chronometer;
import android.widget.RelativeLayout;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.fragment.app.FragmentActivity;

import com.facebook.react.modules.core.PermissionListener;

import org.jitsi.meet.sdk.log.JitsiMeetLogger;

import java.util.Map;


/**
 * A base activity for SDK users to embed. It uses {@link JitsiMeetFragment} to do the heavy
 * lifting and wires the remaining Activity lifecycle methods so it works out of the box.
 */
public class JitsiMeetActivity extends FragmentActivity
        implements JitsiMeetActivityInterface, JitsiMeetViewListener {

    protected static final String TAG = JitsiMeetActivity.class.getSimpleName();

    private static final String ACTION_JITSI_MEET_CONFERENCE = "org.jitsi.meet.CONFERENCE";
    private static final String JITSI_MEET_CONFERENCE_OPTIONS = "JitsiMeetConferenceOptions";
    public Chronometer simpleChronometer;
    public TextView callstatus, username;
    public static long connectedTime = 0;
    public boolean isChronometerRunning = false;
    boolean flag = false, superflag;
    RelativeLayout relativeLayout;
    String calltype = "";
    String oldname = "";
    CountDownTimer countDownTimer;

    // Helpers for starting the activity
    //

    public static void launch(Context context, JitsiMeetConferenceOptions options) {
        Intent intent = new Intent(context, JitsiMeetActivity.class);
        intent.setAction(ACTION_JITSI_MEET_CONFERENCE);
        intent.putExtra(JITSI_MEET_CONFERENCE_OPTIONS, options);
        context.startActivity(intent);
    }

    public static void launch(Context context, String url) {
        JitsiMeetConferenceOptions options
                = new JitsiMeetConferenceOptions.Builder().setRoom(url).build();
        launch(context, options);
    }

    // Overrides
    //

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_jitsi_meet);
        simpleChronometer = (Chronometer) findViewById(R.id.chronometer);
        simpleChronometer.setVisibility(View.GONE);
        callstatus = findViewById(R.id.callstatus);
        username = findViewById(R.id.username);
        relativeLayout = findViewById(R.id.layout);

        if (!extraInitialize()) {
            initialize();
        }
        try {


           /* relativeLayout.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    try {
                          // showOrHidelabel("");
                    } catch (Exception ex) {
                        ex.printStackTrace();
                    }
                }
            });*/

            showOrHidelabel();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    public void showtimerOrNot(boolean flag) {
        if (flag) {
            relativeLayout.setVisibility(View.VISIBLE);
            username.setVisibility(View.VISIBLE);
            simpleChronometer.setVisibility(View.VISIBLE);

            if (isChronometerRunning) {
                simpleChronometer.setVisibility(View.VISIBLE);
            } else {
                callstatus.setVisibility(View.GONE);

            }
        } else {
            relativeLayout.setVisibility(View.GONE);
        }

    }


    public void showtimerinvideoCall(String type, String name, String callingname, boolean flag) {
        try {

            if (type.equalsIgnoreCase("101")) {
                relativeLayout.setVisibility(View.GONE);
                simpleChronometer.setBase(SystemClock.elapsedRealtime());
                simpleChronometer.start();
                username.setVisibility(View.GONE);
                callstatus.setVisibility(View.GONE);
                callstatus.setText(callingname);
                username.setText(name);
                return;
            }

            if (type.equalsIgnoreCase("a") || type.equalsIgnoreCase("AudioCall")) {
                relativeLayout.setVisibility(View.GONE);
                if (!isChronometerRunning) {
                    simpleChronometer.setBase(SystemClock.elapsedRealtime());
                    simpleChronometer.start();
                }
                isChronometerRunning = true;
                username.setVisibility(View.GONE);
                callstatus.setVisibility(View.GONE);
                callstatus.setText(callingname);
                username.setText(name);

            } else {
                if (flag) {
                    if (!isChronometerRunning) {
                        username.setVisibility(View.VISIBLE);
                        if (!name.equalsIgnoreCase("")) {
                            if (oldname.equalsIgnoreCase("")) {
                                username.setText(name);
                            }
                        }
                        callstatus.setVisibility(View.GONE);
                        simpleChronometer.setVisibility(View.VISIBLE);
                        if (!isChronometerRunning) {
                            simpleChronometer.setBase(SystemClock.elapsedRealtime());
                            simpleChronometer.start();
                            isChronometerRunning = true;

                        }
                    } else {
                        username.setVisibility(View.VISIBLE);

                    }
                } else {
                    if (!name.equalsIgnoreCase("")) {
                        if (oldname.equalsIgnoreCase("")) {
                            username.setText(name);
                        }
                    }
                    username.setVisibility(View.VISIBLE);
                    callstatus.setVisibility(View.VISIBLE);
                    callstatus.setText(callingname);
                    simpleChronometer.setVisibility(View.GONE);
                }
                relativeLayout.setVisibility(View.VISIBLE);

                if (oldname.equalsIgnoreCase("")) {
                    oldname = name;
                }
            }

            if (callingname.equalsIgnoreCase("Connecting...") || callingname.equalsIgnoreCase("Ringing......")) {
                callstatus.setVisibility(View.VISIBLE);
                simpleChronometer.setVisibility(View.GONE);

            } else if (callingname.equalsIgnoreCase("Connected")) {
                callstatus.setVisibility(View.GONE);
                simpleChronometer.setVisibility(View.VISIBLE);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    public void showOrHidelabel() {
        try {


            new Handler().postDelayed(new Runnable() {
                @Override
                public void run() {
                    username.setVisibility(View.GONE);
                    simpleChronometer.setVisibility(View.GONE);
                }
            },10000);


        } catch (Exception ex) {
            ex.printStackTrace();
        }

    }

    public void showOrHidelabel(View view) {
        try {

            if (flag) {
                //    relativeLayout.setVisibility(View.VISIBLE);
                username.setVisibility(View.VISIBLE);
                simpleChronometer.setVisibility(View.VISIBLE);
                flag = false;

                countDownTimer = new CountDownTimer(5000, 1000) {
                    public void onTick(long millisUntilFinished) {
                    }

                    public void onFinish() {
                        username.setVisibility(View.GONE);
                        simpleChronometer.setVisibility(View.GONE);
                        // relativeLayout.setVisibility(View.GONE);

                        flag = true;
                    }
                };
                countDownTimer.start();
            } else {
                // relativeLayout.setVisibility(View.GONE);
                username.setVisibility(View.GONE);
                simpleChronometer.setVisibility(View.GONE);
                flag = true;
                if (countDownTimer != null) {
                    countDownTimer.cancel();
                    countDownTimer = null;
                }
            }


        } catch (Exception ex) {
            ex.printStackTrace();
        }

    }

    public void updateusername(final String name) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                username.setVisibility(View.VISIBLE);
                username.setText(name);
            }
        });

    }

    public void updatetimer() {

        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                callstatus.setVisibility(View.GONE);
                simpleChronometer.setVisibility(View.VISIBLE);
                if (!isChronometerRunning) {
                    simpleChronometer.setVisibility(View.VISIBLE);
                    callstatus.setVisibility(View.GONE);
                    simpleChronometer.setBase(SystemClock.elapsedRealtime());
                    simpleChronometer.start();
                    isChronometerRunning = true;
                    superflag = flag;

                }
            }
        });


    }


    public void setname(final String username1, final String str) {
        try {

            runOnUiThread(new Runnable() {

                @Override
                public void run() {

                    username.setVisibility(View.VISIBLE);
                    username.setText(username1);

                    if (str.equalsIgnoreCase("Connected")) {
                        simpleChronometer.setVisibility(View.VISIBLE);
                        if (!isChronometerRunning) {
                            simpleChronometer.setVisibility(View.VISIBLE);
                            callstatus.setVisibility(View.GONE);
                            simpleChronometer.setBase(SystemClock.elapsedRealtime());
                            simpleChronometer.start();
                            isChronometerRunning = true;
                            superflag = flag;

                        }
                    } else {
                        callstatus.setVisibility(View.VISIBLE);
                        callstatus.setText(str);

                    }
                    if (str.equalsIgnoreCase("15D")) {
                        callstatus.setVisibility(View.GONE);
                        username.setText(username1);
                    }
                }
            });


        } catch (Exception ex) {
            ex.printStackTrace();
            System.out.println("set Name Method--->" + ex.getMessage());
        }
    }

    public void startTimer() {
        try {
            if (!isChronometerRunning) {
                simpleChronometer.setVisibility(View.VISIBLE);
                simpleChronometer.setBase(SystemClock.elapsedRealtime());
                this.simpleChronometer.start();
                isChronometerRunning = true;
                superflag = flag;

            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    public void setStatus(String singleOrGroup, String calltype, String name, String sts, boolean flag) {
        try {
            if (singleOrGroup.equalsIgnoreCase("groupchat")) {
                this.username.setVisibility(View.VISIBLE);
                this.username.setText(name);

            }
            this.calltype = calltype;
            if (calltype.equalsIgnoreCase("a")) {
                if (flag) {
                    callstatus.setVisibility(View.GONE);
                    simpleChronometer.setVisibility(View.VISIBLE);
                    if (!isChronometerRunning) {
                        simpleChronometer.setBase(SystemClock.elapsedRealtime());
                        this.simpleChronometer.start();
                        isChronometerRunning = true;
                        superflag = flag;
                        this.username.setText(name);
                    } else {
                        // this.username.setText(name);

                    }

                } else {
                    //  simpleChronometer.setVisibility(View.GONE);
                    if (!isChronometerRunning) {
                        this.callstatus.setText(sts);
                    }
                }
            } else {
                if (!isChronometerRunning) {
                    this.callstatus.setText(sts);
                }
                this.callstatus.setText(sts);
                if (isChronometerRunning) {
                    flag = true;
                }
                if (flag) {
                    callstatus.setVisibility(View.GONE);
                    simpleChronometer.setVisibility(View.VISIBLE);
                    if (!isChronometerRunning) {
                        simpleChronometer.setBase(SystemClock.elapsedRealtime());
                        this.simpleChronometer.start();
                        isChronometerRunning = true;
                        superflag = flag;


                    }

                } else {
                    simpleChronometer.setVisibility(View.GONE);

                }

                new Handler().postDelayed(new Runnable() {
                    @Override
                    public void run() {

                        username.setVisibility(View.GONE);
                        callstatus.setVisibility(View.GONE);
                        simpleChronometer.setVisibility(View.GONE);
                    }
                }, 10000);
            }

        } catch (Exception ex) {
            ex.printStackTrace();
        }

    }


    @Override
    public void onDestroy() {
        // Here we are trying to handle the following corner case: an application using the SDK
        // is using this Activity for displaying meetings, but there is another "main" Activity
        // with other content. If this Activity is "swiped out" from the recent list we will get
        // Activity#onDestroy() called without warning. At this point we can try to leave the
        // current meeting, but when our view is detached from React the JS <-> Native bridge won't
        // be operational so the external API won't be able to notify the native side that the
        // conference terminated. Thus, try our best to clean up.
        leave();
        if (AudioModeModule.useConnectionService()) {
            ConnectionService.abortConnections();
        }
        JitsiMeetOngoingConferenceService.abort(this);

        super.onDestroy();
    }

    @Override
    public void finish() {
        leave();

        super.finish();
    }

    // Helper methods
    //

    protected JitsiMeetView getJitsiView() {
        JitsiMeetFragment fragment
                = (JitsiMeetFragment) getSupportFragmentManager().findFragmentById(R.id.jitsiFragment);
        return fragment.getJitsiView();
    }

    public void join(@Nullable String url) {
        JitsiMeetConferenceOptions options
                = new JitsiMeetConferenceOptions.Builder()
                .setRoom(url)
                .build();
        join(options);
    }

    public void join(JitsiMeetConferenceOptions options) {
        getJitsiView().join(options);
    }

    public void leave() {
        getJitsiView().leave();
    }

    private @Nullable
    JitsiMeetConferenceOptions getConferenceOptions(Intent intent) {
        String action = intent.getAction();

        if (Intent.ACTION_VIEW.equals(action)) {
            Uri uri = intent.getData();
            if (uri != null) {
                return new JitsiMeetConferenceOptions.Builder().setRoom(uri.toString()).build();
            }
        } else if (ACTION_JITSI_MEET_CONFERENCE.equals(action)) {
            return intent.getParcelableExtra(JITSI_MEET_CONFERENCE_OPTIONS);
        }

        return null;
    }

    /**
     * Helper function called during activity initialization. If {@code true} is returned, the
     * initialization is delayed and the {@link JitsiMeetActivity#initialize()} method is not
     * called. In this case, it's up to the subclass to call the initialize method when ready.
     * <p>
     * This is mainly required so we do some extra initialization in the Jitsi Meet app.
     *
     * @return {@code true} if the initialization will be delayed, {@code false} otherwise.
     */
    protected boolean extraInitialize() {
        return false;
    }

    protected void initialize() {
        // Listen for conference events.
        getJitsiView().setListener(this);

        // Join the room specified by the URL the app was launched with.
        // Joining without the room option displays the welcome page.
        join(getConferenceOptions(getIntent()));

        //  new JitsiMeetView(Objects.requireNonNull(this));
    }

    // Activity lifecycle methods
    //

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        JitsiMeetActivityDelegate.onActivityResult(this, requestCode, resultCode, data);
    }

    @Override
    public void onBackPressed() {
        JitsiMeetActivityDelegate.onBackPressed();
    }

    @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);

        JitsiMeetConferenceOptions options;

        if ((options = getConferenceOptions(intent)) != null) {
            join(options);
            return;
        }

        JitsiMeetActivityDelegate.onNewIntent(intent);
    }

    @Override
    protected void onUserLeaveHint() {
        getJitsiView().enterPictureInPicture();
    }

    // JitsiMeetActivityInterface
    //

    @Override
    public void requestPermissions(String[] permissions, int requestCode, PermissionListener listener) {
        JitsiMeetActivityDelegate.requestPermissions(this, permissions, requestCode, listener);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        JitsiMeetActivityDelegate.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }

    // JitsiMeetViewListener
    //

    @Override
    public void onConferenceJoined(Map<String, Object> data) {
        JitsiMeetLogger.i("Conference joined: " + data);
        // Launch the service for the ongoing notification.
        JitsiMeetOngoingConferenceService.launch(this);
    }

    @Override
    public void onConferenceTerminated(Map<String, Object> data) {
        JitsiMeetLogger.i("Conference terminated: " + data);
        finish();
    }

    @Override
    public void onConferenceWillJoin(Map<String, Object> data) {
        JitsiMeetLogger.i("Conference will join: " + data);
    }
}
