/**
 * Visual Consistency Checker
 * 
 * This utility helps verify visual consistency across all reusable components
 * by checking for consistent use of colors, typography, spacing, and responsive design.
 */

import React from 'react';
import { render } from '@testing-library/react';

// Import all components to check
import Button from '../ui/Button';
import TextInput from '../ui/TextInput';
import Select from '../ui/Select';
import Checkbox from '../ui/Checkbox';
import TextArea from '../ui/TextArea';
import LoadingIndicator from '../ui/LoadingIndicator';
import FormGroup from '../ui/FormGroup';
import FormLabel from '../ui/FormLabel';
import FormError from '../ui/FormError';
import BaseModal from '../modal/BaseModal';
import ModalHeader from '../modal/ModalHeader';
import ModalBody from '../modal/ModalBody';
import ModalFooter from '../modal/ModalFooter';

/**
 * Color scheme consistency checker
 */
export const checkColorConsistency = () => {
  const results = {
    passed: [],
    failed: [],
    warnings: []
  };

  // Define expected color patterns
  const colorPatterns = {
    primary: /bg-primary-\d+|text-primary-\d+|border-primary-\d+|ring-primary-\d+/,
    secondary: /bg-light-\d+|bg-gray-\d+/,
    danger: /bg-danger-\d+|text-danger-\d+|border-danger-\d+/,
    success: /bg-success-\d+|text-success-\d+|border-success-\d+/,
    dark: /dark:/
  };

  // Test components for color consistency
  const testCases = [
    {
      name: 'Primary Button',
      component: <Button variant="primary">Test</Button>,
      expectedPatterns: [colorPatterns.primary, colorPatterns.dark]
    },
    {
      name: 'Secondary Button',
      component: <Button variant="secondary">Test</Button>,
      expectedPatterns: [colorPatterns.secondary, colorPatterns.dark]
    },
    {
      name: 'Danger Button',
      component: <Button variant="danger">Test</Button>,
      expectedPatterns: [colorPatterns.danger, colorPatterns.dark]
    },
    {
      name: 'Success Button',
      component: <Button variant="success">Test</Button>,
      expectedPatterns: [colorPatterns.success, colorPatterns.dark]
    },
    {
      name: 'TextInput',
      component: <TextInput id="test" name="test" value="" onChange={() => {}} />,
      expectedPatterns: [colorPatterns.primary, colorPatterns.dark]
    },
    {
      name: 'Select',
      component: <Select id="test" name="test" value="" onChange={() => {}} options={[]} />,
      expectedPatterns: [colorPatterns.primary, colorPatterns.dark]
    },
    {
      name: 'Checkbox',
      component: <Checkbox id="test" name="test" checked={false} onChange={() => {}} />,
      expectedPatterns: [colorPatterns.primary, colorPatterns.dark]
    },
    {
      name: 'TextArea',
      component: <TextArea id="test" name="test" value="" onChange={() => {}} />,
      expectedPatterns: [colorPatterns.primary, colorPatterns.dark]
    }
  ];

  testCases.forEach(testCase => {
    try {
      const { container } = render(testCase.component);
      const element = container.firstChild;
      const className = element.className;

      let allPatternsFound = true;
      const missingPatterns = [];

      testCase.expectedPatterns.forEach(pattern => {
        if (!pattern.test(className)) {
          allPatternsFound = false;
          missingPatterns.push(pattern.toString());
        }
      });

      if (allPatternsFound) {
        results.passed.push({
          component: testCase.name,
          message: 'All expected color patterns found'
        });
      } else {
        results.failed.push({
          component: testCase.name,
          message: `Missing color patterns: ${missingPatterns.join(', ')}`,
          className
        });
      }
    } catch (error) {
      results.failed.push({
        component: testCase.name,
        message: `Error rendering component: ${error.message}`
      });
    }
  });

  return results;
};

/**
 * Typography consistency checker
 */
