export function getFunctionName (path) {
  return path.node.id.name
}

export function getFileName (pluginPass) {
  return pluginPass.file.opts.filename
}
