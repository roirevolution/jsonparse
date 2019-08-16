var test = require('tape');
var Parser = require('../');

var expected = [
  [ [], '' ],
  [ [], 'Hello' ],
  [ [], 'This"is' ],
  [ [], '\r\n\f\t\\/"' ],
  [ [], 'Λάμβδα' ],
  [ [], '\\' ],
  [ [], '/' ],
  [ [], '"' ],
  [ [ 0 ], 0 ],
  [ [ 1 ], 1 ],
  [ [ 2 ], -1 ],
  [ [], [ 0, 1, -1 ] ],
  [ [ 0 ], 1 ],
  [ [ 1 ], 1.1 ],
  [ [ 2 ], -1.1 ],
  [ [ 3 ], -1 ],
  [ [], [ 1, 1.1, -1.1, -1 ] ],
  [ [ 0 ], -1 ],
  [ [], [ -1 ] ],
  [ [ 0 ], -0.1 ],
  [ [], [ -0.1 ] ],
  [ [ 0 ], 6.02e+10 ],
  [ [], [ 6.02e+10 ] ],
];

var stringExpected = [
  [ [], '' ],
  [ [], 'Hello' ],
  [ [], 'This"is' ],
  [ [], '\r\n\f\t\\/"' ],
  [ [], 'Λάμβδα' ],
  [ [], '\\' ],
  [ [], '/' ],
  [ [], '"' ],
  [ [ 0 ], '0' ],
  [ [ 1 ], '1' ],
  [ [ 2 ], '-1' ],
  [ [], [ '0', '1', '-1' ] ],
  [ [ 0 ], '1.0' ],
  [ [ 1 ], '1.1' ],
  [ [ 2 ], '-1.1' ],
  [ [ 3 ], '-1.0' ],
  [ [], [ '1.0', '1.1', '-1.1', '-1.0' ] ],
  [ [ 0 ], '-1' ],
  [ [], [ '-1' ] ],
  [ [ 0 ], '-0.1' ],
  [ [], [ '-0.1' ] ],
  [ [ 0 ], '6.02e23' ],
  [ [], [ '6.02e23' ] ],
  [ [ 0 ], '7161093205057351174' ],
  [ [], [ '7161093205057351174'] ]
];

test('primitives', function (t) {
  t.plan(23);

  var p = new Parser();
  p.onValue = function (value) {
    var keys = this.stack
      .slice(1)
      .map(function (item) { return item.key })
      .concat(this.key !== undefined ? this.key : [])
    ;
    t.deepEqual(
      [ keys, value ],
      expected.shift()
    );
  };

  p.write('"""Hello""This\\"is""\\r\\n\\f\\t\\\\\\/\\""');
  p.write('"\\u039b\\u03ac\\u03bc\\u03b2\\u03b4\\u03b1"');
  p.write('"\\\\"');
  p.write('"\\/"');
  p.write('"\\""');
  p.write('[0,1,-1]');
  p.write('[1.0,1.1,-1.1,-1.0][-1][-0.1]');
  p.write('[6.02e10]');
});

test('will emit an error if it attempts to parse a number that is too large', function (t) {
  try {
    var p = new Parser();

    p.write('[7161093205057351174]')

    t.fail('Incorrectly attempted to parse unsafe large number')
  } catch (e) {
    t.assert(e.message.includes(`unsafe to parse as a number`))
    t.end()
  }
});

test('will emit an error if it attempts to parse an integer that is too small', function (t) {
  try {
    var p = new Parser();

    p.write('[-9007199254740992]')

    t.fail('Incorrectly attempted to parse unsafe small number')
  } catch (e) {
    t.assert(e.message.includes(`unsafe to parse as a number`))
    t.end()
  }
});

test('parses numbers as string when passed parseNumbersAsStrings: true', function (t) {
  var p = new Parser({parseNumbersAsStrings: true});
  p.onValue = function (value) {
    var keys = this.stack
      .slice(1)
      .map(function (item) { return item.key })
      .concat(this.key !== undefined ? this.key : [])
    ;
    t.deepEqual(
      [keys, value],
      stringExpected.shift()
    )
  };

  p.write('"""Hello""This\\"is""\\r\\n\\f\\t\\\\\\/\\""');
  p.write('"\\u039b\\u03ac\\u03bc\\u03b2\\u03b4\\u03b1"');
  p.write('"\\\\"');
  p.write('"\\/"');
  p.write('"\\""');
  p.write('[0,1,-1]');
  p.write('[1.0,1.1,-1.1,-1.0][-1][-0.1]');
  p.write('[6.02e23]');
  p.write('[7161093205057351174]');

  t.end()
});
