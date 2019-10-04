
const initialState = {
    apps: [],
    reviews: [],
    selectedVoiceAppIndex: 0,
    paginationSize: 10,
}

const voiceApps = (state = initialState, action) => {
    switch (action.type) {
        case 'LOAD_APPS': {
            return {
                ...state,
                apps: action.voiceApps
            }
        }
        case 'LOAD_REVIEWS': {
            return {
                ...state,
                reviews: action.reviews
            }
        }
        case 'SET_APP_INDEX': {
            return {
                ...state,
                selectedVoiceAppIndex: action.index
            }
        }
        default:
            return state
    }
}

export default voiceApps
