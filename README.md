Harvey
======

> Harvey is a Slack bot that can report the hours from Harvest for your team on a weekly or monthly basis.

![harvey screenshot](https://raw.githubusercontent.com/invokemedia/harvey/master/screenshot.png)

## Setup

* `git clone git@github.com:invokemedia/harvey-serverless.git`
* `cd harvey-serverless`
* `npm install`
* `cp serverless.yml.example serverless.yml`

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

### Running

* `npm run test`

or

* `npm start`

By changing the `config.schedule` from `week` to `month`, you can control the range for the previous week or month. Be sure to update the `minimumHours` when changing from `week` to `month`.

#### Holidays

Most of us don't work on holidays. In order to have these days not counted, the `minimumHours` value is reduced by the `minimumDailyHours` value for each day of the week that is a holiday.

Example of the expected JSON file:

```
{
  "2017": [
    "2017-01-02",
    "2017-02-13",
    "2017-04-14",
    "2017-05-22",
    "2017-07-03",
    "2017-08-07",
    "2017-09-04",
    "2017-10-09",
    "2017-11-13",
    "2017-12-25",
    "2017-12-26",
    "2017-12-27",
    "2017-12-28",
    "2017-12-29"
  ]
}
```

It expects an object keyed by the current year, and then an array of dates in `YYYY-MM-DD` format inside of that.

If the `holidayUrl` field is empty or undefined, holidays will not be accounted for.

### Testing

You can create a json file in the root and then set a `testFile` in the config. This can be used for testing the application locally without making calls to the Harvest API. Make sure you update `total_pages` so that there is only 1 page or the app will break.

## License

Harvey is open-source software licensed under the [MIT license](https://opensource.org/licenses/MIT).