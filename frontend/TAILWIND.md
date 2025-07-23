# Tailwind CSS Integration

This project uses Tailwind CSS for styling. Tailwind is a utility-first CSS framework that allows for rapid UI development with pre-defined utility classes.

## Usage

### Basic Usage

Use Tailwind's utility classes directly in your JSX:

```jsx
<div className="p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-bold text-primary-600 mb-2">Title</h2>
  <p className="text-dark-700">Content goes here</p>
  <button className="mt-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">
    Click Me
  </button>
</div>
```

### Custom Components

We've defined several custom component classes in `src/tailwind.css` that you can use:

```jsx
<div className="card">
  <h2 className="text-xl font-bold mb-2">Card Title</h2>
  <p>Card content</p>
  <button className="btn btn-primary mt-4">Primary Button</button>
  <button className="btn btn-secondary mt-4">Secondary Button</button>
</div>
```

### Dark Mode

The application supports dark mode through Tailwind's `dark:` variant. The theme can be toggled using the ThemeToggle component in the navbar.

To make a component dark mode aware:

```jsx
<div className="bg-white dark:bg-dark-800 text-dark-900 dark:text-light-100">
  This text will be dark in light mode and light in dark mode
</div>
```

## Color Palette

We've defined a custom color palette in `tailwind.config.js`:

- `primary`: Blue colors
- `secondary`: Green colors
- `danger`: Red colors
- `warning`: Yellow/Orange colors
- `dark`: Dark gray/blue colors
- `light`: Light gray colors

Each color has shades from 50 (lightest) to 950 (darkest).

## Adding New Styles

### Extending Tailwind

To add new custom styles, you can:

1. Use the `@layer components` directive in `src/tailwind.css`:

```css
@layer components {
  .custom-component {
    @apply bg-white p-4 rounded-lg shadow-md;
  }
}
```

2. Extend the Tailwind config in `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      // Add custom colors, spacing, etc.
    }
  }
}
```

## Best Practices

1. Use Tailwind's utility classes for one-off styles
2. Create component classes for repeated patterns
3. Use the theme colors consistently
4. Make components dark mode aware with `dark:` variants
5. Use responsive variants (`sm:`, `md:`, `lg:`, etc.) for responsive design