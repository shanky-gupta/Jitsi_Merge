// @flow

import type { Dispatch } from 'redux';

import { translate } from '../../../../base/i18n';
import { IconInfo } from '../../../../base/icons';
import { connect } from '../../../../base/redux';
import { AbstractButton } from '../../../../base/toolbox';
import type { AbstractButtonProps } from '../../../../base/toolbox';
import { beginShareRoom } from '../../../../share-room';
import { NativeModules } from 'react-native';
const { JSCommunicateComponent, AudioMode, OpenMelpChat } = NativeModules;

type Props = AbstractButtonProps & {

    /**
     * The Redux dispatch function.
     */
    dispatch: Dispatch<any>
};

/**
 * Implements an {@link AbstractButton} to open the info dialog of the meeting.
 */
class InfoDialogButton extends AbstractButton<Props, *> {
    accessibilityLabel = 'info.accessibilityLabel';
    icon = IconInfo;
    label = 'info.label';

    /**
     * Handles clicking / pressing the button, and opens the appropriate dialog.
     *
     * @private
     * @returns {void}
     */
    _handleClick() {
    /**
    *    this.props.dispatch(beginShareRoom());
    */
        // AudioMode.shareMeetingInfo(true);

         NativeModules.NativeCalls.addToCall();


    }


    _getView(props) {
        if (props.children) {
            return this.props.children(this._onClick);
        }
            return super._getView(props);

    }
}

export default translate(connect()(InfoDialogButton));
