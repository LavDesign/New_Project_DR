import { baseURL, request } from "_helpers/baseApi";

export const saveManagementTable = async (params) => {
    const body = await request({
      url: `${baseURL}/demolayer/savemanagementtable`,
      method: 'POST',
      body: JSON.stringify(params.data),
    });
    return body;
  }