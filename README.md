# eslint-no-unsafe-window-access

An ESLint rule that enforces safe access to the `window` object in SSR environments like Nuxt.js, Next.js, and other frameworks where `window` is not available on the server.

## Installation

```bash
npm install --save-dev eslint-no-unsafe-window-access
```

## Usage

Add the rule to your ESLint configuration:

```json
{
  "rules": {
    "no-unsafe-window-access": "error"
  }
}
```

Or with TypeScript ESLint:

```json
{
  "extends": ["@typescript-eslint/recommended"],
  "rules": {
    "no-unsafe-window-access": "error"
  }
}
```

## What it does

This rule prevents unsafe access to the `window` object by requiring client-side guards. It's particularly useful in SSR (Server-Side Rendering) environments where `window` is undefined on the server, which can cause runtime errors.

## Valid Examples

✅ **Basic window checks:**

```javascript
if (window) {
  console.log(window.document);
}

if (!window) {
  console.log("No window available");
}

if (typeof window !== "undefined") {
  console.log(window.document);
}
```

✅ **Nuxt/Vite client checks:**

```javascript
if (import.meta.client) {
  console.log(window.document);
  const doc = window.document;
}
```

✅ **Process client checks:**

```javascript
if (process.client) {
  console.log(window.document);
}
```

✅ **Ternary operators:**

```javascript
const doc = import.meta.client ? window.document : null;
```

✅ **Logical AND expressions:**

```javascript
import.meta.client && console.log(window.document);
```

✅ **Complex conditions:**

```javascript
if (import.meta.client && someCondition) {
  console.log(window.document);
}
```

✅ **Function declarations with guards:**

```javascript
function getDocument() {
  if (import.meta.client) {
    return window.document;
  }
}
```

## Invalid Examples

❌ **Unsafe access without guards:**

```javascript
console.log(window); // Error!
const doc = window.document; // Error!
window.location.href = "https://example.com"; // Error!
```

❌ **Wrong guard conditions:**

```javascript
if (someVariable) {
  console.log(window.document); // Error!
}

if (import.meta.server) {
  console.log(window.document); // Error!
}

if (process.env) {
  console.log(window.document); // Error!
}
```

❌ **Functions without guards:**

```javascript
function getDocument() {
  return window.document; // Error!
}

const getLocation = () => window.location; // Error!
```

❌ **Ternary without guards:**

```javascript
const doc = someCondition ? window.document : null; // Error!
```

## Supported Guard Patterns

The rule recognizes these client-side guard patterns:

- `if (window)` - Direct window check
- `if (!window)` - Negated window check
- `if (typeof window !== 'undefined')` - Typeof check
- `if (import.meta.client)` - Nuxt/Vite client check
- `if (process.client)` - Process client check
- Complex logical expressions containing any of the above

## Configuration

The rule accepts no configuration options. It automatically detects all supported guard patterns.

## Why use this rule?

In SSR environments, accessing `window` on the server causes `ReferenceError: window is not defined`. This rule helps prevent these runtime errors by:

1. **Catching unsafe access at build time** - No more runtime errors in production
2. **Enforcing consistent patterns** - Ensures all window access is properly guarded
3. **Supporting multiple frameworks** - Works with Nuxt, Next.js, Vite, and other SSR frameworks
4. **Comprehensive detection** - Catches window access in functions, classes, ternaries, and more

## Upcoming Features

🚀 **Planned enhancements (prioritized):**

### High Priority

1. **Better error messages** - More descriptive error messages with suggested fixes
2. **Document object support** - Extend rule to also check for unsafe `document` access
3. **Auto-fix suggestions** - Provide automatic fixes for common unsafe patterns

### Medium Priority

4. **Global object detection** - Support for other browser globals like `navigator`, `location`, etc.
5. **Custom guard patterns** - Allow configuration of additional client-side detection patterns
6. **Framework-specific presets** - Pre-configured rules for popular SSR frameworks

### Low Priority

7. **Performance optimizations** - Faster rule execution for large codebases

## Development

You can use https://explorer.eslint.org to easily eyplore the AST of elsint.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC
