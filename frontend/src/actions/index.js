import {fetchDevices, fetchCategores, fetchApps, fetchReviews, fetchAlexaDevices, fetchGoogleDevices} from '../api';

//load devices
export const loadDevices = devices => ({
    type: 'LOAD_DEVICES',
    devices
})

export const getDevices = () => dispatch => {
    return fetchDevices().then(res => {
      dispatch(loadDevices(res.data.results));
    });
}

//load alexa devices
export const loadAlexaDevices = devices => ({
  type: 'LOAD_ALEXA_DEVICES',
  devices
})

export const getAlexaDevices = offset => dispatch => {
  return fetchAlexaDevices(offset).then(res => {
    dispatch(loadAlexaDevices(res.data));
  });
}

//load google devices
export const loadGoogleDevices = devices => ({
  type: 'LOAD_GOOGLE_DEVICES',
  devices
})

export const getGoogleDevices = offset => dispatch => {
  return fetchGoogleDevices(offset).then(res => {
    dispatch(loadGoogleDevices(res.data));
  });
}

//load categories
export const loadCategories = categories => ({
    type: 'LOAD_CATEGORIES',
    categories
})

export const getCategories = () => dispatch => {

    return fetchCategores().then(res => {
        dispatch(loadCategories(res.data.results));
    });
}

export const doUpdateCategory = updatedCategory => ({
    type: 'UPDATE_CATEGORY',
    updatedCategory
})

export const doUpdateDevice = updatedDevice => ({
  type: 'UPDATE_DEVICE',
  updatedDevice
})

//load apps
export const loadApps = voiceApps => ({
    type: 'LOAD_APPS',
    voiceApps
})

export const getApps = (limit, offset, device, category, searchText, isFiltering) => dispatch => {
    if (isFiltering) {
      offset = 0;
    }
    return fetchApps(limit, offset, device, category, searchText).then(res => {
        dispatch(loadApps(res.data));
    });
}

//set voice apps index
export const setVoiceAppIndex = index => ({
  type: 'SET_APP_INDEX',
  index
})

//load reviews
export const loadReviews = reviews => ({
    type: 'LOAD_REVIEWS',
    reviews
})

export const getReviews = () => dispatch => {
    return fetchReviews().then(res => {
        dispatch(loadReviews(res.data.results));
    });
}

//get app from app_id
export const getAppWithAppId = app_id => ({
    type: 'GET_APP_WITH_APPID',
    app_id
})
// //load alexa skills
// export const loadAlexaSkills = alexaSkills => ({
//     type: 'LOAD_ALEXA_SKILLS',
//     alexaSkills
// })

// export const getAlexaSkills = () => dispatch => {
//     return fetchAlexaSkills().then(res => dispatch(loadAlexaSkills(res.data.results)));
// }
