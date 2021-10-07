import { BoxModel, ColorPalette, fixAndroidViewClipping } from '../../../base/styles';

import { FILMSTRIP_SIZE } from '../../../filmstrip';

export const NAVBAR_GRADIENT_COLORS = [ '#000000FF', '#00000000' ];
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Dimensions, PixelRatio } from 'react-native';
export const SECURITY_CALL_LOGO = require('../../../../../images/security_call.png');
export const CALL_ICON = require('../../../../../images/path.png');
export const CALL_ONETOONE_ICON = require('../../../../../images/pathOneToOne.png');
export const DESKTOP_ENABLED_ICON = require('../../../../../images/desktop-enable.png');
export const DESKTOP_DISABLED_ICON = require('../../../../../images/desktop-disable.png');
export const VIEW_ATTENDEES_ENABLED_ICON = require('../../../../../images/Icon-viewattendees.png');
export const VIEW_ATTENDEES_DISABLED_ICON = require('../../../../../images/Icon-viewattendees-disable.png');
export const ADD_CALL_ICON = require('../../../../../images/ic_invite_24px.png');
export const AUDIO_MUTE_DISABLED_ICON = require('../../../../../images/Icon-unmute.png');
export const AUDIO_MUTE_ENABLED_ICON = require('../../../../../images/Icon-mute.png');
export const VIDEO_CALL_DISABLED_ICON = require('../../../../../images/videoCall-disable.png');
export const VIDEO_CALL_ENABLED_ICON = require('../../../../../images/videoCall-enable.png');
export const SPEAKER_DISABLED_ICON = require('../../../../../images/Icon-speakeroff.png');
export const SPEAKER_ENABLED_ICON = require('../../../../../images/Icon-speakeron.png');
export const SPEAKER_TEAMS_INACTIVE_ICON = require('../../../../../images/speaker-disabled.png');
export const AUDIO_MUTE_TEAMS_INACTIVE_ICON = require('../../../../../images/mute_disabled.png');
export const VIDEO_TEAMS_INACTIVE_ICON = require('../../../../../images/video-inactive-teams.png');
export const VIDEO_ONE_TO_ONE_INACTIVE_ICON = require('../../../../../images/video-inactive-one-one.png');
export const SPEAKER_ONE_TO_ONE_INACTIVE_ICON = require('../../../../../images/speaker-inactive-one-one.png');
export const AUDIO_MUTE_ONE_TO_ONE_INACTIVE_ICON = require('../../../../../images/mute-inactive-one-one.png');
export const MESSAGE_ICON = require('../../../../../images/Icon-callingmessage.png');
export const END_CALL_ICON = require('../../../../../images/group.png');
export const HOLD_ENABLED_ICON = require('../../../../../images/Icon-unhold.png');
export const HOLD_DISABLED_ICON = require('../../../../../images/Icon-hold.png');
export const BACK_ICON = require('../../../../../images/page1.png');
export const ADD_ICON = require('../../../../../images/shape.png');
export const CROSS_ICON = require('../../../../../images/cross.png');

// From brand guideline
const BOTTOM_GRADIENT_HEIGHT = 290;
const DEFAULT_GRADIENT_SIZE = 140;

/**
 * The styles of the feature conference.
 */


const SCREEN_WIDTH = Dimensions.get('window').width; // get current width
const SCALE = 414;

const WIDTH = 414;
const HEIGHT = 736;

// function getDimenRatio(dimen){
//     const str = dimen.substring(0, dimen.length - 1);
//     const dimension = parseInt(str);
//     return dimension / 100;
// }
// /**
//  * scale to actual height
//  */
// function hp(height){
//     const ratio = getDimenRatio(height);
//     return ratio * HEIGHT;
// }


// /**
//  * scale to actual height
//  */
// function wp(width) {
//     const ratio = getDimenRatio(width);
//     return ratio * WIDTH;
// }


function getRatio() {
    const val = PixelRatio.get();

    if (val <= 1) {
        return 1;
    } else if (val > 1 && val <= 2) {
        return 2;
    } else if (val > 2 && val <= 3) {
        return 3;
    }

    return 4;

    return 1;

}

