/* Msal config setting objects */

import { LogLevel } from "@azure/msal-browser";

const ua = window.navigator.userAgent;
const msie = ua.indexOf("MSIE ");
const msie11 = ua.indexOf("Trident/");
const msedge = ua.indexOf("Edge/");
const firefox = ua.indexOf("Firefox");
const isIE = msie > 0 || msie11 > 0;
const isEdge = msedge > 0;
const isFirefox = firefox > 0; // Only needed if you need to support the redirect flow in Firefox incognito

export const msalConfig = {
    auth: {
        clientId: `${import.meta.env.VITE_AUTH_MSAL_CLIENT}`,
        authority: `${import.meta.env.VITE_AUTH_MSAL_API}`,
        redirectUri: `${import.meta.env.VITE_AUTH_MSAL_REDIRECT_URI}`,
        postLogoutRedirectUri: `${import.meta.env.VITE_AUTH_MSAL_REDIRECT_URI}`,
        navigateToLoginRequestUrl: true
    },
    cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: isIE || isEdge || isFirefox
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                    default:
                        return;
                }
            },
        },
    },
};

// Add scopes here for ID token to be used at Microsoft identity platform endpoints.
export const loginRequest = {
    scopes: [`${import.meta.env.VITE_AUTH_MSAL_SCOPE}`]
}
