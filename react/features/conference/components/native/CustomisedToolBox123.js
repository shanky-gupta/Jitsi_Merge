import React, { Component } from 'react';
import { View, Image, Text, TouchableHighlight } from 'react-native';
import AudioMuteButton from '../../../toolbox/components/AudioMuteButton';
import VideoMuteButton from '../../../toolbox/components/VideoMuteButton';
import HangupButton from '../../../toolbox/components/HangupButton';
import ChatButton from '../../../../features/chat/components/native/ChatButton';
import InfoDialogButton from '../../../invite/components/info-dialog/native/InfoDialogButton';
import { AudioRouteButton } from '../../../mobile/audio-mode';
import styles, { DESKTOP_ENABLED_ICON, DESKTOP_DISABLED_ICON, ADD_CALL_ICON,  
    VIDEO_CALL_DISABLED_ICON,
    AUDIO_MUTE_DISABLED_ICON,
    VIEW_ATTENDEES_ENABLED_ICON,
    VIDEO_CALL_ENABLED_ICON,
    SPEAKER_ENABLED_ICON,
    MESSAGE_ICON,
    HOLD_ENABLED_ICON,
    HOLD_DISABLED_ICON,
    SPEAKER_DISABLED_ICON,
    VIEW_ATTENDEES_DISABLED_ICON,
    END_CALL_ICON,
    AUDIO_MUTE_ENABLED_ICON,
    SPEAKER_TEAMS_INACTIVE_ICON,
    SPEAKER_ONE_TO_ONE_INACTIVE_ICON,
    AUDIO_MUTE_TEAMS_INACTIVE_ICON,
    AUDIO_MUTE_ONE_TO_ONE_INACTIVE_ICON,
    VIDEO_ONE_TO_ONE_INACTIVE_ICON,
    VIDEO_TEAMS_INACTIVE_ICON } from './styles';
import { ColorPalette } from '../../../base/styles';
import HoldButton from './HoldButton';
import VideoMuteButtonCustom  from './VideoMuteButtonCustom';
import CustomAudioMuteButton  from './CustomAudioMuteButton';
import { isLocalTrackMuted } from '../../../base/tracks';
import {NativeModules} from 'react-native';




// import AudioMuteButton from '../../../toolbox/components/AudioMuteButton';

/**
 *  Function which says if platform is iOS or not.
 *
 */
function isPlatformiOS(): boolean {
    return Platform.OS === 'ios';
}

class CustomisedToolBox extends Component {

    _handleSpeakerClick: ()=> void;
    _showAttendess: () =>void;
    

    _handleSpeakerClick(){
        const { setSpeakerState, speakerOn } = this.props;
        if(AudioMode.setSpeakerOn && setSpeakerState){
            AudioMode.setSpeakerOn(!speakerOn)
            .then((val)=>{
                this.props.setSpeakerState(!speakerOn)
            })
            .catch(err=>{

            });
        }
    }

    _showAttendees() {
            this.props.showAttendees();
    }

    _desktopIconClicked() {

NativeModules.NativeCallsNew.showDesktop();
      //  OpenMelpChat.showDesktop();
    }
    _addToCall() {

 NativeModules.NativeCallsNew.addToCall();
        //AudioMode.shareMeetingInfo(true);
    }
    _chatClicked(){

     //AudioMode.openMelpChat(true)


   }
    _hangupClicked(){

         //AudioMode.hangUpFromAudioCallScreen(true)
   }
   _onMuteClick() {
      
      
      
   }
   


    setHoldState(isHoldOn) {
        this.setState({isHoldOn});
      OpenMelpChat.holdclick(isHoldOn);
    }

    constructor(props){
        super(props);
        this._handleSpeakerClick = this._handleSpeakerClick.bind(this);
        this._showAttendees = this._showAttendees.bind(this);
        this.setHoldState = this.setHoldState.bind(this);
        this.state = {isHoldOn: false};
    }

    

