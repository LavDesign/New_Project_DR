import { baseURL, request } from '_helpers/baseApi';

export const getCampaignBudgetGroups = async () => {
  const body = await request({
    url: `${baseURL}/BudgetGroup/GetBudgetGroups`,
    method: 'GET',
  });
  return body;
};

export const getRegions = async () => {
  const body = await request({
    url: `${baseURL}/BudgetGroup/GetRegions`,
    method: 'GET',
  });
  return body.json;
};

export const deleteCampaignGroups = async (query) => {
  const body = await request({
    url: `${baseURL}/BudgetGroup/DeleteBudgetGroups`,
    method: 'POST',
    body: JSON.stringify(query),
  });
  return body;
};

export const saveCampaignGroup = async (query) => {
  const body = await request({
    url: `${baseURL}/BudgetGroup/SaveBudgetGroup`,
    method: 'POST',
    body: JSON.stringify(query),
  });
  return body;
};

export const toggleBudgetGroupSubscription = async (query) => {
  const body = await request({
    url: `${baseURL}/BudgetGroup/ToggleBudgetGroupSubscription`,
    method: 'POST',
    body: JSON.stringify(query),
  });
  return body;
};

export const getBudgetGroupKpis = async (query) => {
  const body = await request({
    url: `${baseURL}/BudgetGroup/GetBudgetGroupKpis`,
    method: 'GET',
  });
  return body.json;
};
