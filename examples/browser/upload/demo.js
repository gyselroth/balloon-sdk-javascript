// eslint-disable-next-line no-unused-vars
function uploadFile() {
  var BASE_URL = document.getElementById('baseUrl').value;
  var USERNAME = document.getElementById('username').value;
  var PASSWORD = document.getElementById('password').value;

  var url = BASE_URL + (BASE_URL.slice(-1) !== '/' ? '/' : '') + 'api/v1';

  // eslint-disable-next-line no-undef
  var bln = new Balloon({
    url: url,
    client: {
      name: 'API test app',
      version: '0.0.1-alpha',
      hostname: 'hostname'
    },
    auth: {
      type: 'basic',
      username: USERNAME,
      password: PASSWORD
    }
  });

  var fileInput = document.getElementById('fileUpload');
  var file = fileInput.files[0];

  bln.file.upload({
    name: file.name
  }, file).then(function (response) {
    // eslint-disable-next-line no-console
    console.log(response.body);
  }, function (err) {
    // eslint-disable-next-line no-console
    console.log('ERR', err);
  });

  return false;
}
