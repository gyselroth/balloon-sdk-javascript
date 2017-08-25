const BalloonConfigError = require('../error/BalloonConfigError.js');
const base64 = require('../lib/base64.js');

class BasicAuth {

  /**
   * Authenticate a request with basic auth (Authorization: Basic)
   *
   * @constructor
   * @param {Object} options - authentication options
   * @param {string} options.username - username
   * @param {string} options.password - password
   */
  constructor(options) {
    if (!options.username) {
      throw new BalloonConfigError('auth.username must be set for basic auth');
    }

    if (!options.password) {
      throw new BalloonConfigError('auth.password must be set for basic auth');
    }

    this.options = options;
  }

  /**
   * Sets authorize header on request
   *
   * @param {Object} request - superagent request to authorize
   * @return {void}
   */
  authorizeRequest(request) {
    const authString = base64.encode(`${this.options.username}:${this.options.password}`);

    request.set('Authorization', `Basic ${authString}`);
  }
}

module.exports = BasicAuth;
