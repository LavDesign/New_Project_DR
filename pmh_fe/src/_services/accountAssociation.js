import { baseURL, request } from "_helpers/baseApi";

export const getAuthorizationUrl = async (query) => {
  const body = await request({
    url: `${baseURL}/accountassociation/getauthorizationurl/${query.platformId}`,
    method: 'GET'
  });
  return body;
};

export const saveAuthorizationCode = async (query) => {
  return request({
    url: `${baseURL}/accountassociation/saveauthorizationresponse`,
    method: 'POST',
    body: JSON.stringify(query.data),
  })
  .then(response => response);
};

export const disassociateAccount = async (query) => {
  return request({
    url: `${baseURL}/accountassociation/disassociateaccount/${query.platformId}`,
    method: 'GET'
  }).then(response => response);
};
