// @flow

import { getCurrentConference } from '../base/conference';
import { MiddlewareRegistry, StateListenerRegistry } from '../base/redux';
import UIEvents from '../../../service/UI/UIEvents';

import { TOGGLE_DOCUMENT_EDITING } from './actionTypes';
import { setDocumentEditingState, setDocumentUrl } from './actions';

import { NativeModules } from 'react-native';
const { AudioMode } = NativeModules;

declare var APP: Object;

const ETHERPAD_COMMAND = 'etherpad';

/**
 * Middleware that captures actions related to collaborative document editing
 * and notifies components not hooked into redux.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
// eslint-disable-next-line no-unused-vars
MiddlewareRegistry.register(({ dispatch, getState }) => next => action => {
    switch (action.type) {
    case TOGGLE_DOCUMENT_EDITING: {
       
        if (typeof APP === 'undefined') {
            const { editing } = getState()['features/etherpad'];

            dispatch(setDocumentEditingState(!editing));
             
        } else {
            
            APP.UI.emitEvent(UIEvents.ETHERPAD_CLICKED);
        }
        break;
    }
    }

    return next(action);
});

/**
 * Set up state change listener to perform maintenance tasks when the conference
 * is left or failed, e.g. clear messages or close the chat modal if it's left
 * open.
 */
StateListenerRegistry.register(
    state => getCurrentConference(state),
    (conference, { dispatch, getState }, previousConference) => {

        if (conference) {

                  NativeModules.NativeCalls.etharpad();
            conference.addCommandListener(ETHERPAD_COMMAND,
                ({ value }) => {
                    let url;

                    const { etherpad_base: etherpadBase } = getState()['features/base/config'];
                    
                    if (etherpadBase) {


                        const u = new URL(value, etherpadBase);

                        url = u.toString();
                     NativeModules.NativeCalls.etharpadinside(url);
                    }

                    dispatch(setDocumentUrl(url));



                }
            );
        }

        if (previousConference) {
            dispatch(setDocumentUrl(undefined));
        }
    });
