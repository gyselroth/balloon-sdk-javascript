const BalloonResource = require('../BalloonResource.js');
const balloonMethod = require('../balloonMethod.js');

class FileResource extends BalloonResource {

}

/**
 * Upload a file
 * For large files consider to upload file in chunks @see FileResource.uploadChunk
 *
 * Node:
 * Consider to use streams instead of supplying file content with contents.
 * Example:
 * ```
 * const bln = new Balloon(options);
 * const request = bln.file.upload(params);
 * const srcFile = fs.createReadStream(pathToFile);
 * srcFile.pipe(request);
 * ```
 *
 * TODO pixtron - create a highlevel upload function for node and browser and place a hint here
 *
 * @param {Object} params - request parameters @see api doc
 * @return {BalloonRequest} - request object
 */
FileResource.prototype.upload = balloonMethod({
  method: 'PUT',
  path: '/file',
  type: 'application/octet-stream',
});


/**
 * Upload a file chunk
 *
 * Node:
 * Consider to use streams instead of supplying file content with contents.
 * Example:
 * ```
 * const bln = new Balloon(options);
 * const request = bln.file.upload(params);
 * const srcFile = fs.createReadStream(pathToFile, {start, end});
 * srcFile.pipe(request);
 * ```
 *
 * @param {Object} params - request parameters @see api doc
 * @param {mixed} [contents] - chunk contents to upload
 * @return {BalloonRequest} - request object
 */
FileResource.prototype.uploadChunk = balloonMethod({
  method: 'PUT',
  path: '/file/chunk',
  type: 'application/octet-stream',
});

module.exports = FileResource;
