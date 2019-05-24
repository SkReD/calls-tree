const { expect } = require('chai')
const { transformSync } = require('@babel/core')
const { babelPlugin } = require('../src/index.ts')
const { singleFunction, nestedCalls } = require('./expectedValues')

const transformOptions = {
  plugins: [
    babelPlugin,
  ],
  filename: 'test.js',
  compact: true,
}

describe('Plugin', function () {
  it('should instrument single function call', () => {
    const code = 'function oneFn() {}; oneFn();'
    const { code: resultCode } = transformSync(code, transformOptions)

    expect(resultCode.replace(/\\\\/g, '\\')).to.equal(singleFunction)
  })

  it('should instrument nested function calls', () => {
    const code = 'function second() {}; function oneFn() { second() }; oneFn();'
    const { code: resultCode } = transformSync(code, transformOptions)

    expect(resultCode.replace(/\\\\/g, '\\')).to.equal(nestedCalls)
  })
})