const scaleFontSize = fontSize => {
    const ratio = fontSize / SCALE; // get ratio based on your standard scale
    const newSize = Math.round(ratio * SCREEN_WIDTH);


    return newSize;
};


function calculatePercentageHeight(size, scale = HEIGHT) {
    return `${(size / scale * 100)}%`;
}

function calculatePercentageWidth(size, scale = WIDTH) {
    return `${(size / scale * 100)}%`;
}

const commonStyles = {
    attendeesContainer: {
        width: '100%',
        height: '100%',
        zOrder: 2,
        backgroundColor: 'white',
        position: 'absolute',
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    attendeesTopContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 22,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: 'white'
    },
    participantItemContainerStyle: {
        height: 89,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: 'rgb(248, 248, 248)',
        paddingLeft: 20,
        paddingRight: 26,
        borderRadius: 9.5
    },

    participantNameSectionStyle: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgb(248, 248, 248)',
        paddingLeft: 20
    },
    pariticipantNameTextStyle: {
        fontSize: 15,
        fontFamily: 'AkzidenzGroteskPro-Bold',
        color: 'rgb(34,32,32)'
    },

    pariticipantPositionTextStyle: {
        marginTop: 1,
        fontSize: 13,
        fontFamily: 'AkzidenzGroteskPro-Regular',
        color: 'rgb(115,112,112)'
    }
};


