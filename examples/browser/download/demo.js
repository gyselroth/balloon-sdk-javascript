// eslint-disable-next-line no-unused-vars
function downloadNode() {
  var BASE_URL = document.getElementById('baseUrl').value;
  var USERNAME = document.getElementById('username').value;
  var PASSWORD = document.getElementById('password').value;
  var NODE_ID = document.getElementById('nodeId').value;

  var url = BASE_URL + (BASE_URL.slice(-1) !== '/' ? '/' : '') + 'api/v1';

  // eslint-disable-next-line no-undef
  var bln = new Balloon({
    url: url,
    client: {
      name: 'JavaScript SDK Examples',
      version: '0.0.1-alpha',
      hostname: ''
    },
    auth: {
      type: 'basic',
      username: USERNAME,
      password: PASSWORD
    }
  });

  bln.node.download({
    id: NODE_ID
  }).then(function (response) {
    var downloadUrl = URL.createObjectURL(response.body);
    var downloadButton = document.createElement('a');

    // eslint-disable-next-line no-console
    downloadButton.setAttribute('href', downloadUrl);
    downloadButton.setAttribute('download', 'myfile');
    downloadButton.setAttribute('style', 'display: none;');

    downloadButton.click();
  }, function (err) {
    // eslint-disable-next-line no-console
    console.log('ERR', err);
  });

  return false;
}
