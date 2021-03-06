// @flow

import { ColorPalette, getRGBAFormat } from '../styles';

/**
 * The default color scheme of the application.
 */
export default {
    '_defaultTheme': {
        // Generic app theme colors that are used accross the entire app.
        // All scheme definitions below inherit these values.
        background: 'rgba(39, 36, 36, 1)',
        errorText: ColorPalette.red,
        icon: 'rgb(255, 255, 255)',
        text: 'rgb(255, 255, 255)'
    },
    'Chat': {
        displayName: 'rgb(94, 109, 121)',
        localMsgBackground: 'rgb(215, 230, 249)',
        privateMsgBackground: 'rgb(250, 219, 219)',
        privateMsgNotice: 'rgb(186, 39, 58)',
        remoteMsgBackground: 'rgb(241, 242, 246)',
        replyBorder: 'rgb(219, 197, 200)',
        replyIcon: 'rgb(94, 109, 121)'
    },
    'Dialog': {
        background: 'rgb(255, 255, 255)',
        border: 'rgba(0, 3, 6, 0.6)',
        buttonBackground: ColorPalette.blue,
        buttonLabel: ColorPalette.white,
        icon: '#1c2025',
        text: '#1c2025'
    },
    'Header': {
        background: ColorPalette.blue,
        icon: ColorPalette.white,
        statusBar: ColorPalette.blueHighlight,
        statusBarContent: ColorPalette.white,
        text: ColorPalette.white
    },
    'LargeVideo': {
       // background: 'rgb(42, 58, 75)'
       background: 'rgb(0, 0, 0)'
    },
    'LoadConfigOverlay': {
        background: 'rgb(249, 249, 249)',
        text: 'rgb(28, 32, 37)'
    },
    'Thumbnail': {
        activeParticipantHighlight: 'rgb(81, 214, 170)',
        activeParticipantTint: 'rgba(49, 183, 106, 0.3)',
        background: 'rgb(94, 109, 122)'
    },
    'Toolbox': {
        button: getRGBAFormat('#9C9696', 0.2),
        buttonToggled: 'rgb(38, 58, 76)',
        buttonToggledBorder: getRGBAFormat('#a4b8d1', 0.6),
        hangup: 'rgb(225, 45, 45)'
        
        
    }
};
