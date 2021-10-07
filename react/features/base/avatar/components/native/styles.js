// @flow

import { StyleSheet } from 'react-native';

import { ColorPalette } from '../../../styles';

const DEFAULT_SIZE = 65;
const icon_size = 190;

/**
 * The styles of the feature base/participants.
 */
export default {

    avatarContainer: (size: number = DEFAULT_SIZE) => {
      //  size = icon_size;
        if(size == 190){
        return {
            alignItems: 'center',
            borderRadius: size / 2,
            height: size,
            justifyContent: 'center',
            overflow: 'hidden',
            borderRadius: 18,
            borderWidth: 1,
            padding: 4,
            width: size,
           borderColor: 'rgb(238, 65, 54)'
        };



     }
        return {
            alignItems: 'center',
            borderRadius: size / 2,
            height: size,
            justifyContent: 'center',
            overflow: 'hidden',
            borderRadius: 10,
            borderWidth: 1,
            padding: 4,
            width: size,
            borderColor: 'rgb(238, 65, 54)'
        };
    },

    avatarContent: (size: number = DEFAULT_SIZE) => {

   //  size = icon_size;
      if(size == 190){

           return {
            height: size-6,
            width: size-6, 
            padding: 4, 
            marginTop : 6,
           marginBottom : 6, 
           marginLeft : 6,
           marginRight : 6,
           borderRadius: 18,
           borderWidth: 1 ,
           borderColor : 'rgba(0,0,0,0)'
          };
     }else {
        return {
            height: size-4,
            width: size-4,
           padding: 4, 
            marginTop : 4,
           marginBottom : 4, 
           marginLeft : 4,
           marginRight : 4,
           borderRadius: 10,
           borderWidth: 1 ,
           borderColor : 'rgba(0,0,0,0)'
            
        };


    }
        
    },

    badge: (size: number = DEFAULT_SIZE, status: string) => {
        let color;

        switch (status) {
        case 'available':
            color = 'rgb(110, 176, 5)';
            break;
        case 'away':
            color = 'rgb(250, 201, 20)';
            break;
        case 'busy':
            color = 'rgb(233, 0, 27)';
            break;
        case 'idle':
            color = 'rgb(172, 172, 172)';
            break;
        }

        return {
            backgroundColor: color,
            borderRadius: size / 2,
            bottom: 0,
            height: size * 0.3,
            position: 'absolute',
            width: size * 0.3
        };
    },

    badgeContainer: {
        ...StyleSheet.absoluteFillObject
    },

    initialsContainer: {
        alignItems: 'center',
        alignSelf: 'stretch',
        flex: 1,
        justifyContent: 'center'
    },

    initialsText: (size: number = DEFAULT_SIZE) => {
        return {
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: size * 0.45,
            fontWeight: '100'
        };
    },

    staticAvatar: {
        backgroundColor: ColorPalette.lightGrey,
        opacity: 0.4
    }
};
