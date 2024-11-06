import { SET_ALL_USER_NOTIFIFCATIONS, SET_SELECTED_NOTIFICATION, SET_NO_CTA_NOTIFICATIONS } from '../Constants/index';

const intialState = {
    userNotifications: null,
    selectedNotification: null,
    noCTANotifications: null,
};

const userNotificationsReducer = (state = intialState, action) => {
    switch (action.type) {
        case SET_ALL_USER_NOTIFIFCATIONS:
            return {
                ...state,
                userNotifications: action.payload,
            };
        case SET_SELECTED_NOTIFICATION:
            return {
                ...state,
                selectedNotification: action.payload,
            };
        case SET_NO_CTA_NOTIFICATIONS:
            return {
                ...state,
                noCTANotifications: state.userNotifications.map((notif) => {
                    if (!notif.callToAction)
                        return notif;
                    else
                        return null;
                }).filter(notification => notification !== null),
            }
        default:
            return state;
    }
}

export default userNotificationsReducer;