import * as _ from 'lodash';
import * as moment from 'moment';
import { APIGatewayEvent, Callback, Context } from 'aws-lambda';
import { AttachmentTransformer } from './attachment.transformer';
import { HarvestClient } from './harvest.client';
import { SlackClient } from './slack.client';
import strings from './strings.helper';

export class HarveyHandler {
  constructor(
    private readonly harvest: HarvestClient,
    private readonly slack: SlackClient
  ) { }

  public handle = async (event: APIGatewayEvent, context: Context, cb: Callback) => {
    try {
      const start = moment().day(-6);
      const from = start.format('YYYY-MM-DD');
      // const startFormatted = start.format('dddd, MMMM Do YYYY');

      const end = moment().day(0);
      const to = end.format('YYYY-MM-DD');
      // const endFormatted = end.format('dddd, MMMM Do YYYY');

      // Fetch time entries and users from Harvest
      const [users, timeEntries] = await Promise.all([this.harvest.getUsers(), this.harvest.getTimeEntries({ from, to })]);

      // Create Slack attachments
      const attachments = this.createAttachments(users, timeEntries).filter((a) => a.missing > 0);
  
      // Set plain text fallback message
      const text = attachments.length > 0 ? strings.withAttachments(from, to) : strings.withoutAttachments();
  
      // Post message to Slack
      await this.slack.postMessage({ text, attachments });
  
      cb(null, { statusCode: 200 });
  
    } catch (e) {
      
      console.log(e.message);

      cb(null, { statusCode: 200 });

    }
  }

  createAttachments(users, timeEntries) {
    return users.filter((u) => u.is_active)
      .map((u) => {
        return AttachmentTransformer.transform(u, timeEntries.filter((t) => u.id === t.user.id))
      });
  }
}
