import { combineReducers } from "redux";
import devices from './devices';
import categories from './categories';
import alexa from './alexa';
import voiceApps from './voiceApps';

export default combineReducers({
    devices,
    categories,
    alexa,
    voiceApps,
});
