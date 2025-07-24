/**
 * ESLint rule to enforce direct return syntax for simple components
 */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce direct return syntax for simple components',
      category: 'Stylistic Issues',
      recommended: false,
    },
    fixable: 'code',
    schema: [],
  },
  create: function (context) {
    return {
      ArrowFunctionExpression(node) {
        // Only check arrow functions with block bodies
        if (node.body.type !== 'BlockStatement') {
          return;
        }

        const body = node.body.body;
        
        // Check if the function body consists of a single return statement
        if (body.length === 1 && body[0].type === 'ReturnStatement') {
          const returnStatement = body[0];
          
          // Check if the return statement has a JSX expression
          if (returnStatement.argument && 
              (returnStatement.argument.type === 'JSXElement' || 
               returnStatement.argument.type === 'JSXFragment')) {
            
            context.report({
              node,
              message: 'Use direct return syntax for simple components',
              fix: function (fixer) {
                const sourceCode = context.getSourceCode();
                const arrowToken = sourceCode.getTokenBefore(node.body);
                const blockStart = sourceCode.getTokenAfter(arrowToken);
                const blockEnd = sourceCode.getLastToken(node.body);
                const returnToken = sourceCode.getFirstToken(returnStatement);
                
                // Replace "=> { return jsx; }" with "=> (jsx)"
                return [
                  fixer.replaceTextRange([arrowToken.range[1], returnToken.range[1]], ' ('),
                  fixer.replaceTextRange([returnStatement.argument.range[1], blockEnd.range[1]], ')')
                ];
              }
            });
          }
        }
      }
    };
  }
};