import { HarvestClient } from './harvest.client';
import { SlackClient } from './slack.client';
import { HarveyHandler } from './harvey.handler';
import { Handler } from 'aws-lambda';
import { WebClient } from '@slack/web-api';

const harvest = new HarvestClient(
  process.env.HARVEST_AUTHORIZATION_TOKEN,
  process.env.HARVEST_ACCOUNT_ID
);
const slack = new SlackClient(process.env.SLACK_WEBHOOK_URL);
const execSlack = new SlackClient(process.env.SLACK_EXEC_ALL_WEBHOOK_URL);
const testSlack = new SlackClient(process.env.SLACK_TEST_WEBHOOK_URL);
const slackAPI = new WebClient(process.env.SLACK_TOKEN);
const handler = new HarveyHandler(
  harvest,
  slack,
  execSlack,
  testSlack,
  slackAPI
);

export const handle: Handler = handler.handle;
