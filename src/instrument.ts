import * as t from '@babel/types'

export function getFnEnterTrackCode (generateUidIdentifier: Function) {
  const enterVar = t.identifier(generateUidIdentifier('callStack'))
  t.variableDeclaration('let', [t.variableDeclarator(enterVar)])
  return t.assignmentExpression(
    '=',
    enterVar,
    t.parenthesizedExpression(
      t.logicalExpression('||', t.identifier('window'), t.identifier('global'))
    )
  )
}