export const checkTypographyConsistency = () => {
  const results = {
    passed: [],
    failed: [],
    warnings: []
  };

  // Define expected typography patterns
  const typographyPatterns = {
    responsive: /text-\w+.*sm:text-\w+/,
    fontWeight: /font-\w+/
  };

  const testCases = [
    {
      name: 'Small Button',
      component: <Button size="small">Test</Button>,
      expectedText: /text-xs.*sm:text-sm/
    },
    {
      name: 'Medium Button',
      component: <Button size="medium">Test</Button>,
      expectedText: /text-sm.*sm:text-base/
    },
    {
      name: 'Large Button',
      component: <Button size="large">Test</Button>,
      expectedText: /text-base.*sm:text-lg/
    },
    {
      name: 'TextInput',
      component: <TextInput id="test" name="test" value="" onChange={() => {}} />,
      expectedText: /text-sm.*sm:text-base/
    },
    {
      name: 'Select',
      component: <Select id="test" name="test" value="" onChange={() => {}} options={[]} />,
      expectedText: /text-sm.*sm:text-base/
    }
  ];

  testCases.forEach(testCase => {
    try {
      const { container } = render(testCase.component);
      const element = container.firstChild;
      const className = element.className;

      if (testCase.expectedText.test(className)) {
        results.passed.push({
          component: testCase.name,
          message: 'Typography pattern matches expected'
        });
      } else {
        results.failed.push({
          component: testCase.name,
          message: `Typography pattern doesn't match. Expected: ${testCase.expectedText.toString()}`,
          className
        });
      }
    } catch (error) {
      results.failed.push({
        component: testCase.name,
        message: `Error rendering component: ${error.message}`
      });
    }
  });

  return results;
};

/**
 * Spacing consistency checker
 */
export const checkSpacingConsistency = () => {
  const results = {
    passed: [],
    failed: [],
    warnings: []
  };

  const testCases = [
    {
      name: 'Small Button Padding',
      component: <Button size="small">Test</Button>,
      expectedPadding: /px-2.*py-1.*sm:px-3.*sm:py-1\.5/
    },
    {
      name: 'Medium Button Padding',
      component: <Button size="medium">Test</Button>,
      expectedPadding: /px-3.*py-2.*sm:px-4.*sm:py-2/
    },
    {
      name: 'Large Button Padding',
      component: <Button size="large">Test</Button>,
      expectedPadding: /px-4.*py-2\.5.*sm:px-6.*sm:py-3/
    },
    {
      name: 'FormGroup Margin',
      component: <FormGroup><div>Test</div></FormGroup>,
      expectedMargin: /mb-4.*sm:mb-6/
    }
  ];

  testCases.forEach(testCase => {
    try {
      const { container } = render(testCase.component);
      const element = container.firstChild;
      const className = element.className;

      if (testCase.expectedPadding && testCase.expectedPadding.test(className)) {
        results.passed.push({
          component: testCase.name,
          message: 'Spacing pattern matches expected'
        });
      } else if (testCase.expectedMargin && testCase.expectedMargin.test(className)) {
        results.passed.push({
          component: testCase.name,
          message: 'Spacing pattern matches expected'
        });
      } else {
        const expectedPattern = testCase.expectedPadding || testCase.expectedMargin;
        results.failed.push({
          component: testCase.name,
          message: `Spacing pattern doesn't match. Expected: ${expectedPattern.toString()}`,
          className
        });
      }
    } catch (error) {
      results.failed.push({
        component: testCase.name,
        message: `Error rendering component: ${error.message}`
      });
    }
  });

  return results;
};

/**
 * Responsive design checker
 */
export const checkResponsiveDesign = () => {
  const results = {
    passed: [],
    failed: [],
    warnings: []
  };

  const testCases = [
    {
      name: 'Button Responsive Classes',
      component: <Button size="medium">Test</Button>,
      expectedResponsive: /sm:/
    },
    {
      name: 'TextInput Responsive Classes',
      component: <TextInput id="test" name="test" value="" onChange={() => {}} />,
      expectedResponsive: /sm:/
    },
    {
      name: 'LoadingIndicator Responsive Classes',
      component: <LoadingIndicator size="medium" />,
      expectedResponsive: /sm:/
    }
  ];

  testCases.forEach(testCase => {
    try {
      const { container } = render(testCase.component);
      const element = container.firstChild;
      const className = element.className;

      if (testCase.expectedResponsive.test(className)) {
        results.passed.push({
          component: testCase.name,
          message: 'Responsive classes found'
        });
      } else {
        results.failed.push({
          component: testCase.name,
          message: 'No responsive classes found',
          className
        });
      }
    } catch (error) {
      results.failed.push({
        component: testCase.name,
        message: `Error rendering component: ${error.message}`
      });
    }
  });

  return results;
};

