function resolveStatic(path) {
  return require('path').join(__dirname, '..', path).replace(/\\/g, '\\\\')
}

exports.resolveStatic = resolveStatic