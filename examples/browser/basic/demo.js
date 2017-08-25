function displayCollections(collections) {
  var collectionsList = document.getElementById('collections');
  var li;
  var icon;
  var text;
  var textTmpl;
  var i;

  icon = document.createElement('span');
  icon.classList.add('bln-node-icon');
  icon.classList.add('bln-icon');
  icon.classList.add('bln-icon-collection');

  textTmpl = document.createElement('span');
  textTmpl.classList.add('bln-node-text');

  while (collectionsList.firstChild) {
    collectionsList.removeChild(collectionsList.firstChild);
  }

  for (i = 0; i < collections.length; i += 1) {
    li = document.createElement('li');
    li.appendChild(icon.cloneNode());
    text = textTmpl.cloneNode();
    text.appendChild(document.createTextNode(collections[i].name));
    li.appendChild(text);

    collectionsList.appendChild(li);
  }
}

// eslint-disable-next-line no-unused-vars
function listCollections() {
  var BASE_URL = document.getElementById('baseUrl').value;
  var USERNAME = document.getElementById('username').value;
  var PASSWORD = document.getElementById('password').value;

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

  bln.collection.getChildren({
    id: null,
    attributes: ['id', 'name'],
    filter: { directory: true }
  }).then(function (response) {
    displayCollections(response.body.data);
  }, function (err) {
    // eslint-disable-next-line no-console
    console.error('ERR', err);
  });

  return false;
}
