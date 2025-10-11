import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../src/no-unsafe-window-access.ts";
import vueParser from "vue-eslint-parser";
import typescriptEslint from "typescript-eslint";

const ruleTester = new RuleTester({
  languageOptions: {
    parser: vueParser,
    parserOptions: {
      parser: typescriptEslint.parser,
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },
});

ruleTester.run("no-unsafe-window-access (vue)", rule, {
  valid: [
    {
      filename: "Component.vue",
      code: `
<template></template>
<script setup lang="ts">
console.log(window)
</script>
      `,
    },
    {
      filename: "Component.vue",
      code: `
<template></template>
<script setup lang="ts">
if (import.meta.client) {
  console.log(window.document)
}
</script>
      `,
    },
    {
      filename: "Component.vue",
      code: `
<template></template>
<script lang="ts">
export default {
  mounted() {
    if (process.client) {
      console.log(window.location)
    }
  }
}
</script>
      `,
    },
  ],
  invalid: [
    {
      filename: "Component.vue",
      code: `
<template></template>
<script setup lang="ts">
console.log(window.document)
</script>
      `,
      errors: 1,
    },
    {
      filename: "Component.vue",
      code: `
<template></template>
<script lang="ts">
export default {
  methods: {
    foo() {
      const x = window.document
      return x
    }
  }
}
</script>
      `,
      errors: 1,
    },
  ],
});
