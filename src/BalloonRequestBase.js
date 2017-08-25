const superagent = require('superagent');

const BalloonHttpError = require('./error/BalloonHttpError.js');

class BalloonRequestBase {

  /**
   * Balloon API Request
   *
   * @constructor
   * @param {Object} options - Request options
   * @param {string} options.method - http method to use (GET|POST|PUT|DELETE) Default: GET
   * @param {string} options.uri - endpoint uri
   * @param {Object} options.auth - authentication configuration
   * @param {string} options.auth.type - type of authentication to use (basic|token)
   * @param {string} [options.auth.username] - username for basic authentication.
   * required if auth.type i basic
   * @param {string} [options.auth.password] - password for basic authentication.
   * required if auth.type i basic
   * @param {string} [options.auth.token] - token for token authentication.
   * required if auth.type is token
   * @param {string} [options.client] - identity of your client
   * client is used in node changelog eg: "created via [NAME] ([HOSTNAME])"
   * @param {string} [options.client.name] - name of your client
   * @param {string} [options.client.version] - version of your client
   * @param {string} [options.client.hostname]  - hostname on which your client runs
   */
  constructor(options) {
    const method = (options.method || 'GET').toLowerCase();

    this._options = options;

    const agent = superagent[method] || superagent.get;

    this.request = agent(options.uri);

    this.type('application/json');

    this._authorize(options.auth);

    this._setXClientHeader(options.client);

    this._forwardCommonEvents();
  }

  /**
   * Sets the mime type of the request body
   *
   * @param {string} type - Mimetype (application/json|application/octet-stream)
   * Default: application/json
   * @return {BalloonRequestBase}
   */
  type(type) {
    this._type = type;
    this.request.type(type);

    return this;
  }

  /**
   * Sets the request query string
   *
   * @param {Object} params - Parameters to supply via query string. Default: {}
   * @return {BalloonRequestBase}
   */
  query(params) {
    if (params && Object.keys(params).length > 0) {
      let query = params;

      if (this._type && this._type === 'application/json') {
        query = JSON.stringify(params);
      }

      this.request.query(query);
    }

    return this;
  }

  /**
   * Sets the response type to binary
   *
   * @return {BalloonRequestBase}
   */
  binaryResponse() {
    this.request.responseType('blob');

    return this;
  }

  /**
   * Set request body
   *
   * @param {mixed} contents - Request body
   * @return {BalloonRequestBase}
   */
  send(contents) {
    this.request.send(contents);

    return this;
  }

  /**
   * Executes the request
   *
   * @param {Function} callback - Callback which is executed once response is available
   * @return {BalloonRequestBase}
   */
  end(callback) {
    if (this._endCalled === true) {
      // eslint-disable-next-line no-console
      console.warn('Warning: ballown request was sent twice, because .end() has been called twice. Only call .end() once per request');
    }

    this._endCalled = true;

    // if end is called from writableStream.end no calback is supplied
    const cb = callback || function () {};

    this.request.end((err, response) => {
      let error = err;

      if (err && response) {
        error = new BalloonHttpError(response);
      }

      cb(error, response);
    });

    return this;
  }

  /**
   * Executes the request
   *
   * @param {Function} resolve - Resolve function
   * @param {Function} reject - Reject method
   * @return {Promise}
   */
  then(resolve, reject) {
    if (!this._promise) {
      if (this._endCalled) {
        // eslint-disable-next-line no-console
        console.warn('Warning: balloon request was sent twice, because both .end() and .then() were called. Never call .end() if you use promises');
      }

      this._promise = new Promise((innerResolve, innerReject) => {
        this.end((err, response) => {
          if (err) {
            innerReject(err);
          } else {
            innerResolve(response);
          }
        });
      });
    }

    return this._promise.then(resolve, reject);
  }

  /**
   * Authorizes the request
   *
   * @param {Object} auth - Auth options @see RequestBase.constructor
   * @return {void}
   */
  _authorize(auth) {
    if (!auth) return;

    auth.authorizeRequest(this.request);
  }

  /**
   * Sets the X-Client header
   *
   * @param {Object} client - Client options @see RequestBase.constructor
   * @return {void}
   */
  _setXClientHeader(client) {
    if (!client) return;

    const xClient = [
      client.name || '',
      client.version || '',
      client.hostname || '',
    ].join('|');

    this.request.set('X-Client', xClient);
  }

  /**
   * Sets up common superagent events both available in browser and node
   *
   * @return {void}
   */
  _forwardCommonEvents() {
    this.request.once('end', () => {
      this.emit('end');
    });

    this.request.once('error', (err) => {
      if (err && this.listeners('error').length > 0) this.emit('error', err);
    });

    this.request.on('abort', () => {
      this.emit('abort');
    });
  }
}

module.exports = BalloonRequestBase;
