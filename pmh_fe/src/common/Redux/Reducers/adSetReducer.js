import { AD_SET_CACHE, SELECTED_ADSETS } from '../Constants/index';

const intialState = {
  adSetCache: false,
};

const adSetReducer = (state = intialState, action) => {
  switch (action.type) {
    case AD_SET_CACHE:
      return {
        ...state,
        adSetCache: action.payload,
      };
    
    case SELECTED_ADSETS:
      return {
        ...state,
        selectedAdSets: action.payload,
      }

    default:
      return state;
  }
};

export default adSetReducer;
