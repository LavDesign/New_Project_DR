import { baseURL, request } from '_helpers/baseApi';

export const fetchSavedViews = async () => {
  const body = await request({
    url: `${baseURL}/view/getdashviewsbyuser`,
    method: 'GET',
  });

  const views = body.json;
  views.sort((a, b) => {
    if (a.isSelected) {
      return -1;
    } else if (b.isSelected) {
      return 1;
    } else {
      return 0;
    }
  });

  return views;
};

export const saveSelectedDashView = async (params) => {
  const body = await request({
    url: `${baseURL}/view/saveselecteddashview/${params.viewId}`,
    method: 'POST',
  });

  return body;
};

export const deleteSavedViews = async (params) => {
  const body = await request({
    url: `${baseURL}/view/deleteView/${params.viewId}`,
    method: 'GET',
  });

  return body;
};

export const saveView = async (params) => {
  const apiUrl = 'view/saveview';
  const body = await request({
    url: `${baseURL}/${apiUrl}`,
    method: 'POST',
    body: JSON.stringify(params.savedView),
  });
  return body;
};
