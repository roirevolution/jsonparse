var JsonParse = require('../jsonparse');
var test = require('tape');

const {precisionWasLost} = JsonParse.testing

test('determines that precision is lost for an unsafely precise positive integer', t => {
  const jsonString = '123908471290347091237490182734091237'
  t.assert(precisionWasLost(jsonString, Number(jsonString)))

  t.end()
})

test('determines that precision is not lost for a safely precise positive integer', t => {
  const jsonString = '12390847129'
  t.assert(!precisionWasLost(jsonString, Number(jsonString)))

  t.end()
})

test('determines that precision is lost for an unsafely precise negative integer', t => {
  const jsonString = '-123908471290347091237490182734091237'
  t.assert(precisionWasLost(jsonString, Number(jsonString)))

  t.end()
})

test('determines that precision is not lost for a safely precise negative integer', t => {
  const jsonString = '-123908471290'
  t.assert(!precisionWasLost(jsonString, Number(jsonString)))

  t.end()
})

test('determines that precision is lost for an unsafely precise value in decimal notation', t => {
  const jsonString = '23442.128312312830128391'
  t.assert(precisionWasLost(jsonString, Number(jsonString)))

  t.end()
})

test('determines that precision is lost for an unsafely precise value in floating point notation', t => {
  const jsonString = '5.32984123409845092323404e7'
  t.assert(precisionWasLost(jsonString, Number(jsonString)))

  t.end()
})

test('determines that precision is not lost for a safely precise value in floating point notation with a large exponent', t => {
  const jsonString = '5.32987e50'
  t.assert(!precisionWasLost(jsonString, Number(jsonString)))

  t.end()
})

test('determines that precision is lost for an unsafely precise value in floating point notation with a negative exponent', t => {
  const jsonString = '5.32984123409845092323404e-7'
  t.assert(precisionWasLost(jsonString, Number(jsonString)))

  t.end()
})

test('determines that precision is not lost for a safely precise value in floating point notation with a large exponent', t => {
  const jsonString = '5.32987e-50'
  t.assert(!precisionWasLost(jsonString, Number(jsonString)))

  t.end()
})

test('determines that precision is lost for a number that is too large (parses to infinity)', function (t) {
  const jsonString = '5.98e10000'
  t.assert(precisionWasLost(jsonString, Number(jsonString)))

  t.end()
})


