import * as t from '@babel/types'

export function getFnEnterTrackCode(generateUidIdentifier) {
    t.variableDeclaration('let', t.variableDeclarator(t.identifier(generateUidIdentifier('callStack'))))
    return t.assignmentExpression(
      '=',
      t.parenthesizedExpression(
        t.logicalExpression('||', t.identifier('window'), t.identifier('global'))
      )
    )
}
