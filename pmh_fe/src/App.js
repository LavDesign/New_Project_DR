import React, { useState, useEffect, Suspense } from "react";
import { reactPlugin } from "_helpers/AppInsights";
import { AppInsightsContext } from "@microsoft/applicationinsights-react-js";
import { trace } from "common/DevUtils";
import Routes from "routes/Routes";
import { UserInfoProvider } from "_helpers/userInfoContext";
import { StoreProvider } from "_helpers/storeContext";
import { useAuth } from "_helpers/Auth/authContext";
import "_helpers/i18n";
import HeadHelmet from "./HeadHelmet";
import Spinner from "common/Spinner";
import { generateStateId } from "_helpers/stateContext";
import { AuthCSRFProvider } from "_helpers/Auth/authCSRFContext";
// Bootstrap Bundle JS
import "~bootstrap/dist/js/bootstrap.bundle.min";

window.debug = import.meta.env.VITE_DEBUG_MODE === "TRUE" ? true : false;
/**
 * DevUtils - console.log utility, window.debug variable dependant, implemented on app.js as window.log
 * @alias window.log
 */
window.log = trace;

// Tells screen readers the links opens in new tab
const blankAnchors = document.querySelectorAll('[target="_blank"]');
if (blankAnchors) {
    blankAnchors.forEach((anchor) => {
        const text = anchor.textContent;
        if (text !== "") {
            anchor.setAttribute(
                "aria-label",
                `${text.replace(".", "")} opens in new tab`
            );
        }
    });
}

const App = () => {
    let timerId;
    const auth = useAuth();

    useEffect(() => {
        generateStateId();
    });

    const logout = () => {
        auth.logOut();
    };

    const resetTimer = () => {
        clearTimeout(timerId);
        timerId = setTimeout(logout, 20 * 60 * 1000);
    };

    useEffect(() => {
        window.onload = resetTimer;
        document.onmousemove = resetTimer;
        document.onkeydown = resetTimer;

        return () => {
            clearTimeout(timerId);
        };
    }, []);

    return (
        //Needed to add Suspense react component in order to avoid failing using loaders in Routes
        <Suspense fallback={<Spinner />}>
            <AppInsightsContext.Provider value={reactPlugin}>
                <StoreProvider>
                    <UserInfoProvider>
                        <AuthCSRFProvider>
                            <HeadHelmet />
                            <Routes />
                        </AuthCSRFProvider>
                    </UserInfoProvider>
                </StoreProvider>
            </AppInsightsContext.Provider>
        </Suspense>
    );
};

export default App;
export const publicUrl = import.meta.env.VITE_PUBLIC_URL;