    render() {
        const toolBoxFunctionTextStyle =   this.props.isTeamsCall?styles.toolBoxFunctionTextTeamStyle:styles.toolBoxFunctionTextOneToOneStyle;
        const { setSpeakerState, speakerOn, isShowingAttendees }= this.props;
        const { isHoldOn } = this.state;
       const { audioMuted } = this.props;
        const toolBoxInactiveStyle = isHoldOn ? 
        this.props.isTeamsCall ? 
        styles.toolBoxFunctionInactiveTeamStyle: styles.toolBoxFunctionInactiveOneToOneStyle: toolBoxFunctionTextStyle;

        const audioMuteInactiveIconSource = 
        this.props.isTeamsCall ? AUDIO_MUTE_TEAMS_INACTIVE_ICON : AUDIO_MUTE_ONE_TO_ONE_INACTIVE_ICON;

        const speakerIconInactiveSource = 
        this.props.isTeamsCall ? SPEAKER_TEAMS_INACTIVE_ICON : SPEAKER_ONE_TO_ONE_INACTIVE_ICON; 

        const videoIconInactiveSource = 
        this.props.isTeamsCall ? VIDEO_TEAMS_INACTIVE_ICON : VIDEO_ONE_TO_ONE_INACTIVE_ICON;

        return (
            <View style = { styles.toolBoxContainerStyle }>
                <View style = { styles.toolBoxSectionContainerStyle} >
                <TouchableHighlight onPress={this._desktopIconClicked} underlayColor={ColorPalette.transparent}>
                    <View style = { styles.toolBoxFunctionContainerStyle }>
                        <Image style = { styles.desktopIconStyle } source = { DESKTOP_DISABLED_ICON }/>
                        <Text style = { styles.toolBoxFunctionTextDisableDialpadStyle }>DIALPAD</Text>
                    </View>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={this._showAttendees} underlayColor={ColorPalette.transparent}>
                        <View style = { styles.toolBoxFunctionContainerStyle }>
                            <Image style = { styles.attendeesIconStyle } source = { isShowingAttendees ? VIEW_ATTENDEES_ENABLED_ICON: VIEW_ATTENDEES_DISABLED_ICON }/>
                            <Text style = { toolBoxFunctionTextStyle }>ATTENDEES</Text>
                        </View>
                    </TouchableHighlight>
                   <TouchableHighlight onPress={this._addToCall} underlayColor={ColorPalette.transparent}>
                        <View style = { styles.toolBoxFunctionContainerStyle }>
                            <Image style = { styles.addCallIconStyle } source = { ADD_CALL_ICON }/>
                            <Text style = { toolBoxFunctionTextStyle }>ADD CALL</Text>
                        </View>
                    </TouchableHighlight>


                    
                </View>
                <View style = { styles.toolBoxSectionContainerStyle} >

                       
                        
                        <AudioMuteButton>
                                 
                            {(isMuted, onClick) => (<TouchableHighlight disabled = {isHoldOn} onPress={onClick} underlayColor={ColorPalette.transparent}>
                                <View style = { styles.toolBoxFunctionContainerStyle }>
                                <Image source={isHoldOn ? audioMuteInactiveIconSource : isMuted ? AUDIO_MUTE_ENABLED_ICON : AUDIO_MUTE_DISABLED_ICON} style={styles.muteIconStyle} />
                                <Text style={toolBoxInactiveStyle}>MUTE</Text>
                                </View>
                            </TouchableHighlight>)
                            }
                        </AudioMuteButton>
                       
                        
                         <VideoMuteButton >
                            {(_isVideoMuted, _onClick ) =>(
                            <TouchableHighlight  disabled = {isHoldOn} onPress={_onClick} underlayColor={ColorPalette.transparent}>
                                <View style={styles.toolBoxFunctionContainerStyle}>
                                <Image style={styles.videoIconStyle} source={isHoldOn ? videoIconInactiveSource : !_isVideoMuted ? VIDEO_CALL_ENABLED_ICON :  VIDEO_CALL_DISABLED_ICON} />
                                    <Text style={toolBoxInactiveStyle}>VIDEO CALL</Text>
                                </View>
                            </TouchableHighlight>
                            )
                            }
                        </VideoMuteButton>
                        <AudioRouteButton>
                             {(_onClick) =>
                            (<TouchableHighlight disabled = {isHoldOn} onPress={this._handleSpeakerClick} underlayColor={ColorPalette.transparent}>
                                <View style = { styles.toolBoxFunctionContainerStyle }>
                                    <Image style = { styles.speakerIconStyle } source = {isHoldOn ? speakerIconInactiveSource : speakerOn ? SPEAKER_ENABLED_ICON : SPEAKER_DISABLED_ICON}/>
                                    <Text style = { toolBoxInactiveStyle }>SPEAKER ON</Text>
                                </View>
                            </TouchableHighlight>)
                            }
                    </AudioRouteButton>
                </View>
                <View style = { styles.toolBoxSectionContainerStyle} >
                   <ChatButton>
                        {(_onClick) =>
                        (
                        <TouchableHighlight onPress={_onClick} underlayColor={ColorPalette.transparent}>
                            <View style = { styles.toolBoxFunctionContainerStyle }>
                                <Image style = { styles.messageIconStyle } source = { MESSAGE_ICON }/>
                                <Text style = { toolBoxFunctionTextStyle }>MESSAGE </Text>
                            </View>
                        </TouchableHighlight>)
                        }
                    </ChatButton>

                   
                    <HangupButton>
                        {
                            (_onClick) =>
                            (
                                <TouchableHighlight onPress={_onClick} underlayColor={ColorPalette.transparent}>
                                <View style = {styles.endCallFunctionContainerStyle}>
                                        <Image style = { styles.endIconStyle } source = { END_CALL_ICON } resizeMode = 'cover'/>
                                </View>
                                </TouchableHighlight>
                            )
                        }
                    </HangupButton>

                    <HoldButton setSpeakerState = {setSpeakerState}  speakerOn={speakerOn} setHoldState = {this.setHoldState} isHoldOn= {isHoldOn}>
                        {
                            (_onClick, isHoldDisabled) =>
                        (
                        <TouchableHighlight onPress={_onClick} underlayColor={ColorPalette.transparent}>
                            <View style = { styles.toolBoxFunctionContainerStyle }>
                                <Image source = { isHoldOn ? HOLD_ENABLED_ICON : HOLD_DISABLED_ICON}
                                    style = { styles.holdIconStyle } />
                                <Text style = { toolBoxFunctionTextStyle }>HOLD</Text>
                            </View>
                        </TouchableHighlight>
                        )
                        }
                    </HoldButton>
                </View>
            </View>
        );
    }
}

export default CustomisedToolBox;
