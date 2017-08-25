const STATUS_CODES = require('./httpStatusCodes.js');

class BalloonHttpError extends Error {

  /**
   * Balloon http error for requests not < 200 || > 299
   *
   * @constructor
   * @param {Object} response - rquest response
   */
  constructor(response) {
    let msg = 'Unsuccessful HTTP response';
    msg = STATUS_CODES[response.status] || 'Unsuccessful HTTP response';

    super(msg);

    this.response = response;

    this.code = 'BalloonHttpError';
  }
}

module.exports = BalloonHttpError;
