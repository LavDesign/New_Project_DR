import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);

/*
  Mock authMSalContext methods
*/

vi.mock("_helpers/Auth/authMsalContext", () => ({
    msalInstance: {
        getActiveAccount: () => ({}),
        acquireTokenSilent: () => Promise.resolve({ accessToken: "" }),
    },
}));

/*
  Below code is added to handled the useTranslation error while running test
*/
vi.mock("react-i18next", () => ({
    useTranslation: () => {
        return {
            t: (str) => str,
            i18n: {
                changeLanguage: () => new Promise(() => {}),
            },
        };
    },
}));

afterEach(() => {
    cleanup();

    // vi.spyOn(console, "log").mockImplementation(() => {});
    // vi.spyOn(console, "error").mockImplementation(() => {});
    // vi.spyOn(console, "warn").mockImplementation(() => {});
    // vi.spyOn(console, "info").mockImplementation(() => {});
    // vi.spyOn(console, "debug").mockImplementation(() => {});
});
