const BalloonConfigError = require('./error/BalloonConfigError.js');

/* eslint-disable global-require */
const resources = {
  Collection: require('./resources/Collection.js'),
  File: require('./resources/File.js'),
  Node: require('./resources/Node.js'),
};
/* eslint-enable global-require */


class BalloonBase {

  /**
   * The Balloon api client
   *
   * @constructor
   * @param {Object} options - Balloon configuration
   * @param {string} options.url - url of the api server
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
    this.constructor.validateOptions(options);

    // default options
    const defaultOptions = {
      client: {
        name: 'balloon-sdk-javascript',
      },
    };

    // extend default options with custom options
    Object.assign(defaultOptions, options);

    this._prepResources(defaultOptions);
  }

  /**
   * Validates options
   *
   * @param {Object} options - options to validate @see BalloonBase.constructor
   * @return {void}
   * @throws {BalloonConfigError}
   */
  static validateOptions(options) {
    if (!options.auth) throw new BalloonConfigError('Auth config is required');

    if (!options.url) throw new BalloonConfigError('Url is required');
  }


  /**
   * Prepares the different resources
   * (Colections of Balloon REST endpoints - eg. balloon.collection)
   *
   * @param {Object} options - @see BalloonBase.constructor
   * @return {void}
   */
  _prepResources(options) {
    const keys = Object.keys(resources);

    for (let i = 0; i < keys.length; i += 1) {
      const name = keys[i];
      this[name.toLowerCase()] = new resources[name](options);
    }
  }
}

module.exports = BalloonBase;
