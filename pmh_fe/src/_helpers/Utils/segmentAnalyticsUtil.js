const analyticsConfig = {
    currentPageCategory: null,
};

export const PAGE_CATEGORY = {
    CAMPAIGN: "CAMPAIGN",
    AD_SET: "AD_SET",
    PLATFORM_AUTHENTICATION: "PLATFORM_AUTHENTICATION",
    USER_MANAGEMENT: "USER_MANAGEMENT",
    USER_SETTINGS: "USER_SETTINGS",
    USER_ACCESS_REQUEST: "USER_ACCESS_REQUEST",
};

export function setCurrentPageCategory(category) {
    if (category === null) {
        analyticsConfig.currentPageCategory = category;
    } else if (Object.keys(PAGE_CATEGORY).includes(category)) {
        analyticsConfig.currentPageCategory = category;
    }
}

export function trackButtonClick(label, category, type = null) {
    if (window.analytics) {
        var elementType = "Button";
        if (type) {
            elementType = type;
        }

        window.analytics.track(`${elementType} Clicked`, {
            category: category,
            label: label,
            environment: import.meta.env.VITE_ENV,
        });
    }
}

export const pageCategory = {
    campaignDash: "Campaign Dash",
    adSetsDash: "Ad Sets Dash",
    userManagement: "User Management",
    platformAuthentication: "Platform Authentication",
    unknowPageCategory: "Unknow Page Category",
    userSettings: "User Settings",
    userAccessRequest: "User Access Request",
};

export const pageSubCategory = {
    columnsModal: "Columns Modal",
    campaignModal: "Campaign Modal",
    userManagementModal: "User Management Modal",
    rowValue: "Row Value",
    budgetAndDatesModal: "Budget And Dates Modal",
    platformBudgetModal: "Platform Budget Modal",
    kpiModal: "KPI Modal",
    customFormulaModal: "Custom Formula Modal",
    freeTextModal: "Free Text Modal",
    viewModal: "View Modal",
    viewDeleteModal: "View Delete Modal",
    dateSelectorModal: "Date Selector Modal",
    demoDataModal: "Demo Data Modal",
};

export function getPageCategory() {
    const pathName = window.location.pathname;

    // We try first with specific page category
    if (analyticsConfig.currentPageCategory) {
        switch (analyticsConfig.currentPageCategory) {
            case PAGE_CATEGORY.CAMPAIGN:
                return pageCategory.campaignDash;
                break;
            case PAGE_CATEGORY.AD_SET:
                return pageCategory.adSetsDash;
                break;
            case PAGE_CATEGORY.PLATFORM_AUTHENTICATION:
                return pageCategory.platformAuthentication;
                break;
            case PAGE_CATEGORY.USER_MANAGEMENT:
                return pageCategory.userManagement;
                break;
            case PAGE_CATEGORY.USER_ACCESS_REQUEST:
                return pageCategory.userAccessRequest;
                break;
        }
    }

    // Then try to identify the page category by the path
    if (pathName.includes("user-management")) {
        return pageCategory.userManagement;
    }

    if (pathName.includes("platform-auth")) {
        return pageCategory.platformAuthentication;
    }

    if (pathName.includes("user-settings")) {
        return pageCategory.userSettings;
    }

    // Default to unknow page category
    return pathName.includes("dashboard")
        ? pageCategory.campaignDash
        : pageCategory.unknowPageCategory;
}

export function identifyUser(user) {
    if (window.analytics && user) {
        analytics.identify(user.id, {
            email: user.email,
            name: user.name,
            isActive: user.isActive,
        });
    }
}

export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
