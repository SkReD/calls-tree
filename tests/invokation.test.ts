const { expect } = require('chai')
const { transformSync, transformFromAstSync } = require('@babel/core')
const { babelPlugin } = require('../src/index.ts')
const transformModulesCommonJsPlugin = require('@babel/plugin-transform-modules-commonjs')
const { singleFunction, nestedCalls } = require('./expectedValues')
const { evalCode } = require('./utils')

const transform = (code: string) => {
  const transformOptions = {
    babelrc: false,
    configFile: false,
    filename: 'test.js',
  }

  const { code: tempCode } = transformSync(code, {
    ...transformOptions,
    plugins: [
      babelPlugin,
    ],
  })

  const { code: resultCode } = transformSync(tempCode, {
    ...transformOptions,
    plugins: [
      transformModulesCommonJsPlugin,
    ],
  })

  return resultCode
}

describe('Plugin', function () {
  it('should provide valid callStack for single call', () => {
    const code = 'function oneFn() {}; oneFn();'
    const globalScope = evalCode({ code: transform(code) })

    expect(globalScope.__calls_stack__).to.containSubset([
      {
        fnName: '',
        stack: [
          {
            fnName: 'oneFn',
            stack: [],
          },
        ],
      },
    ])
  })

  it('should provide valid callStack for nested calls', () => {
    const code = 'function oneFn() { secondFn(); }; function secondFn() {}; oneFn();'

    const globalScope = evalCode({ code: transform(code) })

    expect(globalScope.__calls_stack__).to.containSubset([
      {
        fnName: '',
        stack: [
          {
            fnName: 'oneFn',
            stack: [{
              fnName: 'secondFn',
              stack: [],
            }],
          },
        ],
      },
    ])
  })

  it('should provide valid callStack for repetitive calls', () => {
    const code = 'function oneFn() { secondFn(); }; function secondFn() {}; oneFn(); oneFn();'

    const globalScope = evalCode({ code: transform(code) })

    expect(globalScope.__calls_stack__).to.containSubset([
      {
        fnName: '',
        stack: [
          {
            fnName: 'oneFn',
            stack: [{
              fnName: 'secondFn',
              stack: [],
            }],
          },
          {
            fnName: 'oneFn',
            stack: [{
              fnName: 'secondFn',
              stack: [],
            }],
          },
        ],
      },
    ])
  })
})
