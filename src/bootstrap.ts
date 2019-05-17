import { HarvestClient } from './harvest.client';
import { SlackClient } from './slack.client';
import { HarveyHandler } from './harvey.handler';

const harvest = new HarvestClient(process.env.HARVEST_AUTHORIZATION_TOKEN, process.env.HARVEST_ACCOUNT_ID);
const slack = new SlackClient(process.env.SLACK_WEBHOOK_URL);
const handler = new HarveyHandler(harvest, slack);

export const handle = handler.handle;