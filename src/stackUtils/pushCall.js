var getGlobal = require('./getGlobal')

module.exports.pushCall = function pushCall (fnName, className, filename) {
  var g = getGlobal()
  var stack = g.__calls_stack__ || [{
    fnName: '',
    className: '',
    stack: [],
  }]
  g.__calls_stack__ = stack

  var depth = g.__calls_depth__ || 0
  g.__calls_depth__ = depth

  var currentStack = stack
  for (var i = 0; i <= depth; i++) {
    currentStack = currentStack[currentStack.length - 1].stack
  }
  currentStack.push({
    filename: filename,
    fnName: fnName,
    className: className,
    stack: [],
  })
}
