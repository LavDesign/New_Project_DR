import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { MsalContext, msalInstance } from './authMsalContext';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

/**
 * Exposes context for Auth base. Also implements lib specifics from subfolder
 */
export const AuthProvider = ({ children }) => {
  // auth base object used as auth interface
  const [authObj, _setAuthObj] = useState({
    instance: msalInstance, // auth lib instance
    username: null, // plain username
    userdata: null, // user data object
    logIn: null, // log in (and validate) function
    logOut: null, // log out function
    signIn: null, // sign in function
  });

  const setAuthObj = (obj) =>
    _setAuthObj((prevVal) => ({ ...prevVal, ...obj }));

  return (
    <AuthContext.Provider value={authObj}>
      <MsalContext setData={setAuthObj}>{children}</MsalContext>
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.any.isRequired,
};
