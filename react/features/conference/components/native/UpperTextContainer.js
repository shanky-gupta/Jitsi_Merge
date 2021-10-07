import React, { Component } from 'react';
import { View, Text } from 'react-native';
import EncryptedView from './EncryptedView';
import { connect } from '../../../base/redux';
import {
    getParticipants
} from '../../../base/participants';
import styles from './styles';
class UpperTextContainer extends Component {
    render() {
        const { isTeamsCall } = this.props;
        const upperTextContainerStyle = isTeamsCall? styles.upperTextTeamContainerStyle : styles.upperTextOneToOneContainerStyle;
        const upperText = isTeamsCall ? 'TEAM CALL' : 'STARTED CALL WITH';
        return (
            <View>
                <Text style = { upperTextContainerStyle }>{upperText}</Text>
                <EncryptedView {...this.props}/>
            </View>
        );
    }
}


function _mapStateToProps(state, ownProps) {
    const participants = getParticipants(state);
    return {
        participants
    };
}

export default connect(_mapStateToProps)(UpperTextContainer);
