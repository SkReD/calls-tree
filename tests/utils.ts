const _eval = require('eval')

export function evalCode ({ code, filename = 'test.js' }: { code: string, filename: string }) {
  const windowScope = {}

  _eval(code, filename, { window: windowScope }, true)

  return windowScope
}
