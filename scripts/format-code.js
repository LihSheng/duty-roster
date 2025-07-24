/**
 * Script to format JavaScript files according to our coding standards
 * - Add blank line before return statements
 * - Ensure arrow functions are used instead of function expressions
 * - Keep parentheses around arrow function parameters
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Function to recursively get all JavaScript files
const getJsFiles = (dir, fileList = []) => {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory() && !filePath.includes('node_modules')) {
      fileList = getJsFiles(filePath, fileList);
    } else if (
      stat.isFile() &&
      (file.endsWith('.js') || file.endsWith('.jsx')) &&
      !filePath.includes('node_modules')
    ) {
      fileList.push(filePath);
    }
  });

  return fileList;
};

// Function to add blank line before return statements
const addBlankLineBeforeReturn = (content) => {
  // Regex to match return statements not preceded by a blank line
  const returnRegex = /(\S+\s*)\n(\s+return\s)/g;

  return content.replace(returnRegex, '$1\n\n$2');
};

// Process all JavaScript files
const processFiles = () => {
  console.log('Formatting JavaScript files...');

  // Get all JS files in the project
  const jsFiles = getJsFiles('.');

  let modifiedCount = 0;

  jsFiles.forEach((filePath) => {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;

      // Add blank line before return statements
      content = addBlankLineBeforeReturn(content);

      // Write back if modified
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        modifiedCount++;
        console.log(`Modified: ${filePath}`);
      }
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error.message);
    }
  });

  console.log(`Formatting complete. Modified ${modifiedCount} files.`);

  // Run Prettier to handle other formatting
  try {
    console.log('Running Prettier...');
    execSync('npx prettier --write "**/*.{js,jsx,json,md}"', { stdio: 'inherit' });
  } catch (error) {
    console.error('Error running Prettier:', error.message);
  }
};

// Run the script
processFiles();
