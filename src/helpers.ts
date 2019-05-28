import * as t from '@babel/types'

let anonymousFnId = 1

export function getFunctionNameNode (path: any) {
  let stringName
  let node

  // maybe its named
  if (path.node.id) {
    stringName = path.node.id.name
  }

  // or it created at initialization of variable
  if (path.container.type === 'VariableDeclarator') {
    stringName = path.container.id.name
  }

  // or created when assigned to...
  if (path.container.type === 'AssignmentExpression') {
    // ...identifier
    if (path.container.left.type === 'Identifier') {
      stringName = path.container.left.name
    }

    // ..member expression with
    if (path.container.left.type === 'MemberExpression') {
      // ... string key
      if (path.container.left.property.type === 'StringLiteral') {
        stringName = path.container.left.property.value
      }

      // ... computed key
      if (path.container.left.computed) {
        node = path.container.left.property
      } else {
        if (path.container.left.property.type === 'Identifier') {
          stringName = path.container.left.property.name
        }
      }
    }
  }

  // or is value of object property
  if (path.container.type === 'ObjectProperty') {
    stringName = path.container.key.name
  }

  if (node) {
    return node
  }

  if (!stringName) {
    stringName = `anonymousFn_${anonymousFnId++}`
  }

  return t.stringLiteral(stringName)
}

export function getFileName (pluginPass: any) {
  return pluginPass.file.opts.filename
}
