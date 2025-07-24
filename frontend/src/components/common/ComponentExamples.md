# Component Usage Examples

This document provides examples of how to use the reusable components in the Duty Roster application.

## UI Components

### Button

```jsx
import { Button } from '../components/common';

// Basic usage
<Button onClick={() => console.log('Button clicked')}>
  Click Me
</Button>

// Different variants
<Button variant="primary">Primary Button</Button>
<Button variant="secondary">Secondary Button</Button>
<Button variant="danger">Danger Button</Button>
<Button variant="success">Success Button</Button>

// Different sizes
<Button size="small">Small Button</Button>
<Button size="medium">Medium Button</Button>
<Button size="large">Large Button</Button>

// Disabled state
<Button disabled>Disabled Button</Button>

// Loading state
<Button isLoading>Loading Button</Button>

// As a submit button in a form
<Button type="submit">Submit</Button>
```

### TextInput

```jsx
import { TextInput, FormGroup, FormLabel, FormError } from '../components/common';

// Basic usage
<TextInput
  id="username"
  name="username"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
/>

// With label and error handling
<FormGroup>
  <FormLabel htmlFor="email">Email Address</FormLabel>
  <TextInput
    type="email"
    id="email"
    name="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    error={emailError}
    required
  />
  {emailError && <FormError>{emailError}</FormError>}
</FormGroup>

// Disabled state
<TextInput
  id="readonlyField"
  name="readonlyField"
  value="This field is disabled"
  onChange={() => {}}
  disabled
/>

// Password input
<TextInput
  type="password"
  id="password"
  name="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  placeholder="Enter your password"
/>
```

### Select

```jsx
import { Select, FormGroup, FormLabel } from '../components/common';

// Basic usage
<Select
  id="country"
  name="country"
  value={country}
  onChange={(e) => setCountry(e.target.value)}
>
  <option value="">Select a country</option>
  <option value="us">United States</option>
  <option value="ca">Canada</option>
  <option value="uk">United Kingdom</option>
</Select>

// With label and required
<FormGroup>
  <FormLabel htmlFor="role">Role</FormLabel>
  <Select
    id="role"
    name="role"
    value={role}
    onChange={(e) => setRole(e.target.value)}
    required
  >
    <option value="">Select a role</option>
    <option value="admin">Administrator</option>
    <option value="user">Regular User</option>
  </Select>
</FormGroup>

// Disabled state
<Select
  id="disabledSelect"
  name="disabledSelect"
  value="fixed"
  onChange={() => {}}
  disabled
>
  <option value="fixed">Fixed Value</option>
</Select>
```

### Checkbox

```jsx
import { Checkbox, FormGroup } from '../components/common';

// Basic usage
<Checkbox
  id="terms"
  name="terms"
  checked={termsAccepted}
  onChange={(e) => setTermsAccepted(e.target.checked)}
  label="I accept the terms and conditions"
/>

// In a form group
<FormGroup>
  <Checkbox
    id="newsletter"
    name="newsletter"
    checked={subscribeNewsletter}
    onChange={(e) => setSubscribeNewsletter(e.target.checked)}
    label="Subscribe to our newsletter"
  />
</FormGroup>

// Disabled state
<Checkbox
  id="disabledCheckbox"
  name="disabledCheckbox"
  checked={true}
  onChange={() => {}}
  label="This checkbox is disabled"
  disabled
/>
```

### TextArea

```jsx
import { TextArea, FormGroup, FormLabel, FormError } from '../components/common';

// Basic usage
<TextArea
  id="comments"
  name="comments"
  value={comments}
  onChange={(e) => setComments(e.target.value)}
  rows={4}
/>

// With label and error handling
<FormGroup>
  <FormLabel htmlFor="description">Description</FormLabel>
  <TextArea
    id="description"
    name="description"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    error={descriptionError}
    rows={6}
    required
  />
  {descriptionError && <FormError>{descriptionError}</FormError>}
</FormGroup>

// Disabled state
<TextArea
  id="readonlyTextArea"
  name="readonlyTextArea"
  value="This text area is disabled"
  onChange={() => {}}
  disabled
  rows={3}
/>
```

### LoadingIndicator

```jsx
import { LoadingIndicator } from '../components/common';

// Basic usage
<LoadingIndicator />

// Different sizes
<LoadingIndicator size="small" />
<LoadingIndicator size="medium" />
<LoadingIndicator size="large" />

// With text
<LoadingIndicator text="Loading..." />

// Centered in container
<div className="h-40 w-full">
  <LoadingIndicator centered />
</div>
```

## Modal Components

### BaseModal

```jsx
import { BaseModal, ModalHeader, ModalBody, ModalFooter, Button } from '../components/common';

// Basic usage
const [isOpen, setIsOpen] = useState(false);

<Button onClick={() => setIsOpen(true)}>Open Modal</Button>

<BaseModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
>
  <ModalHeader>Modal Title</ModalHeader>
  <ModalBody>
    <p>This is the modal content.</p>
  </ModalBody>
  <ModalFooter>
    <Button variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
    <Button onClick={() => { /* Handle action */ setIsOpen(false); }}>Confirm</Button>
  </ModalFooter>
</BaseModal>

// Different sizes
<BaseModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  size="small" // or "medium" or "large"
>
  {/* Modal content */}
</BaseModal>

// Disable close on escape key
<BaseModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  closeOnEsc={false}
>
  {/* Modal content */}
</BaseModal>

// Disable close on outside click
<BaseModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  closeOnOutsideClick={false}
>
  {/* Modal content */}
</BaseModal>
```

