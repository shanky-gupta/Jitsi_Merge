// @flow

import React, { Component } from 'react';
import {
    ScrollView,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import type { Dispatch } from 'redux';

import {
    getNearestReceiverVideoQualityLevel,
    setMaxReceiverVideoQuality
} from '../../../base/conference';
import { connect } from '../../../base/redux';
import {
    DimensionsDetector,
    isNarrowAspectRatio,
    makeAspectRatioAware
} from '../../../base/responsive-ui';

import Thumbnail from './Thumbnail';
import styles from './styles';
import { NativeModules, SafeAreaView, StatusBar , NativeEventEmitter } from 'react-native';
const { JSCommunicateComponent, AudioMode, OpenMelpChat } = NativeModules;

/**
 * The type of the React {@link Component} props of {@link TileView}.
 */
type Props = {

    /**
     * The participants in the conference.
     */
    _participants: Array<Object>,

    /**
     * Invoked to update the receiver video quality.
     */
    dispatch: Dispatch<any>,

    /**
     * Callback to invoke when tile view is tapped.
     */
    onClick: Function
};

/**
 * The type of the React {@link Component} state of {@link TileView}.
 */
type State = {

    /**
     * The available width for {@link TileView} to occupy.
     */
    height: number,

    /**
     * The available height for {@link TileView} to occupy.
     */
    width: number
};

/**
 * The margin for each side of the tile view. Taken away from the available
 * height and width for the tile container to display in.
 *
 * @private
 * @type {number}
 */
const MARGIN = 1;


/**
 * The aspect ratio the tiles should display in.
 *
 * @private
 * @type {number}
 */
var TILE_ASPECT_RATIO = 1;
var MAX_COLUMN_LANDSCAPE = 5;
var max_fit_rows = 3;
var expected_row;
var expected_col;

/**
 * Implements a React {@link Component} which displays thumbnails in a two
 * dimensional grid.
 *
 * @extends Component
 */
class TileView extends Component<Props, State> {
    state = {
        height: 0,
        width: 0
    };

    /**
     * Initializes a new {@code TileView} instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: Props) {
        super(props);

        // Bind event handler so it is only bound once per instance.
        this._onDimensionsChanged = this._onDimensionsChanged.bind(this);


    }

    /**
     * Implements React's {@link Component#componentDidMount}.
     *
     * @inheritdoc
     */
    componentDidMount() {
        this._updateReceiverQuality();
    }

    /**
     * Implements React's {@link Component#componentDidUpdate}.
     *
     * @inheritdoc
     */
    componentDidUpdate() {
        this._updateReceiverQuality();
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { onClick } = this.props;
        const { height, width } = this.state;
        const rowElements = this._groupIntoRows(this._renderThumbnails(), this._getColumnCount());

        return (
            <DimensionsDetector
                onDimensionsChanged = { this._onDimensionsChanged }>
                <ScrollView
                    style = {{
                        ...styles.tileView,
                        height,
                        width
                    }}>
                    <TouchableWithoutFeedback onPress = { onClick }>
                        <View
                            style = {{
                                ...styles.tileViewRows,
                                minHeight: height,
                                minWidth: width
                            }}>
                            { rowElements }
                        </View>
                    </TouchableWithoutFeedback>
                </ScrollView>
            </DimensionsDetector>
        );
    }

    /**
     * Returns how many columns should be displayed for tile view.
     *
     * @returns {number}
     * @private
     */
    _getColumnCount() {
        const participantCount = this.props._participants.length;
        const { height, width } = this.state;

        // For narrow view, tiles should stack on top of each other for a lonely
        // call and a 1:1 call. Otherwise tiles should be grouped into rows of
        // two.

       // chandra added for more than 8 participants


         if(width > height){

                if(participantCount <MAX_COLUMN_LANDSCAPE * max_fit_rows)
                {
                 expected_row = Math.floor(Math.sqrt(participantCount))
	             expected_col = Math.ceil(participantCount / expected_row)
                }
                 else{
	          expected_col = participantCount/max_fit_rows
	          expected_col = Math.min(expected_col, MAX_COLUMN_LANDSCAPE)
                }
                return   expected_col;

         }


      if (participantCount > 8) {
           if(width > height){
                return Math.ceil(participantCount / 3);
               //   return 7;
           }
            return 3;
        }
       if (isNarrowAspectRatio(this)) {
            return participantCount >= 3 ? 2 : 1;
        }

        if (participantCount === 4) {
            // In wide view, a four person call should display as a 2x2 grid.

             if(width > height){
                return 4;
             }
            return 2;
        }
        if (participantCount === 5 || participantCount === 6) {
            if(width > height){
                return 3;
             }
        }

        return Math.min(4, participantCount);
    }

    /**
     * Returns all participants with the local participant at the end.
     *
     * @private
     * @returns {Participant[]}
     */
    _getSortedParticipants() {
        const participants = [];
        let localParticipant;

        for (const participant of this.props._participants) {
            if (participant.local) {
                localParticipant = participant;
            } else {
                participants.push(participant);
            }


        }

        localParticipant && participants.push(localParticipant);

        return participants;
    }

    /**
     * Calculate the height and width for the tiles.
     *
     * @private
     * @returns {Object}
     * Chandra change the methods to fit the tile view on screen
     */
    _getTileDimensions() {
        const { _participants } = this.props;
        const { height, width } = this.state;
        const columns = this._getColumnCount();
        const participantCount = _participants.length;
        const heightToUse = height - (MARGIN * 2);
        const widthToUse = width - (MARGIN * 2);
        var rows = Math.ceil(participantCount / columns);
        if (width > height) {
              // rows = 2;
        }
        TILE_ASPECT_RATIO = widthToUse / heightToUse
        let tileWidth;
        let tileHeight;

        // If there is going to be at least two rows, ensure that at least two
        // rows display fully on screen.


        if (participantCount / columns > 1) {
           // tileWidth = Math.min(widthToUse / columns, heightToUse / 2);
           tileWidth = widthToUse / columns;
        } else {
            tileWidth = Math.min(widthToUse / columns, heightToUse);
        }


       if (width > height) {

               let obj = {
            	height: heightToUse/Math.min(expected_row , max_fit_rows) ,
            	width: tileWidth,
            	aspect: TILE_ASPECT_RATIO
        	};
	obj.aspect = obj.width/obj.height;
	return obj;
        }

	let obj = {
            	height: Math.max(Math.min(heightToUse / rows, tileWidth / TILE_ASPECT_RATIO), tileWidth),
            	width: tileWidth,
            	aspect: TILE_ASPECT_RATIO
        	};
	obj.aspect = obj.width/obj.height;
	return obj;


    }

    /**
     * Splits a list of thumbnails into React Elements with a maximum of
     * {@link rowLength} thumbnails in each.
     *
     * @param {Array} thumbnails - The list of thumbnails that should be split
     * into separate row groupings.
     * @param {number} rowLength - How many thumbnails should be in each row.
     * @private
     * @returns {ReactElement[]}
     */
    _groupIntoRows(thumbnails, rowLength) {
        const rowElements = [];

        for (let i = 0; i < thumbnails.length; i++) {
            if (i % rowLength === 0) {
                const thumbnailsInRow
                    = thumbnails.slice(i, i + rowLength);

                rowElements.push(
                    <View
                        key = { rowElements.length }
                        style = { styles.tileViewRow }>
                        { thumbnailsInRow }
                    </View>
                );
            }
        }

        return rowElements;
    }

    _onDimensionsChanged: (width: number, height: number) => void;

    /**
     * Updates the known available state for {@link TileView} to occupy.
     *
     * @param {number} width - The component's current width.
     * @param {number} height - The component's current height.
     * @private
     * @returns {void}
     */
    _onDimensionsChanged(width: number, height: number) {
        this.setState({
            height,
            width
        });
    }

    /**
     * Creates React Elements to display each participant in a thumbnail. Each
     * tile will be.
     *
     * @private
     * @returns {ReactElement[]}
     */
    _renderThumbnails() {
	let calDom = this._getTileDimensions();
        const styleOverrides = {
            aspectRatio: calDom.aspect,
            flex: 0,
            height: calDom.height,
            width: null
        };

         const columns = this._getColumnCount();
         const sortparticipants = this._getSortedParticipants();
         const thumnailarray = [];
          for (const participant of sortparticipants) {

           if (participant.local)
           {
              if ((sortparticipants.length % columns) == 1)
                {
                 const { height, width } = this.state;
                 const widthToUse = width - (MARGIN * 2);
                 const heightToUse = height - (MARGIN * 2);
                 const styleOverrideslocal = {
                          aspectRatio: widthToUse / calDom.height,
                          flex: 0,
                          height: calDom.height,
                          width: widthToUse
                   };
                let obj = <Thumbnail
                    disableTint = { true }
                    key = { participant.id }
                    participant = { participant }
                    renderDisplayName = { true }
                    styleOverrides = { styleOverrideslocal }
                    tileView = { true } />
                   thumnailarray.push(obj);


             }else{
                    let obj = <Thumbnail
                    disableTint = { true }
                    key = { participant.id }
                    participant = { participant }
                    renderDisplayName = { true }
                    styleOverrides = { styleOverrides }
                    tileView = { true } />
                    thumnailarray.push(obj);
             }


           }
           else
           {

                    let obj = <Thumbnail
                    disableTint = { true }
                    key = { participant.id }
                    participant = { participant }
                    renderDisplayName = { true }
                    styleOverrides = { styleOverrides }
                    tileView = { true } />
                    thumnailarray.push(obj);


             }



         }
          return  thumnailarray ;

       /** return this._getSortedParticipants().map(participant => (<Thumbnail
        *            disableTint = { true }
        *            key = { participant.id }
        *            participant = { participant }
        *            renderDisplayName = { true }
        *            styleOverrides = { styleOverrides }
        *            tileView = { true } />));
        */
    }

    /**
     * Sets the receiver video quality based on the dimensions of the thumbnails
     * that are displayed.
     *
     * @private
     * @returns {void}
     */
    _updateReceiverQuality() {
        const { height } = this._getTileDimensions();
        const qualityLevel = getNearestReceiverVideoQualityLevel(height);

        this.props.dispatch(setMaxReceiverVideoQuality(qualityLevel));
    }
}

/**
 * Maps (parts of) the redux state to the associated {@code TileView}'s props.
 *
 * @param {Object} state - The redux state.
 * @private
 * @returns {{
 *     _participants: Participant[]
 * }}
 */
function _mapStateToProps(state) {
    return {
        _participants: state['features/base/participants']
    };
}

export default connect(_mapStateToProps)(makeAspectRatioAware(TileView));
