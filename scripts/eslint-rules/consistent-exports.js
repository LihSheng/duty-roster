/**
 * ESLint rule to enforce consistent export patterns
 */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce consistent export patterns',
      category: 'Stylistic Issues',
      recommended: false,
    },
    fixable: 'code',
    schema: [],
  },
  create: function (context) {
    const exportDeclarations = [];
    let hasDefaultExport = false;
    let hasNamedExports = false;

    return {
      // Track export declarations
      ExportDefaultDeclaration(node) {
        hasDefaultExport = true;
        exportDeclarations.push(node);
      },
      ExportNamedDeclaration(node) {
        hasNamedExports = true;
        exportDeclarations.push(node);
      },
      // Check at the end of the program
      'Program:exit': function (node) {
        // Check if exports are at the end of the file
        if (exportDeclarations.length > 0) {
          const lastExport = exportDeclarations[exportDeclarations.length - 1];
          const lastNode = node.body[node.body.length - 1];
          
          // If the last export is not the last statement in the file
          if (lastExport !== lastNode && lastNode.type !== 'ExportAllDeclaration') {
            const lastExportRange = lastExport.range;
            const lastNodeRange = lastNode.range;
            
            if (lastExportRange[1] < lastNodeRange[0]) {
              context.report({
                node: lastExport,
                message: 'All exports should be at the end of the file',
              });
            }
          }
        }
        
        // Check for mixing default and named exports in React component files
        if (hasDefaultExport && hasNamedExports) {
          const filename = context.getFilename();
          
          // Only apply this rule to component files (PascalCase filenames)
          if (/\/[A-Z][a-zA-Z0-9]*\.jsx?$/.test(filename)) {
            // Allow mixing if the named exports are constants or utility functions
            const hasNonConstantNamedExports = exportDeclarations.some(node => {
              if (node.type !== 'ExportNamedDeclaration') return false;
              
              // Check if this is a variable declaration
              if (node.declaration && node.declaration.type === 'VariableDeclaration') {
                // If it's not a const declaration, flag it
                if (node.declaration.kind !== 'const') return true;
                
                // Check if all variables are uppercase (constants)
                return node.declaration.declarations.some(decl => {
                  if (decl.id.type === 'Identifier') {
                    return !/^[A-Z_][A-Z0-9_]*$/.test(decl.id.name);
                  }
                  return true;
                });
              }
              
              // Check if this is a function declaration
              if (node.declaration && node.declaration.type === 'FunctionDeclaration') {
                // Allow utility functions (camelCase)
                return !/^[a-z][a-zA-Z0-9]*$/.test(node.declaration.id.name);
              }
              
              return false;
            });
            
            if (hasNonConstantNamedExports) {
              context.report({
                node: node,
                message: 'Avoid mixing default and named exports in component files except for constants and utility functions',
              });
            }
          }
        }
      }
    };
  }
};