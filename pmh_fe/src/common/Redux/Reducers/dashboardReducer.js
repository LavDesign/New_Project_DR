import {
  SAVE_SELECTED_VIEW,
  SET_DASH_TAB,
  SELECTED_DASH_API,
  UPDATE_COLUMNS,
  CLEAR_CACHE_QUERY,
} from '../Constants/index';

const intialState = {
  dashTab: undefined,
  selectedSavedView: undefined,
  updatedSelectedTabColumns: undefined,
  oldSelectedTabColumns: undefined,
  selectedDashApi: undefined,
  clearUseQueryCache: false,
};
const dashboardReducer = (state = intialState, action) => {
  switch (action.type) {
    case SET_DASH_TAB:
      return {
        ...state,
        dashTab: action.payload,
      };
    case SAVE_SELECTED_VIEW:
      return {
        ...state,
        selectedSavedView: action.payload,
      };

    case UPDATE_COLUMNS:
      return {
        ...state,
        ...action.payload,
      };
    case SELECTED_DASH_API:
      return {
        ...state,
        selectedDashApi: action.payload,
      };
    case CLEAR_CACHE_QUERY:
      return {
        ...state,
        clearUseQueryCache: action.payload,
      };
    default:
      return state;
  }
};

export default dashboardReducer;
