const BalloonResource = require('../BalloonResource.js');
const balloonMethod = require('../balloonMethod.js');

class CollectionResource extends BalloonResource {

}

/**
 * Get children of a collection
 *
 * @param {Object} params - request parameters @see api doc
 * @return {BalloonRequest} - request object
 */
CollectionResource.prototype.getChildren = balloonMethod({
  method: 'GET',
  path: '/collection/children',
});


module.exports = CollectionResource;
