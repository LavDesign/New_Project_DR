import { baseURL, request } from '_helpers/baseApi';

export const saveCampaignBudgetPlatform = async (query) => {
  const body = await request({
    url: `${baseURL}/campaigndash/SaveBudgetCampaign`,
    method: 'POST',
    body: JSON.stringify(query),
  });
  return body;
};

export const getPlatformCampaignBudget = async (query) => {
  const body = await request({
    url: `${baseURL}/campaigndash/GetBudgetCampaign/${query.campaignId}/${query.userId}`,
    method: 'GET',
    ...query,
  });
  return body;
};

export const getPlatformAdSetBudget = async (query) => {
  const body = await request({
    url: `${baseURL}/AdSet/GetBudgetAdSet/${query.campaignId}/${query.adSetkey}`,
    method: 'GET',
    ...query,
  });
  return body;
};

export const saveAdSetBudgetPlatform = async (query) => {
  const body = await request({
    url: `${baseURL}/adset/SaveBudgetAdSet`,
    method: 'POST',
    body: JSON.stringify(query),
  });
  return body;
};