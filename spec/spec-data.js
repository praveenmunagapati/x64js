var specData = module.exports = {};
var fs = require('fs');

specData.program = function(name) {
  var path = __dirname + '/data/'+name+'.asm';
  var str = fs.readFileSync(path, 'utf8');
  var notEmpty = function(x) { return x.length > 0;};
  var program = str.split('\n').filter(notEmpty);
  return program;
};
