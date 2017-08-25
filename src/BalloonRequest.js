const EventEmitter = require('events');

const VERSION = require('../package.json').version;
const BalloonRequestBase = require('./BalloonRequestBase.js');
const BalloonHttpError = require('./error/BalloonHttpError.js');

class BalloonRequest extends BalloonRequestBase {

  /**
   * Balloon API node.js Request
   *
   * @constructor
   * @extends BalloonRequestBase
   * @param {Object} options - Request options - @see BalloonRequestBase.constructor
   */
  constructor(options) {
    super(options);

    EventEmitter.call(this);

    this._setUserAgentHeader();

    this._forwardEvents();
  }

  /**
   * Parse superagent response. Buffers response body.
   * Used for piped requests on error, because response body is not bufferd
   * for piped request in superagent. Tries to extract the error message from the server.
   *
   * @param {Object} response - superagent response
   * @param {Function} callback - callback
   * @return {void}
   */
  static parseErrorResponse(response, callback) {
    let err;

    response.text = '';
    response.setEncoding('utf8');
    response.on('data', (chunk) => { response.text += chunk; });

    response.on('end', () => {
      try {
        response.body = response.text && JSON.parse(response.text);

        err = new BalloonHttpError(response);
      } catch (e) {
        err = e;

        err.rawResponse = response.text || null;
        err.statusCode = response.statusCode;
      } finally {
        callback(err);
      }
    });
  }

  /**
   * Pipes response body to a writable stream
   *
   * @param {WritableStream} stream - writable stream, response body is piped to this stream.
   * @param {Object} options - options for Writable Stream
   * @return {BalloonRequest}
   */
  pipe(stream, options) {
    this.piped = true;
    this.request.pipe(stream, options);

    return this;
  }


  /**
   * Write request body, used when
   *
   * @param {string|Buffer|Uint8Array} chunk - chunk data to write
   * @param {string} [encoding] - encoding of the chunk if chunk is a string.
   * @return {BalloonRequest}
   */
  write(chunk, encoding) {
    this.request.write(chunk, encoding);

    return this;
  }

  /**
   * Sets the user agent header
   *
   * @return {void}
   */
  _setUserAgentHeader() {
    this.request.set('User-Agent', `balloon-sdk-javascript; ${VERSION}`);
  }

  /**
   * Sets up superagent events only available in node
   *
   * @return {void}
   */
  _forwardEvents() {
    this.request.once('response', (response) => {
      if (this.piped) {
        if (this.request._isResponseOK(response) === false) {
          // buffering of response body is disabled on piped requests, therefore
          // parse the error message from response body, if request is not OK
          this.constructor.parseErrorResponse(response, (err) => {
            this.emit('error', err);
          });

          return;
        }
      }

      this.emit('response', response);
    });

    this.request.once('drain', () => {
      this.emit('drain');
    });
  }
}

// if inheriting with util.inherit protoype of BalloonRequestBase get's lost
//eslint-disable-next-line
for (const key in EventEmitter.prototype) {
  BalloonRequest.prototype[key] = EventEmitter.prototype[key];
}

module.exports = BalloonRequest;
