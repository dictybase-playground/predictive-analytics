# predictive-analytics

This is a demo script to predict site navigation based on Google Analytics data. It is based on the [Guess.js static site experiment](https://github.com/guess-js/guess/tree/master/experiments/guess-static-sites).

## Setup

First install the dependencies.

```
$ npm install
```

## A) Database setup

**Prerequisites:**

- A Google Analytics account
- Mongo installed on your computer/server [(Instructions)](https://docs.mongodb.com/manual/installation/)

### Create Your Credentials

#### i) Create a Service Account

1. Go to the [Credentials](https://console.developers.google.com/apis/credentials) page in the Google APIs console.

2. If you don't have an existing Google Cloud project, click "Create" to create a new project. Otherwise, use the dropdown in the upper left corner to select the existing project that you'd like to use.

3. Select "Service Account key" from the "Create credentials" dropdown.

4. Fill out the form for creating a service account key:

- **Service account dropdown:** Select "New Service Account".
- **Service account name:** Give your service account a name.
- **Role:** Select "Service Account User" ("Service Accounts" > "Service Account User").
- **Service account ID:** This field will automatically be pre-filled, but you can change this if you would like.
- **Key type:** Select P12 key.

5. Click Create.

#### ii) Setup Your Private Key

Your private key should have started downloading when you clicked the "Create" button for creating your service account.

1. Note the private key password. You'll be prompted for this password in Step 3.
2. Move this key into the directory for this project.
3. Generate a \*.p12 certificate by running this command from the directory for this project:

```
$ openssl pkcs12 -in *.p12 -out key.pem -nodes -clcerts
```

### Configure Google Analytics

#### i) Add service account to Google Analytics

The service account that you just created needs to be added as a user to your Google analytics account.

1. Login to your [Google Analytics](https://analytics.google.com/analytics/web/) account.
2. Add a new user. (Admin > User Management > + > Add New Users)

- **Email Address** The email address of the service account you created. It should look something like this: example@example-project-123456.iam.gserviceaccount.com.
- **Permissions:** Select "Read & Analyze."

_Note: A service account can only be associated with one Google Analytics account at a time._

#### ii) Enable the Google Analytics Reporting API

You can enable this [here.](https://console.developers.google.com/flows/enableapi?apiid=analyticsreporting.googleapis.com&credential=client_key)

### Create your .env file

This file will hold your confidential configuration details.

#### i) Create the file

```
$ touch .env
```

#### ii) Add your information

Your file should look like this (replace with your own values):

```bash
VIEW_ID=12345678
SERVICE_ACCOUNT_EMAIL=example@example-project-123456.iam.gserviceaccount.com
```

To find your view ID, go to [Google Analytics](https://analytics.google.com/analytics/web/).
Click the accounts dropdown (it's located in the upper lefthand corner of the screen, right next to the Google Analytics logo). The dialog that opens will have three columns: Analytics Accounts, Properties & Apps, & Views. The far right column ("Views") will contain the View ID for your site.

### Generate predictions

#### i) Start mongod

If mongod is not running, start it:

```
$ mongod
```

#### ii) Run script

```
$ npm run predict
```

If this is successful, you should see a new file created -- `predictions.json`. This will be an array of data containing the
`pagePath`, its `nextPageCertainty` and predicted `nextPagePath`.

You can also explore the results in Mongo:

```
$ mongo
$ use guessjs_dev
$ db.predictions.find()
```

The results are based on the last year's worth of data relative to the day you run the script. You can easily change the
date range by editing the `queryParams.js` file.
