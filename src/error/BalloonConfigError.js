
class BalloonConfigError extends Error {

  /**
   * Balloon configuraton error
   *
   * @constructor
   * @param {Object} response - rquest response
   */
  constructor(msg) {
    super(msg);

    this.code = 'BalloonConfigError';
  }
}

module.exports = BalloonConfigError;
