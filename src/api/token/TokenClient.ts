import { RestClient } from '../RestClient';
import axios, { AxiosResponse } from 'axios';

export class TokenClient extends RestClient {

  async login(user: string, password: string): Promise<AxiosResponse> {
    return await axios.post(`/api/token/login`, {
      user: user,
      password: password,
    }, this.config())
  }

}

const tokenClient: TokenClient = new TokenClient()
export default tokenClient;