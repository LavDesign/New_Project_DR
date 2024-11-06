import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '_theme/modules/dailyReview/dailyReview.module.css';
import BudgetRecommendation from './BudgetRecommendation';
import CampaignAdvisor from './CampaignAdvisor';
import {
  DAILY_REVIEW_BUDGET_GROUPS,
  SELECTED_DAILY_REVIEW_MENU,
} from 'common/Redux/Constants';
import Dashboard from './Dashboard';
import {
  DAILY_REVIEW_TABS,
  isNullOrUndefinedStored,
} from '_helpers/Utils/mediaConsoleUtil';
import { getDailyReviewBudgetGroups } from '_services/dailyReview';
import { getNotificationObject } from 'views/UI/notificationInfo';
import CommonToolBar from '../Common/CommonToolBar/CommonToolBar';

const DailyReview = () => {
  const menuPages = Object.values(DAILY_REVIEW_TABS);
  const errorMsg =
    'There is an issue with the request. Please try again later!';
  const { selectedDailyReviewMenu, dailyReviewBudgetGroups } = useSelector(
    (store) => store.getMediaConsole
  );

  const dispatch = useDispatch();

  const modifyData = (data) => {
    return data.map((groupItem) => {
      const group = groupItem.originalValues;
  
      group.currency_code = group.currencyCode;
      group.kpi = group.kpi?.replace(/_/g, ' ');
  
      const updateCampaigns = group?.campaigns?.map((campaignItem) => {
        const campaign = campaignItem.originalValues;
  
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
        pageId: isNullOrUndefinedStored('sisense-filter-data')
          ? DAILY_REVIEW_TABS.BUDGET_REC.id
          : DAILY_REVIEW_TABS.DAILY_REV_DASH.id,
        groupList: [],
      },
    });
    if (isNullOrUndefinedStored('sisense-filter-data'))
      sessionStorage.removeItem('sisense-filter-data');
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
                  : {
                      message: 'No data available',
                    },
              });
            } else {
              dispatch({
                type: DAILY_REVIEW_BUDGET_GROUPS,
                payload: getNotificationObject('error', errorMsg),
              });
            }
          } else {
            dispatch({
              type: DAILY_REVIEW_BUDGET_GROUPS,
              payload: getNotificationObject('error', errorMsg),
            });
          }
        })
        .catch((error) => {
          dispatch({
            type: DAILY_REVIEW_BUDGET_GROUPS,
            payload: getNotificationObject('error', errorMsg),
          });
        });
    }
  }, []);

  const displayLeftMenu = () => {
    return (
      <div className={styles['menu-pages-daily-review']}>
        {menuPages.map((page, index) => (
          <div key={`page_${page.id}`} className={styles['menu-content']}>
            <div
              key={`page_${index}`}
              className={`${styles['menu-name-text']} ${
                page.id === selectedDailyReviewMenu.pageId
                  ? styles['active-menu-name-text']
                  : ''
              }`}
              onClick={() =>
                dispatch({
                  type: SELECTED_DAILY_REVIEW_MENU,
                  payload: {
                    pageId: page.id,
                    groupList: [],
                  },
                })
              }
            >
              <span>{page.name}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const mainPageContent = () => {
    switch (selectedDailyReviewMenu.pageId) {
      case DAILY_REVIEW_TABS.BUDGET_REC.id:
        return <BudgetRecommendation />;
      case DAILY_REVIEW_TABS.CAMPAIGN_ADV.id:
        return <CampaignAdvisor />;
      case DAILY_REVIEW_TABS.DAILY_REV_DASH.id:
        return <Dashboard />;
    }
  };

  return (
    <>
      {/* <CommonToolBar /> */}
      <div className={styles['daily-review-container']}>
        {displayLeftMenu()}
        {mainPageContent()}
      </div>
    </>
  );
};

export default DailyReview;
