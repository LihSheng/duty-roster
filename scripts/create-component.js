/**
 * Component Generator Script
 * 
 * This script creates a new React component based on templates.
 * Usage: node scripts/create-component.js [component-name] [component-type] [directory]
 * 
 * Example: 
 * - node scripts/create-component.js Button functional components/common/ui
 * - node scripts/create-component.js UserProfile container components/users
 * - node scripts/create-component.js useAuth hook hooks
 */

const fs = require('fs');
const path = require('path');

// Get command line arguments
const [, , componentName, componentType = 'functional', directory = 'components'] = process.argv;

if (!componentName) {
  console.error('Please provide a component name');
  console.log('Usage: node scripts/create-component.js [component-name] [component-type] [directory]');
  console.log('Component types: functional, container, hook');
  process.exit(1);
}

// Ensure first letter is uppercase for component names
const formattedName = componentName.charAt(0).toUpperCase() + componentName.slice(1);

// Define template paths
const templatesDir = path.join(__dirname, '..', 'frontend', 'src', 'components', 'templates');
const templateMap = {
  functional: path.join(templatesDir, 'FunctionalComponent.js'),
  container: path.join(templatesDir, 'ContainerComponent.js'),
  hook: path.join(templatesDir, 'CustomHook.js'),
};

// Get the appropriate template
const templatePath = templateMap[componentType.toLowerCase()];
if (!templatePath) {
  console.error(`Invalid component type: ${componentType}`);
  console.log('Available types: functional, container, hook');
  process.exit(1);
}

// Create the target directory if it doesn't exist
const targetDir = path.join(__dirname, '..', 'frontend', 'src', directory);
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
  console.log(`Created directory: ${targetDir}`);
}

// Create the component file
const targetPath = path.join(targetDir, `${formattedName}.js`);
let templateContent = fs.readFileSync(templatePath, 'utf8');

// Replace template placeholders
if (componentType.toLowerCase() === 'hook') {
  // For hooks, replace useComponentLogic with useComponentName
  templateContent = templateContent.replace(/useComponentLogic/g, `use${formattedName}`);
} else {
  // For components, replace ComponentName with the actual name
  templateContent = templateContent.replace(/ComponentName/g, formattedName);
  
  // For container components, replace ComponentContainer with ComponentNameContainer
  if (componentType.toLowerCase() === 'container') {
    templateContent = templateContent.replace(/ComponentContainer/g, `${formattedName}Container`);
  }
}

// Write the file
fs.writeFileSync(targetPath, templateContent);
console.log(`Created component: ${targetPath}`);

// Create a test file
const testDir = path.join(targetDir, '__tests__');
if (!fs.existsSync(testDir)) {
  fs.mkdirSync(testDir, { recursive: true });
  console.log(`Created test directory: ${testDir}`);
}

const testPath = path.join(testDir, `${formattedName}.test.js`);
const testContent = `import React from 'react';
import { render, screen } from '@testing-library/react';
import ${formattedName}${componentType.toLowerCase() === 'container' ? 'Container' : ''} from '../${formattedName}';

describe('${formattedName}', () => {
  test('renders correctly', () => {
    // Add your test implementation here
    ${componentType.toLowerCase() !== 'hook' ? `render(<${formattedName}${componentType.toLowerCase() === 'container' ? 'Container' : ''} ${componentType.toLowerCase() === 'container' ? 'initialData="test"' : 'propName="test"'} />);` : '// For hooks, import the hook and test its behavior'}
    ${componentType.toLowerCase() !== 'hook' ? "expect(screen.getByText(/test/i)).toBeInTheDocument();" : '// Example: const { result } = renderHook(() => useFormattedName("initialValue"));'}
  });
});
`;

fs.writeFileSync(testPath, testContent);
console.log(`Created test file: ${testPath}`);

console.log(`\nComponent ${formattedName} created successfully!`);
console.log(`\nUsage:`);
if (componentType.toLowerCase() === 'hook') {
  console.log(`import { use${formattedName} } from '${directory}/${formattedName}';`);
  console.log(`\nconst { value, updateValue } = use${formattedName}('initialValue');`);
} else {
  console.log(`import { ${formattedName} } from '${directory}/${formattedName}';`);
  console.log(`\n<${formattedName} ${componentType.toLowerCase() === 'container' ? 'initialData="value"' : 'propName="value"'} />`);
}