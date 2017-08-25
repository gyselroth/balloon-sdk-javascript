const fs = require('fs');
const os = require('os');
const path = require('path');

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
    nodeId: {
      description: 'Enter the id of the file to download',
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

  const request = bln.node.download({
    id: result.nodeId,
  });

  const filePath = path.join(os.tmpdir(), 'download');
  const file = fs.createWriteStream(filePath);

  request.on('error', (err) => {
    switch (err.code) {
      case 'BalloonHttpError':
        // eslint-disable-next-line no-console
        console.error(err.code, err.response.body);
        break;
      default:
        // eslint-disable-next-line no-console
        console.error(err);
    }
  });

  request.on('response', (response) => {
    // eslint-disable-next-line no-console
    console.log(`Stored file ${result.nodeId} at ${filePath}`, response.body);
  });

  request.pipe(file);
});
