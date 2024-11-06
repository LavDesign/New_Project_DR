import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { ReactPlugin } from "@microsoft/applicationinsights-react-js";
import { createBrowserHistory } from "history";

const browserHistory = createBrowserHistory({ basename: "" });
const reactPlugin = new ReactPlugin();
const appInsights = new ApplicationInsights({
    config: {
        connectionString: `${import.meta.env.VITE_INSIGHTS_CONNECTION_STRING}`,
        enableAutoRouteTracking: true,
        isCookieUseDisabled: true,
        extensions: [reactPlugin],
        extensionConfig: {
            [reactPlugin.identifier]: { history: browserHistory },
        }
    },
});
appInsights.loadAppInsights();
appInsights.trackPageView();
export { reactPlugin, appInsights };
