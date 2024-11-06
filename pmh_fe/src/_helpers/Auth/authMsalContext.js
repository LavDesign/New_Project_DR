import React from "react";
import PropTypes from 'prop-types';
// Context and Instance
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./authConfig";
// Wrapper (interaction starter)
import { MsalWrapper } from "./authWrapper";

/* Exposes msal instance object */
export const msalInstance = new PublicClientApplication(msalConfig);

/* Exposes msal context and instance msal wrapper */
export const MsalContext = ({ setData, children }) => {
    return (
      <MsalProvider instance={msalInstance}>
        <MsalWrapper setData={setData}>
           {children}
        </MsalWrapper>
      </MsalProvider>
    );
};

MsalContext.propTypes = {
  setData: PropTypes.func.isRequired,
  children: PropTypes.any.isRequired,
};