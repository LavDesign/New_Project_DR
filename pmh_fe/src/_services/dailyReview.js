import { baseURL, request } from '_helpers/baseApi';

export const getDailyReviewBudgetGroups = async () => {
  const body = await request({
    url: `${baseURL}/DailyReview/GetBudgetGroupsMarketingConsole`,
    method: 'GET',
  });
  return body;
};

export const saveAutoBudget = async (query) => {
  const body = await request({
    url: `${baseURL}/autobudgetupdate/SaveAutoBudgetEntitiesWithGroupIds`,
    method: 'POST',
    body: JSON.stringify(query),
  });
  return body;
};

export const loadCampaignsIntoManagementTable = async (query) => {
  const body = await request({
    url: `${baseURL}/dailyreview/LoadCampaignsIntoManagementTable`,
    method: 'POST',
    body: JSON.stringify(query),
  });
  return body;
};