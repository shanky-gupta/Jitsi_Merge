
import {
    ACTION_SHORTCUT_TRIGGERED,
    AUDIO_MUTE,
    createShortcutEvent,
    createToolbarEvent,
    sendAnalytics
} ../analytics';



const { AudioMode } = NativeModules;

class tile extends Component {

    _onClick;
    _setTile;
    

    constructor(props){
        super(props);
        this._setTile = this._setTile.bind(this);
    }

    _setTile(){
      
        dispatch(setTileView(true));
    }

}


function _mapStateToProps(state): Object {
   

    return {
        _tileViewEnabled: true
    };
}

export default translate(connect(_mapStateToProps)(tile));