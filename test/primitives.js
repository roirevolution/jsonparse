var test = require('tape');
var Parser = require('../');

test('primitives', function (t) {
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
    [ [ 0 ], 6.02e+26 ],
    [ [], [ 6.02e+26 ] ],
  ];

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
  p.write('[6.02e26]');

  t.end()
})

test('throws when attempting to parse an unsafely precise number without the parseNumbersAsStrings: true option', t => {
  try {
    const p = new Parser()

    p.write('[237123875683460923490127394]')
    t.fail()
  } catch(e) {
    t.assert(e.message.match(/unsafe to parse as a number/))

    t.end()
  }
})

test('parses numbers as string when passed parseNumbersAsStrings: true', function (t) {
  var expected = [
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
    [ [ 0 ], '-6.02e23' ],
    [ [], [ '-6.02e23' ] ],
    [ [ 0 ], '5.02e-500' ],
    [ [], [ '5.02e-500' ] ],
    [ [ 0 ], '-5.02e-500' ],
    [ [], [ '-5.02e-500' ] ],
    [ [ 0 ], '7161093205057351174'],
    [ [], ['7161093205057351174'] ],
    [ [ 0 ], '7161093205057351174.2189731287638'],
    [ [], ['7161093205057351174.2189731287638'] ],
    [ [ 0 ], '-2098379823648235784297340123721386'],
    [ [], ['-2098379823648235784297340123721386'] ],
    [ [ 0 ], '-2098379823648235784297340123721386.12983789123'],
    [ [], ['-2098379823648235784297340123721386.12983789123'] ],
    [ [ 0 ], '5e30' ],
    [ [], ['5e30'] ],
  ];
  var p = new Parser({parseNumbersAsStrings: true});
  p.onValue = function (value) {
    var keys = this.stack
      .slice(1)
      .map(function (item) { return item.key })
      .concat(this.key !== undefined ? this.key : [])
    ;
    t.deepEqual(
      [keys, value],
      expected.shift()
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
  p.write('[-6.02e23]');
  p.write('[5.02e-500]');
  p.write('[-5.02e-500]');
  p.write('[7161093205057351174]');
  p.write('[7161093205057351174.2189731287638]');
  p.write('[-2098379823648235784297340123721386]')
  p.write('[-2098379823648235784297340123721386.12983789123]')
  p.write('[5e30]')

  t.end()
});
