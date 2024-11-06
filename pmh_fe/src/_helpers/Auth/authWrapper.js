import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
// Interaction starter
import { useMsal, useIsAuthenticated, useMsalAuthentication, AuthenticatedTemplate, /* UnauthenticatedTemplate */ } from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";
import { loginRequest } from "./authConfig";
import { cleanOnLogout } from '../../_services/userInfoService';


/* Msal component wrapper, verifies or request azure login */
export const MsalWrapper = props => {
    const { setData, children } = props;
    const { login, /* result, */ error } = useMsalAuthentication(InteractionType.Redirect, loginRequest);
    const { instance, accounts } = useMsal();
    const isAuthenticated = useIsAuthenticated();
    const [authReady, setAuthReady] = useState(null);

    useEffect(() => {
      if (accounts.length > 0 && instance.getActiveAccount() === null) {
          instance.setActiveAccount(accounts[0]);
      }
    }, [accounts]);

    useEffect(() => {
        setData({
          logOut: logOutFn
        });

        if (isAuthenticated) {
            setUser();
        }
    }, [isAuthenticated]);

    function setUser() {
      const currentAccount = instance.getActiveAccount();
      setData({
          username: currentAccount.username,
          userdata: currentAccount
      });
      currentAccount.username && setAuthReady(true);
    }

    const logOutFn = async () => {
        await cleanOnLogout();
        localStorage.clear();
        sessionStorage.clear();
        instance.logoutRedirect();
    }

    return (<>
      { authReady &&
        <AuthenticatedTemplate>
           {children}
        </AuthenticatedTemplate>
      }
    </>);
};

MsalWrapper.propTypes = {
  setData: PropTypes.func.isRequired,
  children: PropTypes.any.isRequired,
};
