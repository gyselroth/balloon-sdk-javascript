

/**
 * Creates a new resource method based on the supplied spec
 *
 * @param {Object} spec - method spec
 * @param {string} spec.path - path appended to the api base url (eg. /node, node/name)
 * @param {string} [spec.method] - http method (GET,POST,PUT,DELETE,HEAD) Default: GET
 * @param {boolean} [spec.binary] - If true response body is treated as binary Default: false
 * @param {string} [spec.type] - Set the request content-type Default: application/json
 * If set to true response.body will be a blob in browser and a buffer in node
 * @return {Function} - resource method
 */
const balloonMethod = function (spec) {
  const method = (spec.method || 'GET').toLowerCase();
  const path = spec.path || '/';

  const options = {
    type: (spec.type || 'application/json'),
    binary: (spec.binary === true),
  };

  /**
   * Resource method
   *
   * @param {Object} params - params to pass to the request.
   * For available params see balloon api doc.
   * @param {mixed} [contents] - request body to send
   * @return {BalloonRequest} - superagent request
   */
  return function (params, contents) {
    const request = this.request(method, path, params, options);

    if (contents) {
      request.send(contents);
    }

    return request;
  };
};

module.exports = balloonMethod;
