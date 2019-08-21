var JsonParse = require('../jsonparse');
var test = require('tape');

const { precisionWasLost } = JsonParse.testing
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
    jsonNumber: '-123908471290',
    expected: false,
    description: 'precision is not lost for a safely precise negative integer'
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
    jsonNumber: '5.32987e50',
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
]

test('precisionWasLost accurately detects loss of precision when a number represented as a string is parsed to a javascript number', t => {
  valuesToTest.forEach(value => {
    t.assert(precisionWasLost(value.jsonNumber, Number(value.jsonNumber)) === value.expected, value.description)
  })

  t.end()
})
