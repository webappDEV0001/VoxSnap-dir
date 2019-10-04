const initialState = {
    categories: [],
    updatedCategory: null,
  };

const categories = (state = initialState, action) => {
    switch (action.type) {
        case 'LOAD_CATEGORIES': {
            return {
                ...state,
                categories: action.categories,
            };
        }
        case 'UPDATE_CATEGORY': {
            return {
                ...state,
                updatedCategory: action.updatedCategory,
            };
        }
        default:
            return state
    }
}

export default categories