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

4. Deploy to AWS

```
> sls deploy
```

## Running Locally

```
> sls invoke local -f harvey
```

### Harvest Authentication

You need to have a Bearer token for an *admin user* before you can use this script.

Visit the [Harvest Developer Tools](https://id.getharvest.com/developers) and create a new [OAuth2 Application](https://id.getharvest.com/oauth2/clients/new). You can use `localhost` for the redirect_url for now to get started, you don't actually need any working server at this point.

Once you've created an application on Harvest, then visit the below link in your browser to the oAuth page using your `client_id`:

```
https://id.getharvest.com/oauth2/authorize?client_id=CLIENT_ID_HERE&response_type=code
```

Harvest will return to your redirect url with a `code` parameter in the query string. Copy this for the next step. It will look something like this:

```
https://localhost/?code=SOME_CODE_WILL_BE_HERE&scope=harvest%3AAPP_ID
```

After that, you need to get a new token for that user:

```
curl --request POST \
  --url https://id.getharvest.com/api/v1/oauth2/token \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'code=SOME_CODE_WILL_BE_HERE&client_id=MY_CLIENT_ID_IS_HERE&client_secret=MY_CLIENT_SECRET_IS_HERE&grant_type=authorization_code'
```

That will return a JSON object. You will then use the value in the `access_token` field as the `bearerToken` and the `refresh_token` field as the `refreshToken` in your local `config.json`.

*Yeah, that was a lot of steps. Thanks, Harvest!*

Now, the app will automatically refresh the token each time the request is made. This means the token should last forever as a new one is generated and saved over the `config.json` each time.

### Slack Incoming Webhook

You will need to also [setup a Slack Webhook](https://api.slack.com/custom-integrations/incoming-webhooks) for the results to be sent to. Copy the Webhook URL into the slackUrl of the `config.json`.

## License

Harvey is open-source software licensed under the [MIT license](https://opensource.org/licenses/MIT).