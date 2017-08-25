const BalloonRequest = require('./BalloonRequest.js');
const authFactory = require('./auth/authFactory.js');

class BalloonResource {

  /**
   * A collection of Balloon REST endpoints (eg. balloon.collection)
   *
   * @constructor
   * @param {Object} options - @see BalloonBase.constructor
   * @return {void}
   */
  constructor(options) {
    this._options = options;
  }

  /**
   * Factory to create a BalloonRequest for the current Resource
   *
   * @param {string} method - http method to use (GET|POST|PUT|DELETE)
   * @param {string} path - path ot the resource (eg. /collection)
   * @param {Object} params - params to pass to the request
   * @param {Object} [options] - request options
   * @param {string} [options.type] - mime type for the request. Default: application/json
   * @param {boolean} [options.binary] - if true request is interpreted as binary reques.
   * Default: false
   * @return {BalloonRequest|BalloonRequestClient} the created request.
   * in browser environment BalloonRequestClient
   */
  request(method, path, params, options = {}) {
    const type = options.type || 'application/json';
    const uri = this._getUri(path);
    const client = this._options.client || {};
    const auth = authFactory(this._options.auth);

    const request = this.constructor.createRequest(method, uri, client, auth);

    request.type(type);
    request.query(params);

    if (options.binary === true) request.binaryResponse();

    return request;
  }

  /**
   * Internal factory to create a BalloonRequest for the current Resource
   *
   * @param {string} method - http method to use (GET|POST|PUT|DELETE)
   * @param {string} uri - uri of the endpoint
   * @param {Object} client - client identification @see BalloonRequestBase.constructor
   * @param {Object} auth - auth configuration @see BalloonRequestBase.constructor
   * @return {BalloonRequest|BalloonRequestClient} the created request.
   * in browser environment BalloonRequestClient
   */
  static createRequest(method, uri, client, auth) {
    const request = new BalloonRequest({
      method,
      uri,
      client,
      auth,
    });

    return request;
  }

  /**
   * Creates the uri for a given path
   *
   * @param {string} path - path ot the resource (eg. /collection)
   * @return {BalloonRequest|BalloonRequestClient} the created request.
   * in browser environment BalloonRequestClient
   */
  _getUri(path) {
    return this._options.url + path;
  }
}

module.exports = BalloonResource;
