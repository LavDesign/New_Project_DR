import { baseURL, request } from "_helpers/baseApi";

export const addUser = async (query) => {
  const body = await request({
    url: query.isUpdated ? `${baseURL}/user/UpdateUser` : `${baseURL}/user/createuser`,
    method: 'POST',
    body: JSON.stringify(query.newUser),
  });
  return body;
}

export const removeUser = async (query) => {
  const body = await request({
    url: `${baseURL}/user/deactivateuser`,
    method: 'POST',
    query: { id: query.id },
  });
  return body.json;
}

export const getUserByEmail = async (query, isUserContext = null) => {
  const body = await request({
    url: `${baseURL}/user/getuserbyemail`,
    method: 'POST',
    body: query.email
  }).catch(err => {
    console.log("err", err);
  });
  if(isUserContext)
  return body;
  else
  return body.json;
}

export const getListOfUsers = async (query) => {
  return await request({
    url: `${baseURL}/user/getallusers`,
    method: 'GET',
    ...query
  }).then(body => {
    return body.json
  });
}

export const getAllRoles = async query => {
  const body = await request({
    url: `${baseURL}/usermanagement/getallroles`,
    method: 'GET',
    ...query
  });
  return body.json;
};

export const getAllAbilities = async query => {
  const body = await request({
    url: `${baseURL}/usermanagement/getallabilities`,
    method: 'GET',
    ...query
  });
  return body.json;
};

export const getAllClients = async query => {
  const body = await request({
    url: `${baseURL}/usermanagement/getallclients`,
    method: 'GET',
    ...query
  });
  return body.json;
}

export const saveUserAccessRequest = async query => {
  const body = await request({
    url: `${baseURL}/user/RequestAccess`,
    method: 'POST',
    body: JSON.stringify(query)
  });
  return body;
}

export const getUserAccessRequest = async () => {
  const body = await request({
    url: `${baseURL}/user/GetUserAccessRequest`,
    method: 'GET',
  });
  return body.json;
}

