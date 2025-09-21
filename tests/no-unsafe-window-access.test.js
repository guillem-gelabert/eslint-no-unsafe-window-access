import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../src/no-unsafe-window-access.ts";

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      projectService: {
        allowDefaultProject: ["*.ts*"],
      },
    },
  },
});

// Throws error if the tests in ruleTester.run() do not pass
ruleTester.run(
  "no-unsafe-window-access", // rule name
  rule, // rule code
  {
    // checks
    // 'valid' checks cases that should pass
    valid: [
      // Basic window checks
      {
        code: "if (!!window) {console.log(window)}",
      },
      {
        code: "if (window) {console.log(window.document)}",
      },
      {
        code: "if (typeof window !== 'undefined') {console.log(window.document)}",
      },
      {
        code: "if (typeof window === 'undefined') {console.log('no window')} else {console.log(window.document)}",
      },

      // Nuxt/Vite client checks
      {
        code: "if (import.meta.client) {console.log(window.document)}",
      },
      {
        code: "if (import.meta.client) {const doc = window.document; console.log(doc)}",
      },

      // Process client checks
      {
        code: "if (process.client) {console.log(window.document)}",
      },
      {
        code: "if (process.client) {const doc = window.document; console.log(doc)}",
      },

      // Nested conditions
      {
        code: "if (import.meta.client) { if (someCondition) { console.log(window.document) } }",
      },
      {
        code: "if (process.client) { if (someCondition) { console.log(window.document) } }",
      },

      // Multiple window accesses in same guard
      {
        code: "if (import.meta.client) { console.log(window.document); console.log(window.location) }",
      },

      // Function declarations with guards
      {
        code: "function getDoc() { if (import.meta.client) { return window.document } }",
      },

      // Arrow functions with guards
      {
        code: "const getDoc = () => { if (process.client) { return window.document } }",
      },

      // Ternary operators with guards
      {
        code: "const doc = import.meta.client ? window.document : null",
      },

      // Logical AND with guards
      {
        code: "import.meta.client && console.log(window.document)",
      },

      // Complex expressions
      {
        code: "if (import.meta.client && someCondition) { console.log(window.document) }",
      },
    ],
    // 'invalid' checks cases that should not pass
    invalid: [
      // Basic unsafe access
      {
        code: "console.log(window)",
        errors: 1,
      },
      {
        code: "const doc = window.document",
        errors: 1,
      },
      {
        code: "window.location.href = 'https://example.com'",
        errors: 1,
      },

      // Wrong guard conditions
      {
        code: "if (dog) {console.log(window)}",
        errors: 1,
      },
      {
        code: "if (someVariable) {console.log(window.document)}",
        errors: 1,
      },
      {
        code: "if (true) {console.log(window.document)}",
        errors: 1,
      },
      {
        code: "if (!window) {console.log(window)}",
        errors: 1,
      },

      // Wrong import.meta checks
      {
        code: "if (import.meta.server) {console.log(window.document)}",
        errors: 1,
      },
      {
        code: "if (import.meta.env) {console.log(window.document)}",
        errors: 1,
      },
      {
        code: "if (import.meta.hot) {console.log(window.document)}",
        errors: 1,
      },

      // Wrong process checks
      {
        code: "if (process.env) {console.log(window.document)}",
        errors: 1,
      },
      {
        code: "if (process.env.NODE_ENV) {console.log(window.document)}",
        errors: 1,
      },
      {
        code: "if (process.browser) {console.log(window.document)}",
        errors: 1,
      },

      // Function declarations without guards
      {
        code: "function getDoc() { return window.document }",
        errors: 1,
      },
      {
        code: "function getLocation() { return window.location }",
        errors: 1,
      },

      // Arrow functions without guards
      {
        code: "const getDoc = () => window.document",
        errors: 1,
      },
      {
        code: "const getLocation = () => window.location",
        errors: 1,
      },

      // Object methods without guards
      {
        code: "const obj = { getDoc() { return window.document } }",
        errors: 1,
      },

      // Class methods without guards
      {
        code: "class MyClass { getDoc() { return window.document } }",
        errors: 1,
      },

      // Ternary without guards
      {
        code: "const doc = someCondition ? window.document : null",
        errors: 1,
      },

      // Logical AND without guards
      {
        code: "someCondition && console.log(window.document)",
        errors: 1,
      },

      // Nested unsafe access in else clause
      {
        code: "if (import.meta.server) { console.log('server') } else { console.log(window.location) }",
        errors: 1,
      },

      // Multiple unsafe accesses
      {
        code: "console.log(window.document); console.log(window.location)",
        errors: 2,
      },

      // Destructuring without guards
      {
        code: "const { document, location } = window",
        errors: 1,
      },

      // Property access without guards
      {
        code: "const href = window.location.href",
        errors: 1,
      },

      // Method calls without guards
      {
        code: "window.addEventListener('click', handler)",
        errors: 1,
      },

      // Complex expressions without guards
      {
        code: "if (someCondition && otherCondition) { console.log(window.document) }",
        errors: 1,
      },

      // Try-catch without guards
      {
        code: "try { console.log(window.document) } catch (e) { console.log(e) }",
        errors: 1,
      },
    ],
  }
);

console.log("All tests passed!");
