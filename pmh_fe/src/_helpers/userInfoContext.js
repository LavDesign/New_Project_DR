import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { history } from './history';
import PropTypes from 'prop-types';
import { useAuth } from './Auth/authContext';
import { updateUserSignin } from '../_services/userInfoService';
import { useStore } from './storeContext';
import Spinner from 'common/Spinner';
import { getUserByEmail } from '_services/userManagement';
import { getDashData } from './Utils/dashboardUtil';
import { ASSOCIATED_ALL_ACCOUNTS, SET_DASH_TAB } from 'common/Redux/Constants';
import { fetchAvailableDashboards } from '_services/campaignDash';
export const UserInfoContext = createContext(null);
export const useUserInfo = () => useContext(UserInfoContext);

/**
 * Exposes context for userInfo
 */

export const UserInfoProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const { username } = useAuth();
  const { store, setStore } = useStore();
  const dispatch = useDispatch();

  useEffect(() => {
    const parseUser = async () => {
      let currentUser = store.currentUser;
      if (!currentUser) {
        const response = await getUserByEmail({email: username}, true);
        if (response && response.statusCode === 200 && response.json?.isActive)
          currentUser = response.json;
      }
      if (currentUser) {
        currentUser.defaultTab = currentUser.defaultTab?.toLowerCase();
        setUserInfo(currentUser);
        fetchAvailableDashboards({ selectedDash: currentUser.id }).then(
          (data) => {
            dispatch({
              type: ASSOCIATED_ALL_ACCOUNTS,
              payload: data,
            });
          }
        );
        setStore({ currentUser: currentUser });
        updateUserSignin();
      } else {
        if (window.location.pathname !== `${import.meta.env.VITE_PUBLIC_URL}/session-logout`) {
         // Avoid redirection on localhost if hostname is 'localhost'
          if (window.location.hostname !== 'localhost') {
            history.push(
              `${
                import.meta.env.VITE_PUBLIC_URL === '/' ? '' : import.meta.env.VITE_PUBLIC_URL
              }/access-request-form`
            );
          }
        }
      }      
      
      setIsLoading(false);
      setIsDataLoaded(true);
    };

    if (username) {
      parseUser();
    }

  }, [username]);

  useEffect(() => {
    if (userInfo?.defaultTab) {
      dispatch({
        type: SET_DASH_TAB,
        payload: getDashData(userInfo.defaultTab),
      });
    }
  }, [userInfo]);

  if (isLoading) {
    return <Spinner />;
  }

  if (!isDataLoaded) {
    return null;
  }

  const userInfoObject = {
    userInfo,
    setUserInfo,
  };

  return (
    <UserInfoContext.Provider value={userInfoObject}>
      {children}
    </UserInfoContext.Provider>
  );
};

UserInfoProvider.propTypes = {
  children: PropTypes.any.isRequired,
};
