import { baseURL, request } from '_helpers/baseApi';

export const fetchAvailableUsersWithCampaigns = async (query) => {
  return request({
    url: `${baseURL}/campaigndash/getcampaigndash`,
    body: JSON.stringify(query?.newUser),
  }).then((body) => {
    return body.json;
  });
};

export const fetchDashCampaigns = async (params) => {
  if (!params.viewId) {
    return [];
  }

  let platformRequestModel = {
    columns: params.columns.map((column) => ({
      CampaignDashColumnKey: column,
    })),
    campaigndashviewid: params.viewId,
    campaigndashuserid: params.userId,
    campaignsSelected: params.campaignsSelected,
  };

  const waitComplexParam = params.waitComplex ? '?waitComplex=true' : '';

  const body = await request({
    url: `${baseURL}/campaigndash/getcolumnsinfo${waitComplexParam}`,
    method: 'POST',
    body: JSON.stringify(platformRequestModel),
    signal: params.signal,
  });
  return body
};

export const fetchAvailableDashboards = (query) => {
  const { selectedDash } = query;
  if (selectedDash === null) {
    console.warn('Not Dashboard selected!');
    return [];
  }
  return request({
    url: `${baseURL}/CampaignSelector/GetAccounts/${selectedDash}`,
    signal: query.signal
  }).then(body => {
    if (body.statusCode !== 200) {
      console.warn(
        'There was an error fetching the available Campaign Dashboards: ',
        body
      );
      return [];
    }
    return body.json.sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
  });
};

export const fetchAvailableCampaigns = async (query) => {
  const {
    selectedDash,
    selectedAccount,
    selectedAccountPlatformId,
    parentKey,
  } = query;

  let url = `${baseURL}/CampaignSelector/GetCampaignsByAccount/${selectedDash}/${selectedAccount}/${selectedAccountPlatformId}`;
  if (parentKey) url += `?parentKey=${query.parentKey}`;

  const body = await request({ url, signal: query.signal });
  if (body.statusCode !== 200) {
    console.warn('There was an error fetching the available Campaigns: ', body);
    return [];
  }

  return body.json.sort(function (a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });
};

export const fetchSelectedCampaigns = (query) => {
  const { selectedDash } = query;
  if (selectedDash === null) {
    console.warn('Not Dashboard selected!');
    return [];
  }
  return request({
    url: `${baseURL}/CampaignSelector/GetSelectedCampaigns/${selectedDash}`,
  }).then((body) => {
    if (body.statusCode !== 200) {
      console.warn(
        'There was an error fetching the available Campaign Dashboards: ',
        body
      );
      return [];
    }
    return body.json;
  });
};

export const saveSelectedCampaigns = async (query) => {
  const body = await request({
    url: `${baseURL}/CampaignSelector/SaveSelectedCampaigns`,
    method: 'POST',
    body: JSON.stringify(query.campaigns),
  });
  return body.json;
};

export const fetchAccountsByPlatformId = async (params) => {
  const body = await request({
    url: `${baseURL}/accountassociation/getuseraccountsbyplatform/${params.platformId}`,
    method: 'GET',
  });
  return body.json;
};

export const importDeleteSelectedCampaigns = async (params) => {
  const body = await request({
    url: `${baseURL}${params.url}`,
    method: 'POST',
    body: params.selectedRows,
  });

  return body;
};
