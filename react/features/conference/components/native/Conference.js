// @flow

import React from 'react';
import { NativeModules, SafeAreaView, StatusBar, View, NativeEventEmitter, Platform, DeviceEventEmitter } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { appNavigate } from '../../../app';
import { PIP_ENABLED, getFeatureFlag } from '../../../base/flags';
import { Container, LoadingIndicator, TintedView } from '../../../base/react';
import { ColorSchemeRegistry } from '../../../base/color-scheme';
import { connect } from '../../../base/redux';
import {
    isNarrowAspectRatio,
    makeAspectRatioAware
} from '../../../base/responsive-ui';
import {
    getParticipants,
    getParticipantDisplayName,
    getParticipantPresenceStatus
} from '../../../base/participants';
import { TestConnectionInfo } from '../../../base/testing';
import { ConferenceNotification, isCalendarEnabled } from '../../../calendar-sync';
import { Chat } from '../../../chat';
import { DisplayNameLabel } from '../../../display-name';
import {
    FILMSTRIP_SIZE,
    Filmstrip,
    isFilmstripVisible,
    TileView
} from '../../../filmstrip';
import { LargeVideo } from '../../../large-video';
import { BackButtonRegistry } from '../../../mobile/back-button';
import { AddPeopleDialog, CalleeInfoContainer } from '../../../invite';
import { Captions } from '../../../subtitles';
import { isToolboxVisible, setToolboxVisible, Toolbox } from '../../../toolbox';
import CustomisedToolBox from './CustomisedToolBox';
import {
    AbstractConference,
    abstractMapStateToProps
} from '../AbstractConference';
import Labels from './Labels';
import NavigationBar from './NavigationBar';
import styles, { NAVBAR_GRADIENT_COLORS } from './styles';

import type { AbstractProps } from '../AbstractConference';
import UpperTextContainer from './UpperTextContainer';
import CalleeDetails from './CalleeDetails';
import { shouldRenderParticipantVideo } from '../../../base/participants/functions';
import ConferenceOld from './Conferenceold';
import Attendees from './Attendees';
import AudioScreen from './AudioScreen';
/**
 * The type of the React {@code Component} props of {@link Conference}.
 */
type Props = AbstractProps & {

    /**
     * Wherther the calendar feature is enabled or not.
     *
     * @private
     */
    _calendarEnabled: boolean,

    /**
     * The indicator which determines that we are still connecting to the
     * conference which includes establishing the XMPP connection and then
     * joining the room. If truthy, then an activity/loading indicator will be
     * rendered.
     *
     * @private
     */
    _connecting: boolean,

    /**
     * Set to {@code true} when the filmstrip is currently visible.
     *
     * @private
     */
    _filmstripVisible: boolean,

    /**
     * The ID of the participant currently on stage (if any)
     */
    _largeVideoParticipantId: string,

    /**
     * Whether Picture-in-Picture is enabled.
     *
     * @private
     */
    _pictureInPictureEnabled: boolean,

    /**
     * The indicator which determines whether the UI is reduced (to accommodate
     * smaller display areas).
     *
     * @private
     */
    _reducedUI: boolean,

    /**
     * The handler which dispatches the (redux) action {@link setToolboxVisible}
     * to show/hide the {@link Toolbox}.
     *
     * @param {boolean} visible - {@code true} to show the {@code Toolbox} or
     * {@code false} to hide it.
     * @private
     * @returns {void}
     */
    _setToolboxVisible: Function,

    /**
     * The indicator which determines whether the Toolbox is visible.
     *
     * @private
     */
    _toolboxVisible: boolean,

    /**
     * The redux {@code dispatch} function.
     */
    dispatch: Function
};
const { JSCommunicateComponent, AudioMode, OpenMelpChat } = NativeModules;

/**
 *  Function which says if platform is iOS or not.
 *
 */
function isPlatformiOS(): boolean {
    return Platform.OS === 'ios';
}


