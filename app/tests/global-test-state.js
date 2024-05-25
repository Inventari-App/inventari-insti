import axios, { AxiosRequestConfig, AxiosResponse } from "axios"

const apiUrl = (globalThis).TEST_API_URL

const getRequest = async (path, customHeaders) => {
  let headers = undefined
  if (customHeaders) {
    headers = customHeaders
  }
  return await axios.get(`${apiUrl}${path}`, headers)
}

export const testApiClient = {
  get: getRequest,
}
