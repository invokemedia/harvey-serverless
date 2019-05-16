import * as _ from 'lodash';
import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import { AttachmentTransformer } from './attachment.transformer';
import { HarvestClient } from './harvest.client';
import { SlackClient } from './slack.client';
import strings from './strings.config';

const harvest = new HarvestClient(
  process.env.HARVEST_AUTHORIZATION_TOKEN,
  process.env.HARVEST_ACCOUNT_ID
);

const slack = new SlackClient(
  process.env.SLACK_WEBHOOK_URL
);

export const hello: Handler = async (event: APIGatewayEvent, context: Context, cb: Callback) => {
  try {
    // Get users from Harvest
    const users = await harvest.getUsers()
      .then((response) => {
        return response.data.users.filter((u) => {
          return u.is_active && u.is_contractor === false && u.cost_rate !== null;
        });
      });

    // Get time entries from Harvest
    const timeEntries = await harvest.getTimeEntries()
      .then((response) => response.data.time_entries)
      // .then((response) => {
      //   return _.groupBy(response.data.time_entries, (t) => t.user.id);
      // });

    // Intersect data to create attachments
    const attachments = AttachmentTransformer.transform(users, timeEntries).filter((a) => a.missing > 0);

    // Set text fallback message
    const text = attachments.length > 0 ? strings.withAttachments : strings.noAttachments;

    // Post message to Slack
    await slack.postMessage({ text, attachments });

    cb(null, { statusCode: 200 });

  } catch (e) {

    console.log(e);
  
  }
}
