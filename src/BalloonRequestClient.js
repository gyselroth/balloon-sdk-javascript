const EventEmitter = require('component-emitter');

const BalloonRequestBase = require('./BalloonRequestBase.js');

class BalloonRequestClient extends BalloonRequestBase {

  /**
   * Balloon API browser Request
   *
   * @constructor
   * @extends BalloonRequestBase
   * @param {Object} options - Request options - @see BalloonRequestBase.constructor
   */
  constructor(options) {
    super(options);

    this._setupEvents();
  }

  /**
   * Sets up superagent events only available in browser
   *
   * @return {void}
   */
  _setupEvents() {
    this.request.once('response', (response) => {
      this.emit('response', response);
    });

    this.request.on('progress', (progress) => {
      this.emit('progress', progress);
    });
  }

}

EventEmitter(BalloonRequestClient.prototype);

module.exports = BalloonRequestClient;
