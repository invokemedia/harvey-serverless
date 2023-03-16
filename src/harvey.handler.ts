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

  public handle = async () => {
    try {
      // Determine start and end dates
      const from = moment().subtract(6, 'days').format('YYYY-MM-DD');
      const to = moment().format('YYYY-MM-DD');

      // Fetch time entries and users from Harvest
      const [users, timeEntries] = await Promise.all([this.harvest.getUsers(), this.harvest.getTimeEntries({ from, to })]);

      // Create Slack attachments
      const attachments = this.createAttachments(users, timeEntries).filter((a) => a.missing > 0);
  
      // Set plain text fallback message
      const text = attachments.length > 0 ? strings.withAttachments(from, to) : strings.withoutAttachments();
  
      // Post message to Slack
      await this.slack.postMessage({ text, attachments });
  
      //cb(null, { statusCode: 200 });
  
    } catch (e) {
      
      console.log(e.message);

      //cb(null, { statusCode: 200 });

    }
  }

  createAttachments(users, timeEntries) {
    return users.filter((u) => u.is_active)
      .map((u) => {
        return AttachmentTransformer.transform(u, timeEntries.filter((t) => u.id === t.user.id))
      });
  }
}
