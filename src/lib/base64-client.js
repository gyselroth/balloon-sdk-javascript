/**
 * Encode string as base64
 *
 * @param {string} string - string to encode
 * @return {string} - encoded string
 */
function encode(string) {
  return window.btoa(unescape(encodeURIComponent(string)));
}

/**
 * Decode string from base64
 *
 * @param {string} string - string to decode
 * @return {string} - decoded string
 */
function decode(string) {
  return decodeURIComponent(escape(window.atob(string)));
}

/**
 * Browser utility for base64 encode/decode
 */
module.exports = {
  encode,
  decode,
};
