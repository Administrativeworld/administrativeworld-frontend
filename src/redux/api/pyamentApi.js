import axios from "axios";

export const axiosInstance = axios.create({});

export const paymentApi = (method, url, bodyData, headers, params) => {
  return axiosInstance({
    method: method,  // Just use the variable directly
    url: url,        // Just use the variable directly
    data: bodyData ? bodyData : null,  // Use bodyData if it exists, else null
    headers: headers ? headers : null,  // Use headers if they exist, else null
    params: params ? params : null,    // Use params if they exist, else null
  });
};
