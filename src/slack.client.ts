import Axios from "axios";

export class SlackClient {
  private readonly client;

  constructor(webhookUrl) {
    this.client = Axios.create({
      baseURL: webhookUrl
    });
  }

  postMessage(body: object) {
    return this.client.post(null, body);
  }
}
