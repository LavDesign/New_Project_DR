import axios from 'axios';
import { loginRequest } from '_helpers/Auth/authConfig';
import { msalInstance } from '_helpers/Auth/authMsalContext';
import { getStateId } from '_helpers/stateContext';
import { getToken } from '_helpers/Auth/authCSRFContext';
import { isValidUrl } from './Utils/utils';

//Needed to send headers and cookies
axios.defaults.withCredentials = true;

axios.interceptors.request.use(
  async (config) => {
    config.headers['Accept'] = 'application/json';
    config.headers['Content-Type'] = 'application/json; charset=utf-8';
    config.headers['Cache-Control'] = 'no-cache, no-store';
    config.headers['state'] = getStateId();

    // Do not set Content-Type if FormData is submitted
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    const activeAccount = msalInstance.getActiveAccount();
    const resToken = await msalInstance
      .acquireTokenSilent({ ...loginRequest, account: activeAccount })
      .then((response) => {
        return response.accessToken;
      })
      .catch((_error) => {
        // Fallback to interaction when silent call fails
        return msalInstance.acquireTokenRedirect(loginRequest);
      });

    if (resToken) {
      config.headers.Authorization = `Bearer ${resToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 409) {
      const baseURL =
        window.location.hostname === 'localhost'
          ? '/session-logout'
          : `${import.meta.env.VITE_PUBLIC_URL}/session-logout`;

      if (isValidUrl(baseURL)) {
        if (window.location.pathname !== `${baseURL}`) {
          window.location.href = `${baseURL}`;
        }
      } else {
        console.error('Invalid URL:', baseURL);
        return null;
      }
    }
    return Promise.reject(error);
  }
);

function validateToken(token) {
  try {
    const validCharacters = /^[a-zA-Z0-9-_]+$/;

    const validSize = 198; // Change this to your requirement

    if (typeof token !== 'string') {
      throw new Error('Token must be a string');
    }

    if (token.length !== validSize) {
      throw new Error(`Token must be ${validSize} characters long`);
    }

    if (!validCharacters.test(token)) {
      throw new Error('Token contains invalid characters');
    }

    // If all checks pass, return the token
    return token;
  } catch (error) {
    console.error('validation error' + error);
  }
  return '';
}

const retrieveAndValidateCsrfToken = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const tokenResponse = await getToken();
      const csrfToken = validateToken(tokenResponse);
      resolve(csrfToken || '');
    } catch (error) {
      reject(error);
    }
  });
};

const getTokenPromise = async () => {
  if (!tokenPromise) {
    // If there is no pending promise, create a new one
    tokenPromise = retrieveAndValidateCsrfToken();
  }
  return tokenPromise;
};

let tokenPromise = null;
export const request = async (query) => {
  const customHeaders = {};

  if (tokenPromise) {
    await tokenPromise;
  }

  let csrfToken = localStorage.getItem('csrfToken');

  if (!csrfToken || csrfToken == 'undefined') {
    csrfToken = await getTokenPromise();
    if (csrfToken && validateToken(csrfToken).length > 0) {
      csrfToken = validateToken(csrfToken);
      localStorage.setItem('csrfToken', csrfToken);
    }
  }

  customHeaders['X-XSRF-TOKEN-H'] = csrfToken;

  const maxRetries = 3;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const response = await axios({
        method: query.method ? query.method : 'get',
        url: query.url,
        params: query.query,
        data: query.body,
        headers: customHeaders,
        responseType: query.responseType || 'json',
        signal: query.signal,
        withCredentials: true,
        credentials: 'include',
      });

      tokenPromise = null;
      return response.data;
    } catch (error) {
      retries += 1;

      if (error.response && error.response.status === 400) {
        const account = msalInstance.getActiveAccount();

        if (account) {
          const silentRequest = {
            scopes: loginRequest.scopes,
            account: account,
          };

          try {
            const silentResult = await msalInstance.acquireTokenSilent(
              silentRequest
            );
          } catch (silentError) {
            console.error('Silent token acquisition fails: ', silentError);
          }
        }

        if (retries === 1) {
          try {
            // Try to get a new CSRF token
            csrfToken = await getTokenPromise();
            if (csrfToken && validateToken(csrfToken).length > 0) {
              csrfToken = validateToken(csrfToken);
              localStorage.setItem('csrfToken', csrfToken);
              customHeaders['X-XSRF-TOKEN-H'] = csrfToken;
            }
          } catch (silentError) {
            console.error('XSRF token acquisition fails: ', silentError);
          }
        }
      }

      // If it's not a 400 error or silent token acquisition fails, just return the original error
      if (retries >= maxRetries) {
        throw error;
      }
    }
  }
};

export const baseURL = import.meta.env.VITE_API;
export const publicUrl = import.meta.env.VITE_PUBLIC_URL;