/**
 * The conference page of the mobile (i.e. React Native) application.
 */
class Conference extends AbstractConference<Props, *> {
    /**
     * Initializes a new Conference instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */

    intervalObj;
    nativeEventEmitter;
    subscriptionStartTimer;
    subscriptionStopTimer;
    subscriptionConnectionStatus;
    subscriptionviewcalldata;

    secondsToMinutes(interval) {
        return `${Math.floor(interval / 60)  }:${  ('0' + Math.floor(interval % 60)).slice(-2)}`;
    }

    constructor(props) {
        super(props);

        // Bind event handlers so they are only bound once per instance.
        this._onClick = this._onClick.bind(this);
        this._onHardwareBackPress = this._onHardwareBackPress.bind(this);
        this._setToolboxVisible = this._setToolboxVisible.bind(this);

        this.state = { interval: 0, speakerOn: false, showAttendees:false, connectionStatus: '' };
        this.secondsToMinutes.bind(this);
        this._startTimer =  this._startTimer.bind(this);
        this._stopTimer =  this._stopTimer.bind(this);
        this._connectionStatus = this._connectionStatus.bind(this);
        this._setSpeakerState = this._setSpeakerState.bind(this);
        this.showAttendees =  this.showAttendees.bind(this);
        if (isPlatformiOS()) {
            this.nativeEventEmitter = new NativeEventEmitter(JSCommunicateComponent);
        }
    }

    /**
     * Implements {@link Component#componentDidMount()}. Invoked immediately
     * after this component is mounted.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount() {
        BackButtonRegistry.addListener(this._onHardwareBackPress);

        let eventEmitter;

        if (isPlatformiOS() && this.nativeEventEmitter) {
            eventEmitter = this.nativeEventEmitter;
        } else {
            eventEmitter = DeviceEventEmitter;
        }

        this.subscriptionStartTimer = eventEmitter.addListener(
            'startTimer', this._startTimer);

            this.subscriptionviewcalldata = eventEmitter.addListener(
                'viewcalldata', this.showAttendees);

        this.subscriptionStopTimer = eventEmitter.addListener(
                'stopTimer', this._stopTimer);
        this.subscriptionConnectionStatus = eventEmitter.addListener(
            'connectionStatus', this._connectionStatus);
        if (AudioMode.getSpeakerState) {
            AudioMode.getSpeakerState().then(speakerOn => {
                this.setState({ speakerOn });
            });
        }
    }

    /**
     * Implements {@link Component#componentWillUnmount()}. Invoked immediately
     * before this component is unmounted and destroyed. Disconnects the
     * conference described by the redux store/state.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentWillUnmount() {
        // Tear handling any hardware button presses for back navigation down.
        BackButtonRegistry.removeListener(this._onHardwareBackPress);
        this._stopTimer();
        if (this.subscriptionStartTimer && this.subscriptionStartTimer.remove) {
            this.subscriptionStartTimer.remove();
        }

        if (this.subscriptionStopTimer && this.subscriptionStopTimer.remove) {
            this.subscriptionStopTimer.remove();
        }

        if (this.subscriptionConnectionStatus && this.subscriptionConnectionStatus.remove) {
            this.subscriptionConnectionStatus.remove();
        }
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const {
            _connecting,
            participants,
            roomName,
            isTeamsCall,
            audioOnly
        } = this.props;

        const { interval, showAttendees, speakerOn, connectionStatus } = this.state;
        const secsToMinString = this.secondsToMinutes(interval);

//const array = [];
    //    const filterarray =  participants.filter(p => !p.local)
  //      for (const attendee of filterarray) {
  //          if(attendee.email){
  //              array.push(attendee.email)
  //          }
//         }

//NativeModules.NativeCallsNew.viewAttendeesjitsi(array);

        return (

            !audioOnly ? <ConferenceOld />
            : (
            <AudioScreen>
            <SafeAreaView style = { isTeamsCall ? { backgroundColor: 'black',flex: 1 }: { backgroundColor: 'rgb(252,252,252)',flex: 1 } }>
                    <View style = { isTeamsCall ? styles.mainContainerTeamsStyle:styles.mainContainerOneToOneStyle }>

                        <UpperTextContainer isTeamsCall = { isTeamsCall } />
                        <CalleeDetails connectionState = {connectionStatus} connected = { _connecting } isTeamsCall = {isTeamsCall} roomName={roomName} secsToMinString = {secsToMinString} />
                        <Chat />
                        <AddPeopleDialog />
                        <CustomisedToolBox
                        isTeamsCall = { isTeamsCall }
                        speakerOn= { speakerOn }
                        setSpeakerState = {this._setSpeakerState}
                        showAttendees = {this.showAttendees}
                        isShowingAttendees = { showAttendees }/>
                        {
                           showAttendees && <Attendees showAttendees = {this.showAttendees}/>
                        }
                        <TestConnectionInfo />

                        {
                            this._renderConferenceNotification()
                        }
                        <View style = { styles.customFilmstripViewBoxStyle } >
                           <Filmstrip connectionState = { this._connectionStatus }/>
                       </View>
                    </View>
            </SafeAreaView>
            </AudioScreen>
            )
        );
    }

    _onClick: () => void;

    /**
     * Changes the value of the toolboxVisible state, thus allowing us to switch
     * between Toolbox and Filmstrip and change their visibility.
     *
     * @private
     * @returns {void}
     */
    _onClick() {
        this._setToolboxVisible(!this.props._toolboxVisible);
    }

