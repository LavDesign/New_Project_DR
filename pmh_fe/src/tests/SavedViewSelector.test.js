import React from "react";
// import { render, renderComponent } from "@testing-library/react";
import {
    customRenderComponent,
    renderComponent,
} from '_testhelpers/test-utils';
import { SavedViewsSelector, SavedViewsMenu } from "views/shared/SavedViewsSelector/SavedViewSelector";

describe("SavedViewSelector Component", () => {
    test("render SavedViewSelector component", () => {
        customRenderComponent(
            <SavedViewsSelector
                platform='campaignDash'
                setIsRefetchingCampaignDashData={() => { }}
            />);
    });

    test("render SavedViewMenu component", () => {
        customRenderComponent(
            <SavedViewsMenu
                platform='campaignDash'
                setIsRefetchingCampaignDashData={() => { }}
            />);
    });
});
