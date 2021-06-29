This prototype is based from https://github.com/annthurium/virtual-waiting-room 

simple log-in page with passport js
virtual waiting room 
sms invite to add a 3rd party participant


## Preparing the application

To run the application you will need a [Twilio account](https://www.twilio.com/try-twilio) and Node.js and npm installed. Start by cloning or downloading the repo to your machine.

```bash
git clone https://github.com/mo-zhou/telehealth-demo.git
cd telehealth-demo
```

Install the dependencies:

```bash
npm install
```

Create a `.env` file by copying the `.env.example`.

```bash
cp .env.example .env
```

### Credentials

You will need your Twilio Account SID & Auth Token, available in your [Twilio console](https://www.twilio.com/console). Add them to the `.env` file.

You will also need an API key and secret, you can create these under the [Programmable Video Tools in your console](https://www.twilio.com/console/video/project/api-keys). Create a key pair and add them to the `.env` file too.

To send an SMS, you also need a Twilio phone number. You can buy and purchase a phone number here [Twilio console](https://www.twilio.com/console/phone-numbers/search)

If you wish to protect the page with passport js, see `.env.example` for more info.

## Running the application

Once you have completed the above you can run the application with:

```bash
node server.js
```

This will open in your browser at [localhost:3000](http://localhost:3000).

