// @flow

import type { Dispatch } from 'redux';

import { getFeatureFlag, INVITE_ENABLED } from '../../../../base/flags';
import { translate } from '../../../../base/i18n';
import { IconAddPeople } from '../../../../base/icons';
import { connect } from '../../../../base/redux';
import { AbstractButton } from '../../../../base/toolbox';
import type { AbstractButtonProps } from '../../../../base/toolbox';

import { setAddPeopleDialogVisible } from '../../../actions';
import { isAddPeopleEnabled, isDialOutEnabled } from '../../../functions';

type Props = AbstractButtonProps & {

    /**
     * The Redux dispatch function.
     */
    dispatch: Dispatch<any>
};

/**
 * Implements an {@link AbstractButton} to enter add/invite people to the
 * current call/conference/meeting.
 */
class InviteButton extends AbstractButton<Props, *> {
    accessibilityLabel = 'toolbar.accessibilityLabel.shareRoom';
    icon = IconAddPeople;
    label = 'toolbar.shareRoom';

    /**
     * Handles clicking / pressing the button, and opens the appropriate dialog.
     *
     * @private
     * @returns {void}
     */
    _handleClick() {
        this.props.dispatch(setAddPeopleDialogVisible(true));
    }

    _getView(props) {
        if (props.children) {
            return this.props.children(this._onClick);
        } else {
            return super._getView(props);
        }
    }
}

/**
 * Maps (parts of) the redux state to {@link InviteButton}'s React {@code Component}
 * props.
 *
 * @param {Object} state - The redux store/state.
 * @param {Object} ownProps - The properties explicitly passed to the component
 * instance.
 * @private
 * @returns {Object}
 */
function _mapStateToProps(state: Object, ownProps: Object) {
    const addPeopleEnabled = getFeatureFlag(state, INVITE_ENABLED, true)
        && (isAddPeopleEnabled(state) || isDialOutEnabled(state));
    const { visible = Boolean(addPeopleEnabled) } = ownProps;

    return {
        visible
    };
}

export default translate(connect(_mapStateToProps)(InviteButton));
