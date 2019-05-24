module.exports = function getGlobal () {
  var g

  if (typeof window !== 'undefined') {
    g = window
  } else {
    g = global
  }

  return g
}
