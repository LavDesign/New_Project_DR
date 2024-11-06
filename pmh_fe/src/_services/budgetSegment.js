import { baseURL, request } from "_helpers/baseApi";

export const savePacingBudgets = async (query) => {
  const body = await request({
    url: `${baseURL}/campaigndash/savepacingbudgets`,
    method: 'POST',
    body: JSON.stringify(query)
  });
  return body;
};

export const getPacingBudgets = async query => {
  const body = await request({
    url: `${baseURL}/campaigndash/getpacingbudgets/${query.campaignKey}/${query.platformId}/${query.userId}`,
    method: 'GET',
    ...query
  });
  return body;
};
