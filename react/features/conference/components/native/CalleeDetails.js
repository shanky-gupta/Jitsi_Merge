import React, { Component } from 'react';
import { View, Image, Text } from 'react-native';
import styles from './styles';
import CallTimer from './CallTimer';
import {
    getParticipantDisplayName,
    getParticipants,
    getLocalParticipant
} from '../../../base/participants';
import { connect } from '../../../base/redux';
import CalleeBoxView from './CalleeBoxView';
class CalleeDetails extends Component {
    render() {
        const {roomName, participants, isTeamsCall, connected, otherParticipants, secsToMinString, callerName, callerDetails, connectionState} = this.props;
        let otherParticipant = null;
        if(!isTeamsCall && otherParticipants.length == 1){
            otherParticipant = otherParticipants[0];
        }
        let participantText = '';
        if(isTeamsCall){
            participantText = decodeURI(roomName);
        }else {
            participantText = callerName;
        }
        const participantsDetails = isTeamsCall ? 
                                    participants.length > 1 ?`${participants.length} Members` 
                                    : `${participants.length} Member`:callerDetails;  
        return (
            <View style = {styles.calleeContainerStyle}>
                <CalleeBoxView isTeamsCall={isTeamsCall} participant = {otherParticipant} roomName = {participantText}/>
                <CallTimer isTeamsCall={isTeamsCall} secsToMinString = {secsToMinString}/>
                <Text style = {isTeamsCall? styles.teamTextStyle: styles.oneToOneTextStyle }>{participantText}</Text>
                <Text style = { styles.participantTextStyle }>{participantsDetails}</Text>
                <Text style = { isTeamsCall? styles.connectionStatusTeamsTextStyle : styles.connectionStatusOneToOneTextStyle } >{connectionState}</Text>
            </View>
        );
    }
}

function _mapStateToProps(state: Object, ownProps: Props) {
    const participants = getParticipants(state);
    const localParticipant = getLocalParticipant(state);
    const _settings = state['features/base/settings'];
    const otherParticipants = participants.filter(p => p.id!==localParticipant.id);
    const callerName = _settings.callerName || '';
    const callerDetails = _settings.callerDetails || '';
    return {
            participants,
            otherParticipants,
            callerName,
            callerDetails
    };
}

export default connect(_mapStateToProps)(CalleeDetails);
