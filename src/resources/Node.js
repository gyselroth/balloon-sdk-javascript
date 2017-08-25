const BalloonResource = require('../BalloonResource.js');
const balloonMethod = require('../balloonMethod.js');

class NodeResource extends BalloonResource {

}

/**
 * Get node attributes
 *
 * @param {Object} params - request parameters @see api doc
 * @return {BalloonRequest} - request object
 */
NodeResource.prototype.getAttributes = balloonMethod({
  method: 'GET',
  path: '/node/attributes',
});

/**
 * Rename a node
 *
 * @param {Object} params - request parameters @see api doc
 * @return {BalloonRequest} - request object
 */
NodeResource.prototype.rename = balloonMethod({
  method: 'POST',
  path: '/node/name',
});

/**
 * Download a node
 *
 * Browser:
 * response is a blob with the file content.
 * Do not use this method for large file downloads, so you don't hit the maximum
 * blob size limit.
 * TODO pixtron - create an alternative highlevel download method for browsers and place a hint here
 * @see https://stackoverflow.com/questions/28307789/is-there-any-limitation-on-javascript-max-blob-size
 *
 * Node:
 * response is a buffer with the file content.
 * If you download large files consider using request.pipe() to avoid hitting
 * the maximum buffer size limit.
 * @see https://stackoverflow.com/questions/8974375/whats-the-maximum-size-of-a-node-js-buffer
 *
 *
 * @param {Object} params - request parameters
 * @param {string} params.id - id of the node to download either p or id has to be set
 * @param {string} params.p - path of the node to download either p or id has to be set
 * @param {string} [params.encode] - can be set to base64 to encode content as base64
 * @param {integer} [params.offset] - offset in bytes from where to read the file (default: 0)
 * @param {integer} [params.length] - offset in bytes to read startig from offset (default: 0)
 * @return {BalloonRequest} - request object
 */
NodeResource.prototype.download = balloonMethod({
  method: 'GET',
  path: '/node',
  binary: true,
});


module.exports = NodeResource;