    _onHardwareBackPress: () => boolean;

    _startTimer: () => void

    _stopTimer: () => void

    _connectionStatus :() => void

    /**
     * Handles a hardware button press for back navigation. Enters Picture-in-Picture mode
     * (if supported) or leaves the associated {@code Conference} otherwise.
     *
     * @returns {boolean} Exiting the app is undesired, so {@code true} is always returned.
     */
    _onHardwareBackPress() {
        let p;

        if (this.props._pictureInPictureEnabled) {
            const { PictureInPicture } = NativeModules;

            p = PictureInPicture.enterPictureInPicture();
        } else {
            p = Promise.reject(new Error('PiP not enabled'));
        }

        p.catch(() => {
            this.props.dispatch(appNavigate(undefined));
        });

        return true;
    }


    /**
     * Method to startTimer.
     */
    _startTimer() {
        this.intervalObj = setInterval(() => {
            this.setState({ interval: this.state.interval + 1 });
        }, 1000);
    }


    showAttendees() {
        if(OpenMelpChat.showAttendees){

          const { participants } = this.props;

 const array = [];
//  const filterarray =  participants.filter(p => !p.local)
 for (const attendee of participants) {
     if(attendee.email){
         array.push(attendee.email)
     }
  }
 //AudioMode.participantArray(array);
            OpenMelpChat.showAttendees(array);
        }
        //this.setState({showAttendees: !this.state.showAttendees});
    }
    /**
     * Method to stopTimer.
     */
    _stopTimer() {
        clearInterval(this.intervalObj);
    }

    /**
     * Method to set connection status.
     */
    _connectionStatus(event) {
        const {status } = event;
        this.setState({ connectionStatus: status || event });
    }
    /**
     * Method to set State of speaker
     * @param {*} speakerOn
     */
    _setSpeakerState(speakerOn){
        this.setState({speakerOn});
    }
    /**
     * Renders the conference notification badge if the feature is enabled.
     *
     * @private
     * @returns {React$Node}
     */
    _renderConferenceNotification() {
        const { _calendarEnabled, _reducedUI } = this.props;

        return (
            _calendarEnabled && !_reducedUI
                ? <ConferenceNotification />
                : undefined);
    }

