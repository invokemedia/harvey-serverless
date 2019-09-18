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

  async getTimeEntries(params, page = 1, entries = []) {
    const newParams = { ...params, page };
    const newEntries = await this.client.get('time_entries', { params: newParams }).then(({ data }) => {
      return data.time_entries
    });
    entries = entries.concat(newEntries);

    if (newEntries.length == 100 && page < 10) {
      return await this.getTimeEntries(params, page + 1, entries);
    }

    return entries;
  }
}
