import {
  BULK_WARNING_MODEL,
  CAMPAIGN_IDS,
  RESET_CAMPAIGNS,
  SELECTED_BULK_OPERATION,
  SELECTED_CAMPAIGNS,
} from '../Constants/index';

const intialState = {
  selectedCampaigns: [],
  bulkOperation: undefined,
  bulkWarningModel: false,
  campaignIds: [],
};

const campaignReducer = (state = intialState, action) => {
  switch (action.type) {
    case SELECTED_CAMPAIGNS:
      return {
        ...state,
        selectedCampaigns: action.payload,
      };
    case SELECTED_BULK_OPERATION:
      return {
        ...state,
        bulkOperation: action.payload,
      };

    case BULK_WARNING_MODEL:
      return {
        ...state,
        bulkWarningModel: action.payload,
      };
    case CAMPAIGN_IDS:
      return {
        ...state,
        campaignIds: action.payload,
      };
    case RESET_CAMPAIGNS:
      return {
        ...state,
        selectedCampaigns: intialState.selectedCampaigns,
        campaignIds: intialState.campaignIds,
      };
    default:
      return state;
  }
};

export default campaignReducer;
