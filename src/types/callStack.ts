export type StackItem = {
  filename: string,
  fnName: string,
  className: string,
  stack: CallStack,
}

export type CallStack = Array<StackItem>
