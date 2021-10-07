
import React, { Component } from 'react';
import { connect } from '../../../base/redux';
import styles from './styles';
import { View, Image, Text } from 'react-native';
import Avatar from '../../../base/avatar/components/Avatar';
import { isUndefined } from 'util';
class CalleeBoxView extends Component {
    render() {
        const {isTeamsCall, participant, roomName, participantId, userPicUrl} = this.props;
        const initials = roomName ? roomName.split(' ').filter(n=>n && n.length>0).map(n=>n[0]).join(''): '';
        let avatarImageUrl = null;
        if(participant!=null){
            avatarImageUrl = participant.avatarImageUrl;
        }
        return (
            isTeamsCall?
            (<View style = { styles.calleeViewBoxStyle } >
                <Text style = {styles.calleeInitialStyle}>{initials}</Text>
            </View>):
            <View style = { styles.imageViewBoxStyle } >
                <Image source={{uri: userPicUrl}} style = { {flex: 1, width: undefined, height: undefined, borderRadius: 18, overflow: 'hidden'}} resizeMode = 'stretch'/>
            </View>
        );
    }
}

function _mapStateToProps(state, ownProps) {
    _participantId= state['features/large-video'].participantId;
     _settings = state['features/base/settings'];
    return {
        participantId: _participantId,
        userPicUrl:_settings.callerAvatarURL
    };

}

export default connect(_mapStateToProps)(CalleeBoxView);