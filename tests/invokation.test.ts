const { expect } = require('chai')
const { transformSync } = require('@babel/core')
const { babelPlugin } = require('../src/index.ts')
const transformModulesCommonJsPlugin = require('@babel/plugin-transform-modules-commonjs')
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

  // not ast because its broken in such way that transform only first usage of imported value
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
    const stack = evalCode({ code: transform(code) })

    expect(stack).to.containSubset([
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

    const stack = evalCode({ code: transform(code) })

    expect(stack).to.containSubset([
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

    const stack = evalCode({ code: transform(code) })

    expect(stack).to.containSubset([
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

  it('should find name for anonymous function if possible', () => {
    const codes = [
      'let oneFn; oneFn = function () { secondFn(); }; function secondFn() {}; oneFn();',
      'let oneFn = function () { secondFn(); }; function secondFn() {}; oneFn();',
      'const obj = { oneFn: function () { secondFn(); } }; function secondFn() {}; obj.oneFn();',
      'const obj = {}; obj.oneFn = function () { secondFn(); }; function secondFn() {}; obj.oneFn();',
      'const obj = {}; obj["oneFn"] = function () { secondFn(); }; function secondFn() {}; obj.oneFn();',
      'const obj = {}; const key = "oneFn"; obj[key] = function () { secondFn(); }; function secondFn() {}; obj.oneFn();',
      'const obj = { key: "oneFn" }; obj[obj.key] = function () { secondFn(); }; function secondFn() {}; obj.oneFn();',
    ]

    codes.forEach((code) => {
      const stack = evalCode({ code: transform(code) })

      expect(stack, code).to.containSubset([
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
  })

  it('should write anonymous placeholder for function, which name cannot be determined', () => {
    const codes = [
      '(function () { secondFn(); })(); function secondFn() {};',
    ]

    codes.forEach((code) => {
      const stack = evalCode({ code: transform(code) })

      expect(stack, code).to.containSubset([
        {
          fnName: '',
          stack: [
            {
              fnName: 'anonymousFn_1',
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

  it.skip('should detect function name when provided as argument', () => {
    const codes = [
      'function wrapFn(oneFn){ oneFn() }; wrapFn(function () { secondFn(); }); function secondFn() {};',
    ]

    codes.forEach((code) => {
      const stack = evalCode({ code: transform(code) })

      expect(stack, code).to.containSubset([
        {
          fnName: '',
          stack: [
            {
              fnName: 'wrapFn',
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
          ],
        },
      ])
    })
  })
})
