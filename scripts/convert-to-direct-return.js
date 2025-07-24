/**
 * Script to convert simple React components to use direct return syntax
 */

const fs = require('fs');
const path = require('path');

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

// Function to convert simple components to use direct return syntax
const convertToDirectReturn = (content) => {
  // Regex to match arrow functions with a simple return statement
  // This regex looks for arrow functions that have a block body with just a return statement
  const simpleComponentRegex = /const\s+(\w+)\s*=\s*\(([^)]*)\)\s*=>\s*{\s*return\s+(\([^;]*\)|<[^;]*>)\s*;\s*}/g;
  
  return content.replace(simpleComponentRegex, 'const $1 = ($2) => $3');
};

// Process all JavaScript files
const processFiles = () => {
  console.log('Converting components to use direct return syntax...');
  
  // Get all JS files in the project
  const jsFiles = getJsFiles('./frontend/src');
  
  let modifiedCount = 0;
  
  jsFiles.forEach((filePath) => {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;
      
      // Convert to direct return syntax
      content = convertToDirectReturn(content);
      
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
  
  console.log(`Conversion complete. Modified ${modifiedCount} files.`);
};

// Run the script
processFiles();