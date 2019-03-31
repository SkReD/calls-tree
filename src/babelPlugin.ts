import * as t from '@babel/types'
import * as h from './helpers'

type FunctionPassContext = { filename: string, pushCallIdentifier: t.Expression, popCallIdentifier: t.Expression }

const programBodyVisitor = {
  Function (this: FunctionPassContext, path: any) {
    path.get('body').unshiftContainer('body',
      t.callExpression(this.pushCallIdentifier, [
        t.stringLiteral(h.getFunctionName(path)),
        t.nullLiteral(),
        t.stringLiteral(this.filename),
      ])
    )

    path.get('body').pushContainer('body', t.emptyStatement())

    path.get('body').pushContainer('body',
      t.callExpression(this.popCallIdentifier, [])
    )
  },
}

export default function () {
  return {
    visitor: {
      Program (path: any) {
        const pushCallIdentifier = path.scope.generateUidIdentifier('pushCall')
        const popCallIdentifier = path.scope.generateUidIdentifier('popCall')

        path.container.program.body.unshift(t.importDeclaration(
          [
            t.importSpecifier(pushCallIdentifier, t.identifier('pushCall')),
            t.importSpecifier(popCallIdentifier, t.identifier('popCall')),
          ],
          t.stringLiteral('calls-tree')
        ))

        path.traverse(programBodyVisitor, {
          pushCallIdentifier,
          popCallIdentifier,
          filename: h.getFileName(this),
        } as FunctionPassContext)
      },
    },
  }
}
