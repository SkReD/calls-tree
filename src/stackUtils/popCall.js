var getGlobal = require('./getGlobal')

module.exports.popCall = function popCall () {
  var g = getGlobal()

  g.__calls_depth__--
}
