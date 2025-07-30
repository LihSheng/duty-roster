# Manual Testing Checklist for Reusable Components

This checklist should be used to manually verify the visual consistency and functionality of all reusable components across the application.

## 🎨 Visual Consistency Checks

### Color Scheme Consistency
- [ ] All primary buttons use `bg-primary-600` and `hover:bg-primary-700`
- [ ] All secondary buttons use `bg-light-200` and `hover:bg-light-300`
- [ ] All danger buttons use `bg-danger-600` and `hover:bg-danger-700`
- [ ] All success buttons use `bg-success-600` and `hover:bg-success-700`
- [ ] All form inputs use `focus:ring-primary-500` and `focus:border-primary-500`
- [ ] Error states use consistent danger colors (`text-danger-600`, `border-danger-300`)
- [ ] All components have proper dark mode variants with `dark:` prefixes

### Typography Consistency
- [ ] Small buttons use `text-xs sm:text-sm`
- [ ] Medium buttons use `text-sm sm:text-base`
- [ ] Large buttons use `text-base sm:text-lg`
- [ ] Form inputs use `text-sm sm:text-base`
- [ ] Form labels use consistent font weight (`font-medium`)
- [ ] Error messages use `text-sm` and danger colors

### Spacing Consistency
- [ ] Small buttons use `px-2 py-1 sm:px-3 sm:py-1.5`
- [ ] Medium buttons use `px-3 py-2 sm:px-4 sm:py-2`
- [ ] Large buttons use `px-4 py-2.5 sm:px-6 sm:py-3`
- [ ] Form groups use `mb-4 sm:mb-6`
- [ ] Form inputs have consistent padding `px-3 py-2`
- [ ] Modal sections have consistent padding patterns

### Border and Border Radius Consistency
- [ ] All components use `rounded-md` for consistent border radius
- [ ] Form inputs use `border border-light-300 dark:border-dark-600`
- [ ] Focus states use `ring-2 ring-primary-500`
- [ ] Error states use `border-danger-300`

## 📱 Responsive Design Checks

### Mobile-First Approach
- [ ] All components have base styles for mobile
- [ ] Responsive variants use `sm:`, `md:`, `lg:` prefixes appropriately
- [ ] Text sizes scale appropriately across breakpoints
- [ ] Spacing scales appropriately across breakpoints

### Modal Responsiveness
- [ ] Small modals: `max-w-sm sm:max-w-md`
- [ ] Medium modals: `max-w-md sm:max-w-lg`
- [ ] Large modals: `max-w-lg sm:max-w-2xl lg:max-w-4xl`
- [ ] Modal padding: `p-2 sm:p-4`
- [ ] Modal content has proper max-height constraints

### Form Responsiveness
- [ ] Form layouts stack on mobile, side-by-side on larger screens
- [ ] Button groups use `flex-col sm:flex-row`
- [ ] Input text sizes are readable on all screen sizes

## ♿ Accessibility Checks

### Keyboard Navigation
- [ ] All interactive elements are focusable with Tab key
- [ ] Focus order is logical and intuitive
- [ ] Focus indicators are visible and consistent
- [ ] Escape key closes modals
- [ ] Enter/Space keys activate buttons and checkboxes

### Screen Reader Support
- [ ] All form inputs have proper labels
- [ ] Error messages are announced with `role="alert"`
- [ ] Loading states have `aria-live="polite"`
- [ ] Modals have `aria-modal="true"` and `role="dialog"`
- [ ] Buttons have descriptive text or `aria-label`

### ARIA Attributes
- [ ] Required fields have `aria-required="true"`
- [ ] Invalid fields have `aria-invalid="true"`
- [ ] Fields with errors have `aria-describedby` pointing to error message
- [ ] Loading buttons have `aria-busy="true"`
- [ ] Disabled elements have `aria-disabled="true"`

### Color Contrast
- [ ] Text has sufficient contrast against backgrounds
- [ ] Focus indicators are visible in both light and dark modes
- [ ] Error states maintain good contrast
- [ ] Disabled states are clearly distinguishable

## 🔧 Functional Testing

### Button Component
- [ ] All variants render with correct styling
- [ ] All sizes render with correct dimensions
- [ ] Loading state shows spinner and disables interaction
- [ ] Disabled state prevents interaction and shows disabled styling
- [ ] onClick handlers work correctly
- [ ] Type attribute works for form submission

### Form Components

#### TextInput
- [ ] Value changes trigger onChange handler
- [ ] Error state shows error styling
- [ ] Required attribute works
- [ ] Disabled state prevents interaction
- [ ] Different input types (email, password, etc.) work correctly

#### Select
- [ ] Options render correctly
- [ ] Value changes trigger onChange handler
- [ ] Error state shows error styling
- [ ] Disabled state prevents interaction
- [ ] Placeholder text displays when no value selected

#### Checkbox
- [ ] Checked state toggles correctly
- [ ] Label is clickable and toggles checkbox
- [ ] Error state shows error styling
- [ ] Disabled state prevents interaction