    /**
     * Renders a container for notifications to be displayed by the
     * base/notifications feature.
     *
     * @private
     * @returns {React$Element}
     */
    renderNotificationsContainer() {
        const notificationsStyle = {};

        // In the landscape mode (wide) there's problem with notifications being
        // shadowed by the filmstrip rendered on the right. This makes the "x"
        // button not clickable. In order to avoid that a margin of the
        // filmstrip's size is added to the right.
        //
        // Pawel: after many attempts I failed to make notifications adjust to
        // their contents width because of column and rows being used in the
        // flex layout. The only option that seemed to limit the notification's
        // size was explicit 'width' value which is not better than the margin
        // added here.
        if (this.props._filmstripVisible && !isNarrowAspectRatio(this)) {
            notificationsStyle.marginRight = FILMSTRIP_SIZE;
        }

        return super.renderNotificationsContainer(
            {
                style: notificationsStyle
            }
        );
    }

    _setToolboxVisible: (boolean) => void;

    /**
     * Dispatches an action changing the visibility of the {@link Toolbox}.
     *
     * @private
     * @param {boolean} visible - Pass {@code true} to show the
     * {@code Toolbox} or {@code false} to hide it.
     * @returns {void}
     */
    _setToolboxVisible(visible) {
        this.props.dispatch(setToolboxVisible(visible));
    }
}

/**
 * Maps (parts of) the redux state to the associated {@code Conference}'s props.
 *
 * @param {Object} state - The redux state.
 * @private
 * @returns {Props}
 */
function _mapStateToProps(state, ownProps) {
    const { connecting, connection } = state['features/base/connection'];
    const {
        conference,
        joining,
        leaving,
        room
    } = state['features/base/conference'];
    const { reducedUI } = state['features/base/responsive-ui'];

    // XXX There is a window of time between the successful establishment of the
    // XMPP connection and the subsequent commencement of joining the MUC during
    // which the app does not appear to be doing anything according to the redux
    // state. In order to not toggle the _connecting props during the window of
    // time in question, define _connecting as follows:
    // - the XMPP connection is connecting, or
    // - the XMPP connection is connected and the conference is joining, or
    // - the XMPP connection is connected and we have no conference yet, nor we
    //   are leaving one.
    const connecting_
        = connecting || (connection && (joining || (!conference && !leaving)));

    const { _participantId } = ownProps;

    const participants = getParticipants(state);

    const _settings = state['features/base/settings'];

    return {
        ...abstractMapStateToProps(state),

        /**
         * Wherther the calendar feature is enabled or not.
         *
         * @private
         * @type {boolean}
         */
        _calendarEnabled: isCalendarEnabled(state),

        /**
         * The indicator which determines that we are still connecting to the
         * conference which includes establishing the XMPP connection and then
         * joining the room. If truthy, then an activity/loading indicator will
         * be rendered.
         *
         * @private
         * @type {boolean}
         */
        _connecting: Boolean(connecting_),

        /**
         * Is {@code true} when the filmstrip is currently visible.
         */
        _filmstripVisible: isFilmstripVisible(state),

        /**
         * The ID of the participant currently on stage.
         */
        _largeVideoParticipantId: state['features/large-video'].participantId,

        /**
         * Whether Picture-in-Picture is enabled.
         *
         * @private
         * @type {boolean}
         */
        _pictureInPictureEnabled: getFeatureFlag(state, PIP_ENABLED),

        /**
         * The indicator which determines whether the UI is reduced (to
         * accommodate smaller display areas).
         *
         * @private
         * @type {boolean}
         */
        _reducedUI: reducedUI,

        /**
         * The indicator which determines whether the Toolbox is visible.
         *
         * @private
         * @type {boolean}
         */
        _toolboxVisible: isToolboxVisible(state),
        _participantId: state['features/large-video'].participantId,
        _styles: ColorSchemeRegistry.get(state, 'LargeVideo'),
        participants,
        roomName: _settings.teamName || '',
        isTeamsCall: _settings.isGroupCall,
        audioOnly: state['features/base/conference'].audioOnly
    };
}

export default connect(_mapStateToProps)(makeAspectRatioAware(Conference));
