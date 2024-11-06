import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./dailyReview.scss";
import {
    DAILY_REVIEW_BUDGET_GROUPS,
    SELECTED_DAILY_REVIEW_MENU,
} from "common/Redux/Constants";
import Dashboard from "../DailyReview/Dashboard";
import {
    DAILY_REVIEW_TABS,
    isNullOrUndefinedStored,
} from "_helpers/Utils/mediaConsoleUtil";
import { getDailyReviewBudgetGroups } from "_services/dailyReview";
import { getNotificationObject } from "views/UI/notificationInfo";
import CustomButton from "views/UI/CustomButton";
import { useTranslation } from "react-i18next";
import { PUBLICURL } from "../../../_helpers/Utils/dashboardUtil";
import BudgetRecommendation from "./BudgetRecommendation/BudgetRecommendation";

const DailyReview = ({ tab, headerGroups, tableData }) => {
    const { t } = useTranslation(["common"]);
    const menuPages = Object.values(DAILY_REVIEW_TABS);
    const errorMsg =
        "There is an issue with the request. Please try again later!";
    const { selectedDailyReviewMenu, dailyReviewBudgetGroups } = useSelector(
        (store) => store.getMediaConsole
    );

    const dispatch = useDispatch();

    const [activeButton, setActiveButton] = useState("back");

    const modifyData = (data) => {
        return data.map((group) => {
            group.currency_code = group.currencyCode;
            group.kpi = group.kpi?.replace(/_/g, " ");
            const updateCampaigns = group?.campaigns?.map((campaign) => {
                return {
                    ...campaign,
                    groupName: group.groupName,
                    campaign_name: campaign.campaignName,
                    currency_code: group.currency_code,
                    kpi: group.kpi,
                    kpiName: group.kpi,
                };
            });
            return {
                ...group,
                campaigns: updateCampaigns,
            };
        });
    };

    useEffect(() => {
        dispatch({
            type: SELECTED_DAILY_REVIEW_MENU,
            payload: {
                pageId: DAILY_REVIEW_TABS.BUDGET_REC.id,
                groupList: [],
            },
        });
        if (isNullOrUndefinedStored("sisense-filter-data"))
            sessionStorage.removeItem("sisense-filter-data");
        if (dailyReviewBudgetGroups === undefined) {
            getDailyReviewBudgetGroups()
                .then((response) => {
                    if (response) {
                        const { json, statusCode } = response;
                        if (statusCode === 200) {
                            dispatch({
                                type: DAILY_REVIEW_BUDGET_GROUPS,
                                payload: json?.length
                                    ? modifyData(json)
                                    : { message: "No data available" },
                            });
                        } else {
                            dispatch({
                                type: DAILY_REVIEW_BUDGET_GROUPS,
                                payload: getNotificationObject(
                                    "error",
                                    errorMsg
                                ),
                            });
                        }
                    } else {
                        dispatch({
                            type: DAILY_REVIEW_BUDGET_GROUPS,
                            payload: getNotificationObject("error", errorMsg),
                        });
                    }
                })
                .catch((error) => {
                    dispatch({
                        type: DAILY_REVIEW_BUDGET_GROUPS,
                        payload: getNotificationObject("error", errorMsg),
                    });
                });
        }
    }, []);

    const getFileName = () => {
        switch (tab) {
            case 1:
                return "Ad Sets";
            default:
                return "Campaigns";
        }
    };

    const displayLeftMenu = () => {
        const isFirstItemSelected =
            selectedDailyReviewMenu.pageId === DAILY_REVIEW_TABS.BUDGET_REC.id;
        const isSecondItemSelected =
            selectedDailyReviewMenu.pageId ===
            DAILY_REVIEW_TABS.DAILY_REV_DASH.id;

        return (
            <div className="head-container">
                <div className="menu-actions-container">
                    <div className="menu-pages-daily-review">
                        <div className="menu-content">
                            <div
                                className={`menu-name-text ${
                                    isFirstItemSelected
                                        ? "active-menu-name-text"
                                        : "completed-menu"
                                }`}
                                onClick={() =>
                                    dispatch({
                                        type: SELECTED_DAILY_REVIEW_MENU,
                                        payload: {
                                            pageId: DAILY_REVIEW_TABS.BUDGET_REC
                                                .id,
                                            groupList: [],
                                        },
                                    })
                                }
                            >
                                <span
                                    className={
                                        isFirstItemSelected
                                            ? "icon-in-progress"
                                            : "icon-completed"
                                    }
                                ></span>
                                <span className="budget-text">
                                    {menuPages[0].name}
                                </span>
                            </div>
                        </div>
                        <span className="menu-spacer" />
                        <div className="menu-content">
                            <div
                                className={`menu-name-text margin-text ${
                                    isSecondItemSelected
                                        ? "active-menu-name-text"
                                        : "pending-menu"
                                }`}
                                onClick={() =>
                                    dispatch({
                                        type: SELECTED_DAILY_REVIEW_MENU,
                                        payload: {
                                            pageId: DAILY_REVIEW_TABS
                                                .DAILY_REV_DASH.id,
                                            groupList: [],
                                        },
                                    })
                                }
                            >
                                <span
                                    className={
                                        isSecondItemSelected
                                            ? "icon-in-progresss"
                                            : "icon-pending"
                                    }
                                ></span>
                                <span className="budget-text">
                                    {menuPages[1].name}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="button-container">
                        <CustomButton
                            className={`custom-button back-button ${
                                activeButton === "back" && !isSecondItemSelected
                                    ? "inactive-button"
                                    : "active-button-white"
                            }`}
                            onClick={() => {
                                setActiveButton("back");
                                dispatch({
                                    type: SELECTED_DAILY_REVIEW_MENU,
                                    payload: {
                                        pageId: DAILY_REVIEW_TABS.BUDGET_REC.id,
                                        groupList: [],
                                    },
                                });
                            }}
                        >
                            <img
                                src={`${window.location.origin}${PUBLICURL}/assets/icons/left-arrow.svg`}
                                className={`white-icon ${
                                    activeButton === "back" &&
                                    !isSecondItemSelected
                                        ? ""
                                        : "black-icon"
                                }`}
                            />
                            <span className="back-text">
                                {t("button_text.back")}
                            </span>
                        </CustomButton>
                        <CustomButton
                            className={`custom-button next-button ${
                                activeButton === "nextFinish" &&
                                isSecondItemSelected
                                    ? "active-button-finish"
                                    : "active-button-next"
                            }`}
                            onClick={() => {
                                setActiveButton("nextFinish");
                                dispatch({
                                    type: SELECTED_DAILY_REVIEW_MENU,
                                    payload: {
                                        pageId: DAILY_REVIEW_TABS.DAILY_REV_DASH
                                            .id,
                                        groupList: [],
                                    },
                                });
                            }}
                        >
                            <span className="next-text">
                                {isSecondItemSelected
                                    ? t("button_text.finish")
                                    : t("button_text.next")}
                            </span>
                            {!isSecondItemSelected ? (
                                <img
                                    src={`${window.location.origin}${PUBLICURL}/assets/icons/right-arrow.svg`}
                                    className={`white-icon ${
                                        activeButton === "back" &&
                                        !isSecondItemSelected
                                            ? ""
                                            : "white-icon"
                                    }`}
                                />
                            ) : (
                                <></>
                            )}
                        </CustomButton>
                    </div>
                </div>
                
            </div>
        );
    };

    const mainPageContent = () => {
        switch (selectedDailyReviewMenu.pageId) {
            case DAILY_REVIEW_TABS.BUDGET_REC.id:
                return <BudgetRecommendation />;
            case DAILY_REVIEW_TABS.CAMPAIGN_ADV.id:
            // return <CampaignAdvisor />;
            case DAILY_REVIEW_TABS.DAILY_REV_DASH.id:
                return <Dashboard />;
        }
    };

    return (
        <>
            <div className="daily-review-container">
                {displayLeftMenu()}
                {mainPageContent()}
            </div>
        </>
    );
};

export default DailyReview;
