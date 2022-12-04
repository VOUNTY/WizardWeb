import { RestClient } from '../RestClient';
import axios from 'axios';

import RepositoryList from '../models/RepositoryList';
import RepositoryContent from '../models/RepositoryContent';

export class RepositoryClient extends RestClient {

  async listRepositories(): Promise<RepositoryList []> {
    const { data: data } = await axios.get(`/api/repository/list`, this.config())
    return data
  }

  async getContent(repository: string): Promise<RepositoryContent> {
    const { data: data } = await axios.get(`/s/${repository}/${window.location.pathname}`, this.config())
    return data
  }

}

const repositoryClient: RepositoryClient = new RepositoryClient();
export default repositoryClient;