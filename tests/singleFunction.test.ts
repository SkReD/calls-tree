const { expect } = require('chai')
const { transformSync } = require('@babel/core')
const { instrument, babelPlugin } = require('../src/index.ts')

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

    expect(resultCode).to.include('function oneFn(){"before";}')
  })
})
