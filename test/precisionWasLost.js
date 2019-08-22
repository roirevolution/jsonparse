const precisionWasLost = require('../precisionHelper')
const test = require('tape');

const valuesToTest = [
  {
    jsonNumber: '123908471290347091237490182734091237',
    expected: true,
    description: 'precision is lost for an unsafely precise positive integer'
  },
  {
    jsonNumber: '12390847129',
    expected: false,
    description: 'precision is not lost for a safely precise positive integer'
  },
  {
    jsonNumber: '-123908471290347091237490182734091237',
    expected: true,
    description: 'precision is lost for an unsafely precise negative integer'
  },
  {
    jsonNumber: '23442.128312312830128391',
    expected: true,
    description: 'precision is lost for an unsafely precise value in decimal notation'
  },
  {
    jsonNumber: '5.32984123409845092323404e7',
    expected: true,
    description: 'precision is lost for an unsafely precise value in floating point notation'
  },
  {
    jsonNumber: '5.32987e+50',
    expected: false,
    description: 'precision is not lost for a safely precise value in floating point notation with a large exponent'
  },
  {
    jsonNumber: '5.32984123409845092323404e-7',
    expected: true,
    description: 'precision is lost for an unsafely precise value in floating point notation with a negative exponent'
  },
  {
    jsonNumber: '5.32987e-50',
    expected: false,
    description: 'precision is not lost for a safely precise value in floating point notation with a large negative exponent'
  },
  {
    jsonNumber: '5.98e10000',
    expected: true,
    description: 'precision is lost for a number that is too large (parses to infinity)'
  },
  {
    jsonNumber: '-5.98e10000',
    expected: true,
    description: 'precision is lost for a negative number that is too large (parses to -infinity)'
  },
  {
    jsonNumber: '5.98e-10000',
    expected: true,
    description: 'precision is lost for a number that is too small'
  },
  {
    jsonNumber: '100000000000000000000000010000',
    expected: true,
    description: 'precision is lost for a number that mostly zeros with just 2 ones'
  },
  {
    jsonNumber: `5.2e${Array(1000).fill('1').join('')}`,
    expected: true,
    description: 'precision is lost when the exponent is too large for node to store'
  },
  {
    jsonNumber: `5.2e1000000`,
    expected: true,
    description: 'precision is lost when the exponent is over 20 bits'
  },
  {
    jsonNumber: `5.2e09`,
    expected: false,
    description: 'precision is not lost for a safely precise number where the exponent starts with a leading 0'
  },
]

test('precisionWasLost accurately detects loss of precision when a number represented as a string is parsed to a javascript number', t => {
  valuesToTest.forEach(value => {
    t.strictEqual(precisionWasLost(value.jsonNumber, Number(value.jsonNumber)), value.expected, value.description)
  })

  t.end()
})
