import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useStore } from '../storeContext';
import axios from 'axios';

export const AuthCSRFContext = createContext(null);
export const useAuthCSRFInfo = () => useContext(AuthCSRFContext);

export const AuthCSRFProvider = ({ children }) => {
  const [xToken, setToken] = useState('');
  const { store, setStore } = useStore();

  useEffect(() => {
    const fetchCSRFToken = async () => {
        let currentToken = store.xToken;

        currentToken = (!currentToken) ? localStorage.getItem('csrfToken') : currentToken;
        currentToken = (!currentToken || currentToken == 'undefined') ? null : currentToken;

        if(!currentToken) {
            const response = await getToken();
            currentToken = (!response || response == 'undefined') ? null : response;
        }

        if (currentToken) {
            localStorage.setItem('csrfToken', currentToken);
            setToken(currentToken);
            setStore({ xToken: currentToken });
        }
    };
    fetchCSRFToken();
  }, [store.xToken]);

  return (
    <AuthCSRFContext.Provider value={xToken}>
        {children}
    </AuthCSRFContext.Provider>
  );
};

export const getToken = async () => {
    return await axios.get(`${baseURL}/antiForgery_token`, {
        method: 'GET',
        withCredentials: true
    })
      .then(response => response.data)
      .catch(error => console.log(error));
};


export const baseURL = import.meta.env.VITE_API;
export const publicUrl = import.meta.env.PUBLIC_URL;

AuthCSRFProvider.propTypes = {
  children: PropTypes.any.isRequired
};