### ModalHeader, ModalBody, ModalFooter

```jsx
import { BaseModal, ModalHeader, ModalBody, ModalFooter, Button } from '../components/common';

// Basic usage
<BaseModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
  <ModalHeader onClose={() => setIsOpen(false)}>
    Modal Title
  </ModalHeader>
  <ModalBody>
    <p>This is the modal content.</p>
    <p>You can add any content here.</p>
  </ModalBody>
  <ModalFooter>
    <Button variant="secondary" onClick={() => setIsOpen(false)}>
      Cancel
    </Button>
    <Button onClick={() => { /* Handle action */ setIsOpen(false); }}>
      Confirm
    </Button>
  </ModalFooter>
</BaseModal>

// Custom styling
<BaseModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
  <ModalHeader className="bg-light-100 dark:bg-dark-700">
    Custom Header
  </ModalHeader>
  <ModalBody className="py-8">
    <p>This modal has custom styling.</p>
  </ModalBody>
  <ModalFooter className="border-t border-light-300 dark:border-dark-600">
    <Button onClick={() => setIsOpen(false)}>Close</Button>
  </ModalFooter>
</BaseModal>
```

## Form Layout Components

### FormGroup, FormLabel, FormError

```jsx
import { FormGroup, FormLabel, FormError, TextInput, Select, Checkbox } from '../components/common';

// Basic form layout
<form onSubmit={handleSubmit}>
  <FormGroup>
    <FormLabel htmlFor="name">Full Name</FormLabel>
    <TextInput
      id="name"
      name="name"
      value={name}
      onChange={(e) => setName(e.target.value)}
      error={errors.name}
      required
    />
    {errors.name && <FormError>{errors.name}</FormError>}
  </FormGroup>

  <FormGroup>
    <FormLabel htmlFor="email">Email Address</FormLabel>
    <TextInput
      type="email"
      id="email"
      name="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      error={errors.email}
      required
    />
    {errors.email && <FormError>{errors.email}</FormError>}
  </FormGroup>

  <FormGroup>
    <FormLabel htmlFor="role">Role</FormLabel>
    <Select
      id="role"
      name="role"
      value={role}
      onChange={(e) => setRole(e.target.value)}
      error={errors.role}
    >
      <option value="">Select a role</option>
      <option value="admin">Administrator</option>
      <option value="user">Regular User</option>
    </Select>
    {errors.role && <FormError>{errors.role}</FormError>}
  </FormGroup>

  <FormGroup>
    <Checkbox
      id="terms"
      name="terms"
      checked={termsAccepted}
      onChange={(e) => setTermsAccepted(e.target.checked)}
      label="I accept the terms and conditions"
      error={errors.terms}
    />
    {errors.terms && <FormError>{errors.terms}</FormError>}
  </FormGroup>

  <Button type="submit">Submit</Button>
</form>;
```

## Complete Form Example

```jsx
import React, { useState } from 'react';
import {
  Button,
  TextInput,
  Select,
  Checkbox,
  TextArea,
  FormGroup,
  FormLabel,
  FormError,
} from '../components/common';

const ExampleForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    message: '',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.role) newErrors.role = 'Role is required';
    if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms';

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length === 0) {
      // Submit the form
      console.log('Form submitted:', formData);
      // Reset form
      setFormData({
        name: '',
        email: '',
        role: '',
        message: '',
        agreeTerms: false,
      });
      setErrors({});
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <FormGroup>
        <FormLabel htmlFor="name">Full Name</FormLabel>
        <TextInput
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
        />
        {errors.name && <FormError>{errors.name}</FormError>}
      </FormGroup>

      <FormGroup>
        <FormLabel htmlFor="email">Email Address</FormLabel>
        <TextInput
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />
        {errors.email && <FormError>{errors.email}</FormError>}
      </FormGroup>

      <FormGroup>
        <FormLabel htmlFor="role">Role</FormLabel>
        <Select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          error={errors.role}
        >
          <option value="">Select a role</option>
          <option value="admin">Administrator</option>
          <option value="user">Regular User</option>
          <option value="guest">Guest</option>
        </Select>
        {errors.role && <FormError>{errors.role}</FormError>}
      </FormGroup>

      <FormGroup>
        <FormLabel htmlFor="message">Message (Optional)</FormLabel>
        <TextArea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
        />
      </FormGroup>

      <FormGroup>
        <Checkbox
          id="agreeTerms"
          name="agreeTerms"
          checked={formData.agreeTerms}
          onChange={handleChange}
          label="I agree to the terms and conditions"
          error={errors.agreeTerms}
        />
        {errors.agreeTerms && <FormError>{errors.agreeTerms}</FormError>}
      </FormGroup>

      <Button type="submit">Submit Form</Button>
    </form>
  );
};

export default ExampleForm;
```
