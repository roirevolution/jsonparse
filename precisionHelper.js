/**
 * determines if precision is lost when parsing the JSON representation of a number to a javascript number
 * @param {string} jsonNumber
 * @param {number} javascriptNumber
 * @return {boolean}
 */
function precisionWasLost (jsonNumber, javascriptNumber) {
  return getSignificand(jsonNumber) !== getSignificand(JSON.stringify(javascriptNumber))
}

/**
 * Takes in a JSON represention of a number and returns its significand
 * https://en.wikipedia.org/wiki/Significand
 * @param {string} numberString a string representation of a number following the JSON specification
 * @return {string}
 */
function getSignificand(numberString) {
  return numberString
    .replace(/\./, '') // drops the dot if it exists
    .replace(/^-?0?/, '') // drops leading negative sign and and leading 0's if present
    .replace(/[eE].*$/, '') // drops all exponent information
    .replace(/0*$/, '') // drops trailing zeros
}

module.exports = precisionWasLost
