const os = require('os');

const prompt = require('prompt');

// if you isntalled the package with npm install you can require('balloon-sdk-javascript');
const Balloon = require('../../src/lib/balloon-node.js');

prompt.start();

prompt.get({
  properties: {
    baseUrl: {
      description: 'Enter the url to your server (incl. https?://)',
    },
    username: {
      description: 'Enter your username',
    },
    password: {
      description: 'Enter your password',
      hidden: true,
    },
  },
}, (error, result) => { // eslint-disable-line consistent-return
  // eslint-disable-next-line no-console
  if (error) return console.error(error);

  const url = `${result.baseUrl}${(result.baseUrl.slice(-1) !== '/' ? '/' : '')}api/v1`;

  const bln = new Balloon({
    url,
    client: {
      name: 'API test app',
      version: '0.0.1-alpha',
      hostname: os.hostname(),
    },
    auth: {
      type: 'basic',
      username: result.username,
      password: result.password,
    },
  });

  bln.collection.getChildren({
    id: null,
    attributes: ['id', 'name'],
    filter: { directory: true },
  }).end((err, response) => {
    if (err) {
      switch (err.code) {
        case 'BalloonHttpError':
          // eslint-disable-next-line no-console
          console.log(err.code, err.response.body);
          break;
        default:
          // eslint-disable-next-line no-console
          console.error(err);
      }
      return;
    }

    // eslint-disable-next-line no-console
    console.log('You\'ve got the following collections in your root collection:');

    // eslint-disable-next-line no-console
    response.body.data.forEach((node) => {
      // eslint-disable-next-line no-console
      console.log(`${node.id}: ${node.name}`);
    });
  });
});
