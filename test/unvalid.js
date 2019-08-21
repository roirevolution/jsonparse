var test = require('tape');
var Parser = require('../');

test('unvalid', function (t) {
  var count = 0;

  var p = new Parser();
  p.onError = function (value) {
    count++;
    t.equal(1, count);
    t.end();
  };

  p.write('{"test": eer[');
});

test('valueless keys', function (t) {
  try {
    var p = new Parser();

    p.write('{"test1": ,"test2":"value2"');
  } catch(e){
    t.assert(e.message.match(/Unexpected COMMA/))

    t.end()
  }
})

test('invlalid characters in number', function (t) {
  try {
    var p = new Parser();

    p.write('{"test1": 123hi ,"test2":"value2"');
  } catch(e){
    t.assert(e.message.match(/Unexpected \"h\"/))

    t.end()
  }
})
