import { DAILY_REVIEW_TABS, isNullOrUndefinedStored } from '_helpers/Utils/mediaConsoleUtil';
import {
  ALL_USERS_LIST,
  ASSOCIATED_ALL_ACCOUNTS,
  BUDGET_GROUPS_LIST,
  DAILY_REVIEW_BUDGET_GROUPS,
  DROP_DOWN_LIST,
  EDIT_GROUP_DATA,
  RESET_MEDIA_CONSOLE,
  SELECTED_DAILY_REVIEW_MENU,
  BG_DETAILS_GROUP,
} from '../Constants/index';

const intialState = {
  associatedAllAccounts: undefined,
  selectedDailyReviewMenu: {
    pageId: isNullOrUndefinedStored('sisense-filter-data') ? DAILY_REVIEW_TABS.BUDGET_REC.id : DAILY_REVIEW_TABS.DAILY_REV_DASH.id,
    groupList: [],
  },
  dailyReviewBudgetGroups: undefined,
  dropdownList: undefined,
  budgetGroupsList: [],
  editGroupData: undefined,
  allUsersList: [],
  bgDetailsGroup: undefined,
};

const mediaConsoleReducer = (state = intialState, action) => {
  switch (action.type) {
    case ASSOCIATED_ALL_ACCOUNTS:
      return {
        ...state,
        associatedAllAccounts: action.payload,
      };

    case SELECTED_DAILY_REVIEW_MENU:
      return {
        ...state,
        selectedDailyReviewMenu: action.payload,
      };
    case DAILY_REVIEW_BUDGET_GROUPS:
      return {
        ...state,
        dailyReviewBudgetGroups: action.payload,
      };
    case DROP_DOWN_LIST:
      return {
        ...state,
        dropdownList: action.payload,
      };
    case BUDGET_GROUPS_LIST:
      return {
        ...state,
        budgetGroupsList: action.payload,
      };
    case EDIT_GROUP_DATA:
      return {
        ...state,
        editGroupData: action.payload,
      };
    case RESET_MEDIA_CONSOLE:
      return {
        ...intialState,
      };
    case ALL_USERS_LIST:
      return {
        ...state,
        allUsersList: action.payload,
      };
    case BG_DETAILS_GROUP:
      return {
        ...state,
        bgDetailsGroup: action.payload,
      };
    default:
      return state;
  }
};

export default mediaConsoleReducer;
