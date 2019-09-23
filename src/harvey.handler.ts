import * as _ from 'lodash';
import * as moment from 'moment';
import { APIGatewayEvent, Callback, Context } from 'aws-lambda';
import { AttachmentTransformer } from './attachment.transformer';
import { HarvestClient } from './harvest.client';
import { SlackClient } from './slack.client';
import { WebClient } from '@slack/web-api';
import strings from './strings.helper';

export class HarveyHandler {
  constructor(
    private readonly harvest: HarvestClient,
    private readonly slack: SlackClient,
    private readonly execSlack: SlackClient,
    private readonly slackAPI: WebClient
  ) { }

  public handle = async (event: APIGatewayEvent, context: Context, cb: Callback) => {
    try {
      // Determine start and end dates
      const to = moment().format('YYYY-MM-DD');
      const dayOfWeek = moment().day();

      let fromDelta;
      switch (dayOfWeek) {
        case 1: // Monday
          fromDelta = 7;
          break;
        case 2: // Tuesday
          fromDelta = 1;
          break;
        case 3: // Wednesday
          fromDelta = 2;
          break;
        case 4: // Thursday
          fromDelta = 3;
          break;
        case 5: // Friday
          fromDelta = 4;
          break;
      };

      // Setting the from to just be from the beginning of the week unless it is Monday.
      const from = moment().subtract(fromDelta, 'days').format('YYYY-MM-DD');

      // Fetch time entries and users from Harvest
      const [slackUsers, users, timeEntries] = await Promise.all([this.getSlackProfiles(), this.harvest.getUsers(), this.harvest.getTimeEntries({ from, to })]);

      this.sendMessages(slackUsers, users, timeEntries, from, to, dayOfWeek, 'general');
      this.sendMessages(slackUsers, users, timeEntries, from, to, dayOfWeek, 'exec');

      cb(null, { statusCode: 200 });

    } catch (e) {

      console.log(e.message);

      cb(null, { statusCode: 200 });

    }
  }

  async sendMessages(slackUsers, users, timeEntries, from, to, dayOfWeek, type) {
    // Create Slack attachments
    const attachments = this.createAttachments(slackUsers, users, timeEntries, type).filter((a) => a.missing > 2);

    // Adding in the sorting logic for the attachments.
    attachments.sort((a, b) => {
      return b.missing - a.missing
    });

    const slackNames = attachments.map(attachment => attachment.slackName).join(' ');

    // Set plain text fallback message
    const text = attachments.length > 0 ? strings.withAttachments(slackNames, from, to, dayOfWeek) : strings.withoutAttachments(dayOfWeek);
    console.log('Text', text);

    // Post message to Slack
    if (type == 'exec') {
      // await this.execSlack.postMessage({ text, attachments });
    } else {
      // await this.slack.postMessage({ text, attachments });
    }
  }

  async getSlackProfiles() {
    const response = await this.slackAPI.users.list();
    return response.members;
  }

  createAttachments(slackUsers, users, timeEntries, type) {
    return users.filter((u) => {
      if (type == "exec") {
        return u.is_active && u.roles.includes("Exec")
      } else {
        return u.is_active && !u.roles.includes("Exec")
      }
    }
    )
      .map((u) => {
        var slackUser = slackUsers.find(slackUser => {
          return slackUser.profile.email == u.email
        })
        if (slackUser) {
          u.slackName = slackUser.name;
        } else {
          console.log('u', u);
        }
        return AttachmentTransformer.transform(u, timeEntries.filter((t) => u.id === t.user.id))
      });
  }
}
