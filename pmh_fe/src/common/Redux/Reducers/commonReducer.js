import { SHOW_NOTIFICATION ,SHOW_RESPONSE } from '../Constants/index';

const intialState = {
  showNotification: undefined,
  showResponse: undefined,
};
const commonReducer = (state = intialState, action) => {
  switch (action.type) {
    case SHOW_NOTIFICATION:
      return {
        ...state,
        showNotification: action.payload,
      };

      case SHOW_RESPONSE:
      return {
        ...state,
        showResponse: action.payload,
      };

    default:
      return state;
  }
};

export default commonReducer;
