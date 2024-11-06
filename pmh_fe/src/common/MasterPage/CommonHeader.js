import { useAuth } from '../../_helpers/Auth/authContext';
import { useUserInfo } from '../../_helpers/userInfoContext';
import { useTranslation } from 'react-i18next';
import { PUBLICURL } from '_helpers/Utils/dashboardUtil';
import NavBarMenu from 'views/UI/NavBarMenu';
import './Header/Header.scss';
import { useLocation } from 'react-router-dom';
import NotificationComponent from 'views/Common/Notifications/NotificationComponent';
import 'views/Common/Notifications/Notifications.scss';
import React, { useEffect, useState } from 'react';
import { getConnection } from '_services/notifications';
import * as signalR from '@microsoft/signalr';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import {
  SET_ALL_USER_NOTIFIFCATIONS,
  SET_SELECTED_NOTIFICATION,
  SET_NO_CTA_NOTIFICATIONS,
} from 'common/Redux/Constants';
import {
  calculateBadgeWidth,
  calculateBellMargin,
} from '../../views/Common/Notifications/Utils';

const CommonHeader = ({ onHeaderClick, hideLinks }) => {
  const auth = useAuth();
  const { userInfo } = useUserInfo() || {};
  const { t } = useTranslation(['common']);
  const location = useLocation();
  const [openNotifications, setOpenNotifications] = useState(false);
  const [connection, setConnection] = useState(null);
  const dispatch = useDispatch();
  const { userNotifications, selectedNotification } = useSelector(
    (store) => store.getAllUserNotifications
  );
  const unreadNotificationsCount =
    userNotifications
      ?.map((notif) => (notif?.isRead === false ? notif : null))
      ?.filter((n) => n !== null).length || 0;

  const pages = [
    { name: 'User Management', url: '/user-management' },
    { name: 'User Settings', url: '/user-settings' },
  ];

  async function doLogout() {
    auth.logOut();
  }

  const handleNotificationClose = () => {
    setOpenNotifications(false);
  };

  const badgeStyle = {
    width: calculateBadgeWidth(unreadNotificationsCount),
  };

  const bellStyle = {
    cursor: 'pointer',
    marginRight: calculateBellMargin(unreadNotificationsCount),
  };

  const getCountText = () => {
    if (unreadNotificationsCount > 99) return '99+';
    else return unreadNotificationsCount;
  };

  useEffect(() => {
    if (userNotifications && userNotifications.length > 0) {
      if (selectedNotification === null) {
        dispatch({
          type: SET_SELECTED_NOTIFICATION,
          payload: userNotifications[0],
        });
      }
    }
  }, [userNotifications]);

  useEffect(() => {
    const initializeConnection = async () => {
      try {
        const conn = await getConnection();
        setConnection(conn);
      } catch (error) {
        console.error('Error initializing connection:', error);
      }
    };

    initializeConnection();
  }, []);

  useEffect(() => {
    if (
      connection !== null &&
      connection.state === signalR.HubConnectionState.Disconnected
    ) {
      try {
        connection
          .start()
          .then(() => {
            const fetchNotifications = () => {
              if (connection.state === signalR.HubConnectionState.Connected) {
                connection
                  .invoke('GetAllUserNotifications')
                  .then((resp) => {
                    if (resp !== undefined && resp.statusCode === 200) {
                      resp.json.forEach((notification) => {
                        notification.timestamp = moment(
                          notification.createdDate
                        ).format('MMM DD, YYYY • hh:mm A');
                      });
                      dispatch({
                        type: SET_ALL_USER_NOTIFIFCATIONS,
                        payload: resp.json,
                      });
                      dispatch({
                        type: SET_NO_CTA_NOTIFICATIONS,
                      });
                    }
                  })
                  .catch((err) =>
                    console.error('Error fetching notifications:', err)
                  );
              } else {
                console.log('Connection is not connected');
              }
            };

            // Fetch initial notifications
            fetchNotifications();
            // Poll for new notifications
            const intervalId = setInterval(() => {
              fetchNotifications(); // Fetch notifications every minute
            }, 60000);

            return () => {
              clearInterval(intervalId);
              connection.stop();
            };
          })
          .catch((err) => {
            console.error('Error starting connection:', err);
          });
      } catch (err) {
        console.error('SignalR Connection Error: ', err);
      }
    }
  }, [connection]);

  return (
    <div className='header-container d-flex justify-content-between align-items-center'>
      <div
        className='d-flex align-items-center'
        style={hideLinks ? { cursor: 'auto' } : { cursor: 'pointer' }}
        onClick={() => (hideLinks ? {} : onHeaderClick())}
      >
        <img
          src={`${window.location.origin}${PUBLICURL}/assets/images/synops-logo.png`}
          className='header-logo'
          alt='SynOps Logo'
        />
        <span className='mt-0 header-title groove_title'>
          {t('master_page.header.title')}
        </span>
        {location?.pathname.includes('new-edit-campaign') ? (
          <>
            <div className='banner-separator'></div>
            <span className='mt-0 header-title groove_title'>Amadeus</span>
          </>
        ) : null}
      </div>
      {hideLinks ? null : (
        <div className='d-flex'>
          <>
            <div className='notifications-header' style={{ marginTop: '1px' }}>
              <img
                src={`${window.location.origin}${PUBLICURL}/assets/icons/notifications-bell-light.svg`}
                alt='Notifications'
                onClick={() => {
                  setOpenNotifications(!openNotifications);
                }}
                style={bellStyle}
              />
              {userNotifications?.length > 0 && (
                <span className='notifications-badge' style={badgeStyle}>
                  {getCountText()}
                </span>
              )}
              <span className='notifications-title'>Notifications</span>
            </div>
            <div className='banner-separator'></div>
          </>

          {openNotifications && (
            <NotificationComponent
              onClose={handleNotificationClose}
              headerTitle={'Notifications'}
              showCloseIcon={true}
              connection={connection}
            />
          )}
          <div className='navbar-text-mp text-white nav-bar-menu'>
            <NavBarMenu
              name={userInfo?.name}
              onLogoutHandler={doLogout}
              mediaIcon={false}
              pages={pages}
              showName={true}
              isMediaConsole={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CommonHeader;
