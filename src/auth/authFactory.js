
const BasicAuth = require('./BasicAuth.js');
const TokenAuth = require('./TokenAuth.js');

/**
 * Creates a Auth object for the requested auth type.
 *
 * @param {Object} options - authentication options
 * @param {string} options.type - type (basic|token)
 * @param {string} [options.token] - auth token (required for type: token)
 * @param {string} [options.username] - username (required for type: basic)
 * @param {string} [options.password] - password (required for type: basic)
 * @returns {BasicAuth|TokenAuth} - Auth object
 */
function authFactory(options) {
  switch (options.type) {
    case 'basic':
      return new BasicAuth(options);
    case 'token':
      return new TokenAuth(options);
    default:
      throw new TypeError(`unsuported auth type ${options.type}`);
  }
}

module.exports = authFactory;
