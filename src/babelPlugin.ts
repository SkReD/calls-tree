import * as t from '@babel/types'

export default function() {
    return {
        visitor: {
            Function(path) {
                path.get('body').unshiftContainer('body', t.expressionStatement(t.stringLiteral('before')));
            }
        }
    };
}