#### TextArea
- [ ] Value changes trigger onChange handler
- [ ] Rows attribute controls height
- [ ] Error state shows error styling
- [ ] Resize behavior works correctly

### Modal Components

#### BaseModal
- [ ] Opens and closes correctly
- [ ] Escape key closes modal
- [ ] Click outside closes modal (if enabled)
- [ ] Focus is trapped within modal
- [ ] Different sizes render correctly
- [ ] Overlay prevents interaction with background

#### Modal Sections
- [ ] ModalHeader displays title and close button
- [ ] ModalBody displays content with proper padding
- [ ] ModalFooter aligns buttons correctly
- [ ] All sections work together seamlessly

### Loading Indicator
- [ ] Different sizes render correctly
- [ ] Animation works smoothly
- [ ] Text displays alongside spinner when provided
- [ ] Centering works correctly

### Form Layout Components

#### FormGroup
- [ ] Provides consistent spacing between form elements
- [ ] Error state styling works correctly

#### FormLabel
- [ ] Associates correctly with form inputs
- [ ] Required indicator displays when needed
- [ ] Styling is consistent across all forms

#### FormError
- [ ] Displays error messages with proper styling
- [ ] Only renders when error is present
- [ ] ARIA attributes work correctly

## 🔄 Integration Testing

### Refactored Modal Components

#### ConfirmationModal
- [ ] Uses BaseModal component correctly
- [ ] Uses Button components for actions
- [ ] All existing functionality preserved
- [ ] Styling is consistent with design system
- [ ] Keyboard navigation works
- [ ] Screen reader announces content correctly

#### EditAssigneeModal
- [ ] Uses BaseModal and form components
- [ ] Form validation works correctly
- [ ] API integration works
- [ ] Loading states display correctly
- [ ] Error handling works properly
- [ ] All existing functionality preserved

#### AddDutyModal
- [ ] Uses BaseModal and form components
- [ ] Mode switching works correctly
- [ ] Form validation works for both modes
- [ ] API integration works
- [ ] Loading states display correctly
- [ ] Error handling works properly
- [ ] All existing functionality preserved

### Component Composition
- [ ] Modal with form components works seamlessly
- [ ] Button with loading indicator works correctly
- [ ] Form groups with all input types work together
- [ ] Error states propagate correctly through component hierarchy

## 🌙 Dark Mode Testing

### Theme Switching
- [ ] All components adapt to dark mode correctly
- [ ] Color contrast remains sufficient in dark mode
- [ ] Focus indicators are visible in dark mode
- [ ] Hover states work correctly in dark mode

### Component-Specific Dark Mode
- [ ] Buttons maintain proper contrast in dark mode
- [ ] Form inputs have proper background and text colors
- [ ] Modals have proper overlay and background colors
- [ ] Error states remain visible in dark mode

## 🚀 Performance Testing

### Rendering Performance
- [ ] Components render quickly without noticeable lag
- [ ] Large lists of components perform well
- [ ] Modal opening/closing is smooth
- [ ] Form interactions are responsive

### Memory Usage
- [ ] Components clean up properly when unmounted
- [ ] Event listeners are removed when components unmount
- [ ] No memory leaks in modal components

## 📋 Cross-Browser Testing

### Browser Compatibility
- [ ] Components work correctly in Chrome
- [ ] Components work correctly in Firefox
- [ ] Components work correctly in Safari
- [ ] Components work correctly in Edge

### Feature Support
- [ ] CSS Grid/Flexbox layouts work across browsers
- [ ] Focus management works across browsers
- [ ] Keyboard navigation works across browsers
- [ ] ARIA attributes are supported across browsers

## 📱 Device Testing

### Mobile Devices
- [ ] Components are usable on small screens
- [ ] Touch interactions work correctly
- [ ] Text is readable without zooming
- [ ] Buttons are large enough for touch

### Tablet Devices
- [ ] Components scale appropriately for tablet screens
- [ ] Touch and mouse interactions both work
- [ ] Layout adapts correctly to tablet orientation changes

## ✅ Final Verification

### Code Quality
- [ ] All components follow consistent coding patterns
- [ ] PropTypes are defined for all components
- [ ] Components are properly documented
- [ ] No console errors or warnings

### Documentation
- [ ] Component usage examples are accurate
- [ ] API documentation is complete
- [ ] Migration guide is helpful and accurate

### Deployment Readiness
- [ ] All tests pass
- [ ] No critical accessibility issues
- [ ] Performance is acceptable
- [ ] Visual consistency is maintained across the application

---

## 📝 Testing Notes

Use this section to record any issues found during manual testing:

### Issues Found
- [ ] Issue 1: [Description]
- [ ] Issue 2: [Description]
- [ ] Issue 3: [Description]

### Fixes Applied
- [ ] Fix 1: [Description]
- [ ] Fix 2: [Description]
- [ ] Fix 3: [Description]

### Final Sign-off
- [ ] All critical issues resolved
- [ ] Visual consistency verified
- [ ] Accessibility requirements met
- [ ] Performance is acceptable
- [ ] Ready for production deployment

**Tested by:** _______________  
**Date:** _______________  
**Browser/Device:** _______________  
**Notes:** _______________