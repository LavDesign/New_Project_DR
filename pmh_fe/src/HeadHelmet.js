import { Helmet } from "react-helmet";
import { useEffect } from "react";
import { useStore } from "_helpers/storeContext";
import { identifyUser } from "_helpers/Utils/segmentAnalyticsUtil";

const HeadHelmet = () => {
    const { store } = useStore();
    const currentUser = store?.currentUser;
    const userAbilitiesList  = currentUser?.userAbilitiesList

    function isSegmentBlocked() {
        return userAbilitiesList && userAbilitiesList.find(ability => ability.abilityName === 'Hide User from tracking');
    }

    function callSegment() {
        import.meta.env.VITE_ENVIRONMENT
        if (import.meta.env.VITE_ENVIRONMENT.toLowerCase() == 'development'
            || import.meta.env.VITE_ENVIRONMENT.toLowerCase() == 'dev'
            || import.meta.env.VITE_ENVIRONMENT.toLowerCase() == 'qa'
            || import.meta.env.VITE_ENVIRONMENT.toLowerCase() == 'stg'
            || import.meta.env.VITE_ENVIRONMENT.toLowerCase() == 'stage'
        ) {
            !function () { var analytics = window.analytics = window.analytics || []; if (!analytics.initialize) if (analytics.invoked) window.console && console.error && console.error("Segment snippet included twice."); else { analytics.invoked = !0; analytics.methods = ["trackSubmit", "trackClick", "trackLink", "trackForm", "pageview", "identify", "reset", "group", "track", "ready", "alias", "debug", "page", "once", "off", "on", "addSourceMiddleware", "addIntegrationMiddleware", "setAnonymousId", "addDestinationMiddleware"]; analytics.factory = function (e) { return function () { var t = Array.prototype.slice.call(arguments); t.unshift(e); analytics.push(t); return analytics } }; for (var e = 0; e < analytics.methods.length; e++) { var key = analytics.methods[e]; analytics[key] = analytics.factory(key) } analytics.load = function (key, e) { var t = document.createElement("script"); t.type = "text/javascript"; t.async = !0; t.src = "https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js"; var n = document.getElementsByTagName("script")[0]; n.parentNode.insertBefore(t, n); analytics._loadOptions = e }; analytics._writeKey = "xoaWXbQBToYCQWbBYjjpfjZkzWDb8ZDC";; analytics.SNIPPET_VERSION = "4.15.3"; analytics.load("xoaWXbQBToYCQWbBYjjpfjZkzWDb8ZDC"); } }();
        } else {
            !function () { var analytics = window.analytics = window.analytics || []; if (!analytics.initialize) if (analytics.invoked) window.console && console.error && console.error("Segment snippet included twice."); else { analytics.invoked = !0; analytics.methods = ["trackSubmit", "trackClick", "trackLink", "trackForm", "pageview", "identify", "reset", "group", "track", "ready", "alias", "debug", "page", "once", "off", "on", "addSourceMiddleware", "addIntegrationMiddleware", "setAnonymousId", "addDestinationMiddleware"]; analytics.factory = function (e) { return function () { var t = Array.prototype.slice.call(arguments); t.unshift(e); analytics.push(t); return analytics } }; for (var e = 0; e < analytics.methods.length; e++) { var key = analytics.methods[e]; analytics[key] = analytics.factory(key) } analytics.load = function (key, e) { var t = document.createElement("script"); t.type = "text/javascript"; t.async = !0; t.src = "https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js"; var n = document.getElementsByTagName("script")[0]; n.parentNode.insertBefore(t, n); analytics._loadOptions = e }; analytics._writeKey = "XcKrCxUaF6GsN1E0nQ1fc0JXdGdCtvG1";; analytics.SNIPPET_VERSION = "4.15.3"; analytics.load("XcKrCxUaF6GsN1E0nQ1fc0JXdGdCtvG1"); } }();
        }
    }
    useEffect(() => {
        if(!isSegmentBlocked())
        {
          callSegment();
          identifyUser(currentUser)
        }
        else
        {
          window.analytics = null;
        }
     }, [store?.currentUser?.userAbilitiesList]);

    return (
        <div>
            <Helmet>
                <script>
                    {  }
                </script>
            </Helmet>
        </div>
    );
}

export default HeadHelmet;
