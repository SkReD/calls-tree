const { expect } = require('chai')
const { transformSync } = require('@babel/core')
const { babelPlugin } = require('../src/index.ts')
const { singleFunction, nestedCalls } = require('./expectedValues')
const { evalCode } = require('./utils')

const transformOptions = {
  plugins: [
    babelPlugin,
  ],
  filename: 'test.js',
  compact: true,
}

describe('Plugin', function () {
  it('should provide valid callStack', () => {
    const code = 'function oneFn() {}; oneFn();'
    const { code: resultCode } = transformSync(code, transformOptions)

    const globalScope = evalCode({ code: resultCode })
    debugger;
  })
})
