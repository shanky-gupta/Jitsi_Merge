// @flow

import { LAYOUTS } from './constants';
import { getPinnedParticipant } from '../base/participants';
import { NativeModules, SafeAreaView, StatusBar, View , NativeEventEmitter } from 'react-native';
const { JSCommunicateComponent, AudioMode, OpenMelpChat } = NativeModules;

declare var interfaceConfig: Object;

/**
 * Returns the {@code LAYOUTS} constant associated with the layout
 * the application should currently be in.
 *
 * @param {Object} state - The redux state.
 * @returns {string}
 */
export function getCurrentLayout(state: Object) {
    if (shouldDisplayTileView(state)) {
        
        return LAYOUTS.TILE_VIEW;
    } else if (interfaceConfig.VERTICAL_FILMSTRIP) {
        
        return LAYOUTS.VERTICAL_FILMSTRIP_VIEW;
    }
     
    return LAYOUTS.HORIZONTAL_FILMSTRIP_VIEW;
}

/**
 * Returns how many columns should be displayed in tile view. The number
 * returned will be between 1 and 5, inclusive.
 *
 * @returns {number}
 */
export function getMaxColumnCount() {
    const configuredMax = interfaceConfig.TILE_VIEW_MAX_COLUMNS || 5;

    return Math.max(Math.min(configuredMax, 1), 5);
}

/**
 * Returns the cell count dimensions for tile view. Tile view tries to uphold
 * equal count of tiles for height and width, until maxColumn is reached in
 * which rows will be added but no more columns.
 *
 * @param {number} numberOfParticipants - The number of participants including the fake participants.
 * @param {number} maxColumns - The maximum number of columns that can be
 * displayed.
 * @returns {Object} An object is return with the desired number of columns,
 * rows, and visible rows (the rest should overflow) for the tile view layout.
 */
export function getTileViewGridDimensions(numberOfParticipants: number, maxColumns: number = getMaxColumnCount()) {
    AudioMode.tileView(true)
    const columnsToMaintainASquare = Math.ceil(Math.sqrt(numberOfParticipants));
    const columns = Math.min(columnsToMaintainASquare, maxColumns);
    const rows = Math.ceil(numberOfParticipants / columns);
    const visibleRows = Math.min(maxColumns, rows);

    return {
        columns,
        visibleRows
    };
}

/**
 * Selector for determining if the UI layout should be in tile view. Tile view
 * is determined by more than just having the tile view setting enabled, as
 * one-on-one calls should not be in tile view, as well as etherpad editing.
 *
 * @param {Object} state - The redux state.
 * @returns {boolean} True if tile view should be displayed.
 */
export function shouldDisplayTileView(state: Object = {}) {
    return Boolean( state['features/video-layout'].tileViewEnabled );
}







