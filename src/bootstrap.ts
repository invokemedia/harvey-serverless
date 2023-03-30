import { HarvestClient } from "./harvest.client";
import { SlackClient } from "./slack.client";
import { HarveyHandler } from "./harvey.handler";

const harvest = new HarvestClient(
  "TOKEN",
  "ID"
);
const slack = new SlackClient(
  "HOOK"
);
const handler = new HarveyHandler(harvest, slack);

export const handle = async () => {
  console.log("Starting handle()");
  await handler.handle().catch((e) => {
    console.log("ERROR!!!");
    console.log(e);
  });
  console.log("Done.");
};