export default {

    bottomGradient: {
        bottom: 0,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        minHeight: DEFAULT_GRADIENT_SIZE,
        left: 0,
        position: 'absolute',
        right: 0
    },

    /**
     * {@code Conference} style.
     */
    conference: fixAndroidViewClipping({
        alignSelf: 'stretch',
        backgroundColor: ColorPalette.appBackground,
        flex: 1
    }),

    gradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flex: 1
    },

    gradientStretchBottom: {
        height: BOTTOM_GRADIENT_HEIGHT
    },

    gradientStretchTop: {
        height: DEFAULT_GRADIENT_SIZE
    },

    /**
     * View that contains the indicators.
     */
    indicatorContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        margin: BoxModel.margin
    },

    /**
     * Indicator container for wide aspect ratio.
     */
    indicatorContainerWide: {
        marginRight: FILMSTRIP_SIZE + BoxModel.margin
    },

    labelWrapper: {
        flexDirection: 'column',
        position: 'absolute',
        right: 0,
        top: 0
    },

    navBarButton: {
        iconStyle: {
            color: ColorPalette.white,
            fontSize: 24
        },

        underlayColor: 'transparent'
    },

    navBarContainer: {
        flexDirection: 'column',
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0
    },

    navBarSafeView: {
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0
    },

    navBarWrapper: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        height: 44,
        justifyContent: 'space-between',
        paddingHorizontal: 14
    },

    roomName: {
        color: ColorPalette.white,
        fontSize: 17,
        fontWeight: '400'
    },

    roomNameWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        left: 0,
        paddingHorizontal: 48,
        position: 'absolute',
        right: 0
    },

    /**
     * The style of the {@link View} which expands over the whole
     * {@link Conference} area and splits it between the {@link Filmstrip} and
     * the {@link Toolbox}.
     */
    toolboxAndFilmstripContainer: {
        bottom: 0,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        left: 0,
        paddingBottom: BoxModel.padding,
        position: 'absolute',
        right: 0,

        // Both on Android and iOS there is the status bar which may be visible.
        // On iPhone X there is the notch. In the two cases BoxModel.margin is
        // not enough.
        top: BoxModel.margin * 3
    },
    selectSoundDeviceVideoStyle: {
        position: 'absolute',
        top: hp('2.7%'),
        right: wp('4.83%')
    },
    mainContainerTeamsStyle: {
        backgroundColor: 'black',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },

    mainContainerOneToOneStyle: {
        backgroundColor: 'rgb(252,252,252)',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },

    upperTextTeamContainerStyle: {
        color: 'white',
        width: '100%',
        textAlign: 'center',
        marginTop: hp('2.7%'),
        fontSize: scaleFontSize(11),
        fontFamily: 'AkzidenzGroteskPro-Bold'
    },
   customFilmstripViewBoxStyle: {
        height: hp('0.01%'),
        width: hp('0.01%'),
        borderRadius: 18,
        borderWidth: 1,
        padding: 4,
        borderColor: 'rgba(0,0,0,0)',
        bottomPadding : 1000
    },
    upperTextOneToOneContainerStyle: {
        color: '#222220',
        width: '100%',
        textAlign: 'center',
        marginTop: hp('2.7%'),
        fontSize: scaleFontSize(11),
        fontFamily: 'AkzidenzGroteskPro-Bold'
    },
    encryptedContainerStyle: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        position: 'absolute',
        top: hp('2.7%'),
        right: wp('4.83%')
    },
    securityLogoImageStyle: {
        height: hp('2.7%'),
        width: wp('4.83%')
    },
    encryptedTextTeamStyle: {
        color: 'white',
        fontSize: scaleFontSize(8),
        marginRight: wp('2.415%'),
        marginTop: hp('0.679%'),
        fontFamily: 'AkzidenzGroteskPro-Bold'
    },
    encryptedTextOneToOneStyle: {
        color: 'rgb(201,207,215)',
        fontSize: scaleFontSize(8),
        marginRight: wp('2.415%'),
        marginTop: hp('0.679%'),
        fontFamily: 'AkzidenzGroteskPro-Bold'
    },
    calleeContainerStyle: {
        marginTop: hp('4.07%'),
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },

    callerTimeTeamContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgb(255,255,255)',
        borderTopLeftRadius: 99,
        borderTopRightRadius: 99,
        borderBottomLeftRadius: 99,
        borderBottomRightRadius: 99,
        position: 'absolute',
        paddingLeft: wp('2.41%'),
        paddingRight: wp('2.41%'),
        height: hp('4.07%'),
        minWidth: wp('22.22%'),
        top: hp('19.8%')
    },

    callerTimeOneToOneContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgb(34, 32, 32)',
        borderTopLeftRadius: 99,
        borderTopRightRadius: 99,
        borderBottomLeftRadius: 99,
        borderBottomRightRadius: 99,
        position: 'absolute',
        paddingLeft: wp('2.41%'),
        paddingRight: wp('2.41%'),
        height: hp('4.08%'),
        minWidth: wp('22.22%'),
        top: hp('19.8%')
    },

    callIcon: {
        height: hp(calculatePercentageHeight(13)), // hp('1.76%'),
        width: hp(calculatePercentageHeight(13)),
        marginLeft: wp('2.41%')
    },

    callOneToOneIcon: {
        height: hp('2.85%'),
        width: wp('5.07%'),
        marginTop: hp('0.679%'),
        marginLeft: wp('2.41%')
    },

    timerTextTeamStyle: {
        fontSize: scaleFontSize(13),
        marginLeft: wp('1.93%'),
        color: 'rgb(34,32,32)'
    },

    timerTextOneToOneStyle: {
        fontSize: scaleFontSize(13),
        marginLeft: wp('1.93%'),
        color: 'rgb(255, 255, 255)'
    },

    teamTextStyle: {
        marginTop: hp('4.07%'),
        fontSize: scaleFontSize(24),
        fontFamily: 'AkzidenzGroteskPro-Bold',
        color: 'white'
    },

    oneToOneTextStyle: {
        marginTop: hp('4.07%'),
        fontSize: scaleFontSize(24),
        fontFamily: 'AkzidenzGroteskPro-Bold',
        color: 'rgb(34,32,32)'
    },

    participantTextStyle: {
        fontSize: scaleFontSize(17),
        color: 'rgb(238,65,54)',
        fontFamily: 'AkzidenzGroteskPro-Light'
    },

    calleeViewBoxStyle: {
        height: hp('22.01%'),
        width: hp('22.01%'),
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(214,219,225,0.2)'
    },

    imageViewBoxStyle: {
        height: hp('22.01%'),
        width: hp('22.01%'),
        borderRadius: 18,
        borderWidth: 1,
        padding: 4,
        borderColor: 'rgb(238, 65, 54)'
    },

    calleeInitialStyle: {
        fontSize: scaleFontSize(64),
        color: 'rgb(255,255,255)'
    },

    connectionStatusOneToOneTextStyle: {
        marginTop: hp('1.36%'),
        fontSize: scaleFontSize(13),
        color: 'black'
    },

    connectionStatusTeamsTextStyle: {
        marginTop: hp('1.36%'),
        fontSize: scaleFontSize(13),
        color: 'white'
    },

    toolBoxContainerStyle: {
        paddingBottom: hp('2.72%'),
        paddingLeft: wp('4.83%'),
        paddingRight: wp('4.83%'),
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
    },

    toolBoxSectionContainerStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center'
    },

    toolBoxFunctionContainerStyle: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: wp('24.15%'),
        paddingTop: hp('3.3%'),
        paddingBottom: hp('3.3%')

        // paddingLeft: wp('2.415%'),
        // paddingRight: wp('2.415%')
    },

    endCallFunctionContainerStyle: {
        marginTop: getRatio() === 1 ? 2 : 5,
        height: getRatio() === 1 ? 90 : getRatio() === 2 ? 110 : getRatio() === 3 ? 110 : 135,
        width: getRatio() === 1 ? 90 : getRatio() === 2 ? 110 : getRatio() === 3 ? 110 : 135,
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column'
    },

    messageFunctionContainerStyle: {
        marginTop: hp('0.69%'),
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: wp('24.15%'),
        paddingTop: hp('1.35%'),
        paddingBottom: hp('1.35%'),
        paddingLeft: wp('2.415%'),
        paddingRight: wp('2.415%')
    },

    holdFunctionContainerStyle: {
        marginTop: hp('0.69%'),
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: wp('24.15%'),
        paddingTop: hp('1.35%'),
        paddingBottom: hp('1.35%'),
        paddingLeft: wp('2.415%'),
        paddingRight: wp('2.415%')
    },

    toolBoxIconStyle: {
        height: hp('6.00%'),
        width: hp('6.00%')
    },

    speakerIconStyle: {
        width: wp(calculatePercentageWidth(31)), // /getRatio() === 1 ? 31 : getRatio() === 2 ? 62 : 93,
        height: 30 / 31 * wp(calculatePercentageWidth(31)), // getRatio() === 1 ? 30 : getRatio() === 2 ? 60 : 90,
        marginBottom: hp(`${11.4 / HEIGHT * 100}%`)
    },

    holdIconStyle: {
        width: wp(calculatePercentageWidth(30)), // getRatio() === 1 ? 21 : getRatio() === 2 ? 42 : 63,
        height: 24 / 22 * wp(calculatePercentageWidth(22)), // getRatio() === 1 ? 24 : getRatio() === 2 ? 48 : 72,
        marginBottom: hp(`${15.3 / HEIGHT * 100}%`)

        // backgroundColor: 'blue'
    },

    endIconStyle: {
        flex: 1,
        width: undefined,
        height: undefined,
        overflow: 'visible'
    },

    muteIconStyle: {
        width: wp(calculatePercentageWidth(31)), // getRatio() === 1 ? 31 : getRatio() === 2 ? 62 : 63,
        height: (33 / 31) * wp(calculatePercentageWidth(31)), // getRatio() === 1 ? 33 : getRatio() === 2 ? 66 : 69,
        marginBottom: hp(`${9.9 / HEIGHT * 100}%`)
    },

    messageIconStyle: {
        width: wp(calculatePercentageWidth(30)), // getRatio() === 1 ? 34 : getRatio() === 2 ? 68 : 102,
        height: (27 / 30) * wp(calculatePercentageWidth(30)), // getRatio() === 1 ? 32 : getRatio() === 2 ? 64 : 96,
        marginBottom: hp(`${14 / HEIGHT * 100}%`)
    },

    videoIconStyle: {
        width: wp(calculatePercentageWidth(34)), // getRatio() === 1 ? 34 : getRatio() === 2 ? 68 : 102,
        height: (23 / 34) * wp(calculatePercentageWidth(34)), // getRatio() === 1 ? 23 : getRatio() === 2 ? 46 : 69,
        marginBottom: hp(`${14.7 / HEIGHT * 100}%`),
        marginTop: 3
    },

    attendeesIconStyle: {
        width: wp(calculatePercentageWidth(38)), // getRatio() === 1 ? 38 : getRatio() === 2 ? 76 : 114,
        height: 25 / 38 * wp(calculatePercentageWidth(38)), // getRatio() === 1 ? 25 : getRatio() === 2 ? 50 : 75,
        marginBottom: hp(`${16 / HEIGHT * 100}%`)
    },

    desktopIconStyle: {
        width: wp(calculatePercentageWidth(22)), // getRatio() === 1 ? 30 : getRatio() === 2 ? 60 : 90,
        height: (30 / 22) * wp(calculatePercentageWidth(22)), // getRatio() === 1 ? 25 : getRatio() === 2 ? 50 : 75,
        marginBottom: hp(`${10 / HEIGHT * 100}%`)
    },

    addCallIconStyle: {
        width: wp(calculatePercentageWidth(27)),
        height: wp(calculatePercentageWidth(27)),
        marginBottom: hp(`${16.3 / HEIGHT * 100}%`)
    },

    endCallIconStyle: {
        flex: 1
    },
    toolBoxFunctionTextTeamStyle: {
        // marginTop: hp('1.36%'),
        fontSize: scaleFontSize(8),
        textAlign: 'center',
        color: 'white',
        fontFamily: 'AkzidenzGroteskPro-Bold'
    },

    toolBoxFunctionInactiveTeamStyle: {
        // marginTop: hp('1.36%'),
        fontSize: scaleFontSize(8),
        textAlign: 'center',
        color: 'rgb(64,58,58)',
        fontFamily: 'AkzidenzGroteskPro-Bold'
    },

    toolBoxFunctionInactiveOneToOneStyle: {
        // marginTop: hp('1.36%'),
        fontSize: scaleFontSize(8),
        textAlign: 'center',
        color: 'rgb(229, 232, 235)',
        fontFamily: 'AkzidenzGroteskPro-Bold'
    },

    toolBoxFunctionTextOneToOneStyle: {
        // marginTop: hp('1.36%'),
        fontSize: scaleFontSize(8),
        textAlign: 'center',
        color: 'rgb(34,32,32)',
        fontFamily: 'AkzidenzGroteskPro-Bold'
    },
    toolBoxFunctionTextDisableDialpadStyle: {
        // marginTop: hp('1.36%'),
        fontSize: scaleFontSize(8),
        textAlign: 'center',
        color: 'rgba(64,58,100, 0.2)',
        fontFamily: 'AkzidenzGroteskPro-Bold'
    },

    attendeesContainer: {
        ...commonStyles.attendeesContainer
    },

    attendeesTopContainer: {
        ...commonStyles.attendeesTopContainer
    },

    attendeesTeamsContainer: {
        ...commonStyles.attendeesContainer,
        backgroundColor: 'rgb(39,36,36)'
    },
    attendeesTeamsTopContainer: {
        ...commonStyles.attendeesTopContainer,
        backgroundColor: 'rgb(39,36,36)'
    },
    listContainerStyle: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 25
    },

    participantImageStyle: {
        height: 46,
        width: 46,
        borderRadius: 6
    },

    participantNameContainerStyle: {
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },

    pariticipantNameTextStyle: {
        ...commonStyles.pariticipantNameTextStyle
    },

    pariticipantPositionTextStyle: {
        ...commonStyles.pariticipantPositionTextStyle
    },

    pariticipantTeamsNameTextStyle: {
        ...commonStyles.pariticipantNameTextStyle,
        color: 'rgb(255,255,255)'
    },

    pariticipantTeamsPositionTextStyle: {
        ...commonStyles.pariticipantPositionTextStyle,
        color: 'rgb(157,151,151)'
    },

    participantItemContainerStyle: {
        ...commonStyles.participantItemContainerStyle
    },

    participantNameSectionStyle: {
        ...commonStyles.participantNameSectionStyle
    },

    participantTeamsItemContainerStyle: {
        ...commonStyles.participantItemContainerStyle,
        backgroundColor: 'rgb(37,33,33)'
    },

    participantTeamsNameSectionStyle: {
        ...commonStyles.participantItemContainerStyle,
        backgroundColor: 'rgb(37,33,33)'
    },

    backIconStyle: {
        width: 26,
        height: 16
    },

    addIconStyle: {
        height: 23,
        width: 23
    }
};
