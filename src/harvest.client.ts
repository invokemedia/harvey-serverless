import Axios, { AxiosInstance } from 'axios';

export class HarvestClient {
  private readonly client: AxiosInstance;
  
  constructor(token: string, accountId: string) {
    this.client = Axios.create({
      baseURL: 'https://api.harvestapp.com/v2',
      headers: {
        'User-Agent': 'Harvey',
        'Authorization': `Bearer ${token}`,
        'Harvest-Account-Id': accountId
      }
    });
  }

  getUsers() {
    return this.client.get('users').then(({ data }) => data.users);
  }

  getTimeEntries(params: object = {}) {
    return this.client.get('time_entries', { params }).then(({ data }) => data.time_entries);
  }
}
