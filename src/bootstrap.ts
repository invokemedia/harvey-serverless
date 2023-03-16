import { HarvestClient } from './harvest.client';
import { SlackClient } from './slack.client';
import { HarveyHandler } from './harvey.handler';

const harvest = new HarvestClient("TOKEN", "ID");
const slack = new SlackClient("HOOK");
const handler = new HarveyHandler(harvest, slack);

export const handle = () => {
    handler.handle().then(() => console.log('Done.'), (e) => console.log(e));
}
