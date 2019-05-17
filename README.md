[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CircleCI](https://circleci.com/gh/invokemedia/harvey-serverless/tree/master.svg?style=svg)](https://circleci.com/gh/invokemedia/harvey-serverless/tree/master)

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

5. Deploy to AWS

```
> sls deploy
```

### Harvest Authentication

Visit the [Harvest Developer Tools](https://id.getharvest.com/developers) and create a new [Personal Access Token](https://help.getharvest.com/api-v2/authentication-api/authentication/authentication/#personal-access-tokens) to give Harvey access to your Harvest account.

### Slack Incoming Webhook

Setup a [Slack Incoming Webhook](https://api.slack.com/incoming-webhooks) for Harvey to communicate with your Slack channel.

## License

Harvey is open-source software licensed under the [MIT license](https://opensource.org/licenses/MIT).