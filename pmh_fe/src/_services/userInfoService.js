import { baseURL, request } from '_helpers/baseApi';

export const updateUserSignin = async () => {
  const body = await request({
    url: `${baseURL}/user/updatesignin`,
    method: 'POST'
  });
  return body;
};

export const cleanOnLogout = async () => {
    const body = await request({
      url: `${baseURL}/user/cleanOnLogout`,
      method: 'POST'
    });
    return body;
};
