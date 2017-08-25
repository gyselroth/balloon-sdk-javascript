/**
 * Encode string as base64
 *
 * @param {string} string - string to encode
 * @return {string} - encoded string
 */
function encode(string) {
  return new Buffer(string).toString('base64');
}

/**
 * Decode string from base64
 *
 * @param {string} string - string to decode
 * @return {string} - decoded string
 */
function decode(string) {
  return new Buffer(string, 'base64').toString('utf8');
}

/**
 * Node.js utility for base64 encode/decode
 */
module.exports = {
  encode,
  decode,
};
