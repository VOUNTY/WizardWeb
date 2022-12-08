import { RestClient } from '../RestClient';
import axios from 'axios';

import RepositoryList from '../models/RepositoryList';
import RepositoryContent from '../models/RepositoryContent';

export class RepositoryClient extends RestClient {

  async listRepositories(): Promise<RepositoryList []> {
    const { data: data } = await axios.get(`/api/repository/list`, this.config())
    return data
  }

  async getContent(repository: string, path: string []): Promise<RepositoryContent> {
    const { data: data } = await axios.get(`/s/${repository}/${this.formatPath(path)}`, this.config())
    return data
  }

  formatPath(paths: string []): string {
    let result = ""
    for (const path of paths)
      result += `${path}/`
    return result
  }

}

const repositoryClient: RepositoryClient = new RepositoryClient();
export default repositoryClient;