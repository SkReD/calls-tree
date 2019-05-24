import { CallStack } from '../types/callStack'

export default function report (stack: CallStack) {
  console.log(stack[0].fnName)
}
