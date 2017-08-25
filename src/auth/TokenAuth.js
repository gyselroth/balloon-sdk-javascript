const BalloonConfigError = require('../error/BalloonConfigError.js');

class TokenAuth {

  /**
   * Authenticate a request with a token (Authorization: Bearer)
   *
   * @constructor
   * @param {Object} options - authentication options
   * @param {string} options.token - auth token
   */
  constructor(options) {
    if (!options.token) {
      throw new BalloonConfigError('auth.token must be set for token auth');
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
    // TODO pixtron - test this
    request.set('Authorization', `Bearer ${this.options.token}`);
  }
}

module.exports = TokenAuth;