/**
 * Dark mode support checker
 */
export const checkDarkModeSupport = () => {
  const results = {
    passed: [],
    failed: [],
    warnings: []
  };

  const testCases = [
    {
      name: 'Button Dark Mode',
      component: <Button variant="primary">Test</Button>
    },
    {
      name: 'TextInput Dark Mode',
      component: <TextInput id="test" name="test" value="" onChange={() => {}} />
    },
    {
      name: 'Select Dark Mode',
      component: <Select id="test" name="test" value="" onChange={() => {}} options={[]} />
    },
    {
      name: 'Checkbox Dark Mode',
      component: <Checkbox id="test" name="test" checked={false} onChange={() => {}} />
    },
    {
      name: 'TextArea Dark Mode',
      component: <TextArea id="test" name="test" value="" onChange={() => {}} />
    },
    {
      name: 'FormError Dark Mode',
      component: <FormError error="Test error" />
    }
  ];

  testCases.forEach(testCase => {
    try {
      const { container } = render(testCase.component);
      const element = container.firstChild;
      const className = element.className;

      if (/dark:/.test(className)) {
        results.passed.push({
          component: testCase.name,
          message: 'Dark mode classes found'
        });
      } else {
        results.failed.push({
          component: testCase.name,
          message: 'No dark mode classes found',
          className
        });
      }
    } catch (error) {
      results.failed.push({
        component: testCase.name,
        message: `Error rendering component: ${error.message}`
      });
    }
  });

  return results;
};

/**
 * Run all consistency checks
 */
export const runAllConsistencyChecks = () => {
  console.log('🔍 Running Visual Consistency Checks...\n');

  const checks = [
    { name: 'Color Consistency', fn: checkColorConsistency },
    { name: 'Typography Consistency', fn: checkTypographyConsistency },
    { name: 'Spacing Consistency', fn: checkSpacingConsistency },
    { name: 'Responsive Design', fn: checkResponsiveDesign },
    { name: 'Dark Mode Support', fn: checkDarkModeSupport }
  ];

  const allResults = {};

  checks.forEach(check => {
    console.log(`\n📋 ${check.name}:`);
    const results = check.fn();
    allResults[check.name] = results;

    console.log(`  ✅ Passed: ${results.passed.length}`);
    console.log(`  ❌ Failed: ${results.failed.length}`);
    console.log(`  ⚠️  Warnings: ${results.warnings.length}`);

    if (results.failed.length > 0) {
      console.log('\n  Failed checks:');
      results.failed.forEach(failure => {
        console.log(`    • ${failure.component}: ${failure.message}`);
        if (failure.className) {
          console.log(`      Classes: ${failure.className}`);
        }
      });
    }

    if (results.warnings.length > 0) {
      console.log('\n  Warnings:');
      results.warnings.forEach(warning => {
        console.log(`    • ${warning.component}: ${warning.message}`);
      });
    }
  });

  // Summary
  const totalPassed = Object.values(allResults).reduce((sum, result) => sum + result.passed.length, 0);
  const totalFailed = Object.values(allResults).reduce((sum, result) => sum + result.failed.length, 0);
  const totalWarnings = Object.values(allResults).reduce((sum, result) => sum + result.warnings.length, 0);

  console.log('\n📊 Summary:');
  console.log(`  ✅ Total Passed: ${totalPassed}`);
  console.log(`  ❌ Total Failed: ${totalFailed}`);
  console.log(`  ⚠️  Total Warnings: ${totalWarnings}`);

  if (totalFailed === 0) {
    console.log('\n🎉 All visual consistency checks passed!');
  } else {
    console.log('\n🔧 Some issues found. Please review and fix the failed checks.');
  }

  return allResults;
};

// Export for use in tests or manual checking
export default {
  checkColorConsistency,
  checkTypographyConsistency,
  checkSpacingConsistency,
  checkResponsiveDesign,
  checkDarkModeSupport,
  runAllConsistencyChecks
};