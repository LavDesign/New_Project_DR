import { combineReducers } from 'redux';
import commonReducer from './commonReducer';
import dashboardReducer from './dashboardReducer';
import campaignReducer from './campaignReducer';
import adSetReducer from './adSetReducer';
import mediaConsoleReducer from './mediaConsoleReducer';
import userNotificationsReducer from './userNotificationsReducer';

const rootReducer = combineReducers({
  getCommonData: commonReducer,
  getDashboardData: dashboardReducer,
  getCampaignData: campaignReducer,
  getAdSetData: adSetReducer,
  getMediaConsole: mediaConsoleReducer,
  getAllUserNotifications: userNotificationsReducer,
});

export default rootReducer;
