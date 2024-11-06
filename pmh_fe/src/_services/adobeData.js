import { baseURL, request } from "_helpers/baseApi";

export const getAdobeConversions = async (params) => {
    const body = await request({
      url: `${baseURL}/adobedata/getadobeconversionsbyid/${params.campaignKey}`,
      method: 'GET',
    });
  
    return body.json;
  }