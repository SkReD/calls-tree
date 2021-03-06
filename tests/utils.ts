const _eval = require('eval')
const vm = require('vm')

export function evalCode ({ code, filename = 'test.js' }: { code: string, filename: string }) {
  const windowScope = { test: 1 }
  const script = new vm.Script(code)
  const scope = Object.assign({ require: require }, global)
  const ctx = vm.createContext(scope)
  script.runInNewContext(ctx)

  const stack = ctx.global.__calls_stack__

  delete ctx.global.__calls_stack__

  return stack
}
