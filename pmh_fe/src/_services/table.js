import { baseURL, request } from "_helpers/baseApi";


export const saveFreeText = async (params) => {
  const body = await request({
    url: `${baseURL}/campaigndash/saveinputcolumn`,
    method: 'POST',
    body: JSON.stringify(params.notesData),
  });
  return body;
}

export const saveKpiMetrics = async (params) => {
  const body = await request({
    url: `${baseURL}/campaigndash/saveselectedkpimetric`,
    method: 'POST',
    body: JSON.stringify(params.kpiData),
  });
  return body;
}

export const saveStatus = async (params) => {
  const body = await request({
    url: `${baseURL}${params.url}`,
    method: 'POST',
    body: JSON.stringify(params.payload),
  });
  return body;
};

