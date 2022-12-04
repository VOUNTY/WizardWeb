import axios, { AxiosRequestConfig } from 'axios';
import WebsiteConfig from './models/WebsiteConfig';

export class RestClient {

  async getConfiguration(name: string): Promise<WebsiteConfig> {
    return (await axios.get(`/api/config/${name}`)).data
  }

  config(): AxiosRequestConfig {
    const storage = window.localStorage
    const name = storage.getItem("tokenName")
    const password = storage.getItem("tokenPassword")
    return name !== null && password !== null ?
      {
        headers: {
          Authorization: `Basic ${btoa(`${name}:${password}`)}`
        },
      } : {}
  }

}

const restClient: RestClient = new RestClient()
export default restClient