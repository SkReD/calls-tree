const path = require('path')

const testFilePath = `${path.join(__dirname, '..', 'test.js')}`;
export const singleFunction = `"use strict";var _callsTree=require("calls-tree");function oneFn(){(0,_callsTree.pushCall)("oneFn",null,"${testFilePath}")(0,_callsTree.popCall)()};oneFn();`
export const nestedCalls = `"use strict";var _callsTree=require("calls-tree");function second(){(0,_callsTree.pushCall)("second",null,"${testFilePath}")(0,_callsTree.popCall)()};function oneFn(){_pushCall("oneFn",null,"${testFilePath}")second();_popCall()};oneFn();`
