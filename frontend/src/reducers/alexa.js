const initialState = {
    alexaSkills: [],
};

const alexa = (state = initialState, action) => {
    switch (action.type) {        
        case 'LOAD_ALEXA_SKILLS': {
            return {
                ...state,
                alexaSkills: action.alexaSkills
            }
        }
        default:
            return state
    }
}

export default alexa