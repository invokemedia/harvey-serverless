[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# Harvey

Harvey brings Harvest time tracking into Slack to get your team quickly and easily tracking their hours and keep your projects running smoothly.

## Setup

1. Setup your [AWS Credentials](https://github.com/serverless/serverless/blob/master/docs/providers/aws/guide/credentials.md)
2. Install [Serverless.js](https://serverless.com)

```
> npm install -g serverless
```

3. Download and configure Harvey

```
> git clone git@github.com:invokemedia/harvey-serverless.git
> cd harvey-serverless
> npm install
> cp serverless.yml.example serverless.yml
```

4. Test locally before deploying

```
> sls invoke local -f harvey
```

Please note that even when testing locally, _YOU WILL BE SENDING MESSAGES TO SLACK_ unless you disable:

```
// In harvey.handler.ts
// await this.execSlack.postMessage({ text, attachments });
// await this.slack.postMessage({ text, attachments });
```

5. Deploy to AWS 🎉

```
> sls deploy
```

### Harvest Authentication

Visit the Harvest [Developer Tools](https://id.getharvest.com/developers) and create a new [Personal Access Token](https://help.getharvest.com/api-v2/authentication-api/authentication/authentication/#personal-access-tokens) to give Harvey access to your time entries in Harvest.

### Posting to Slack

Setup a Slack [Incoming Webhook](https://api.slack.com/incoming-webhooks) for Harvey to communicate with your Slack channel.

## Removing Harvey

We are sorry to see you go 👋

```
> sls remove
```

# Giant Machines Specific

To add people to the exec team so that they only show their updates on the #exec-all channel, add them to the Exec group in Harvest.

To add people to the flexible group so that they only need to record up to 32 hours a week, then add them to the Flexible group in Harvest: https://giantmachines.harvestapp.com/roles

## Managing the Serverless instance

https://console.aws.amazon.com/lambda is where the scheduler is.

Configuration: https://console.aws.amazon.com/lambda/home?region=us-east-1#/functions/harvey-dev-harvey?tab=configuration

To test run it in THE PROD ENVIRONMENT, which means that everyone is going to get the SLACK messages unless you comment out, you can run a TEST with the Run test.

```
// In harvey.handler.ts
// await this.execSlack.postMessage({ text, attachments });
// await this.slack.postMessage({ text, attachments });
```

## License

Harvey is open-source software licensed under the [MIT license](https://opensource.org/licenses/MIT).
