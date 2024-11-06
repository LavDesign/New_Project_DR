import { baseURL, request } from "_helpers/baseApi";

export const saveImage = async (params) => {
    const formData = new FormData();
    formData.append("file", params.file);
    formData.append("scenario", params.scenario);
   
    const body = await request({
      url: `${baseURL}/file/saveimage`,
      method: 'POST',
      body: formData
    });
  
    return body;
  };

  export const getImageByName = async (name) => {
    const response = await request({
      url: `${baseURL}/file/getimagebyname/${name}`,
      method: 'GET',
      responseType: 'blob' 
    });
    const imageUrl = URL.createObjectURL(response);
    return imageUrl;
  }

  export const deleteImage = async (name) => {
    const response = await request({
      url: `${baseURL}/file/deleteimage/${name}`,
      method: 'GET',
    });
  
    return response;
  };
  
  