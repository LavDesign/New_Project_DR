
import { baseURL, request } from "_helpers/baseApi";

export const saveDefaultTabSettings = async (payload) => {
  const body = await request({
    url: `${baseURL}/user/SaveSettings`,
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return body;
};
