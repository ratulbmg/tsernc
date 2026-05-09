module.exports = {
  root: true,
  ignorePatterns: [
    "dist/**",
    "build/**",
    ".turbo/**",
    "node_modules/**",
    "coverage/**",
    "*.config.js",
  ],
  env: {
    node: true,
  },
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  plugins: ["@typescript-eslint"],
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2020,
  },
  rules: {
      // Disallow debugger statements — should never be in production code
      "no-debugger": "error",

      // Disallow var — use let or const instead (block-scoped)
      "no-var": "error",

      // Require const when a variable is never reassigned
      "prefer-const": "error",

      // Require === instead of == to avoid type coercion bugs
      eqeqeq: ["error", "always"],

      // Require curly braces for all control statements (if, else, for, etc.)
      curly: ["error", "all"],

      // Enforce ES6 shorthand for object properties: { name } instead of { name: name }
      "object-shorthand": "error",

      // Disallow importing the same module twice — merge into one import
      "no-duplicate-imports": "error",

      // Warn on console.log/info — only console.warn and console.error are preferred
      "no-console": ["warn", { allow: ["warn", "error"] }],

      // Warn when using 'any' type — reduces TypeScript type safety
      "@typescript-eslint/no-explicit-any": "warn",

      // Warn on unused variables; prefix with _ to intentionally ignore (e.g. _req)
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      // Allow the non-null assertion operator (!) — e.g. user!.name
      "@typescript-eslint/no-non-null-assertion": "off",

      // Warn on empty interfaces — they usually indicate incomplete code
      "@typescript-eslint/no-empty-interface": "warn",

      // Warn on @ts-ignore and @ts-nocheck comments — they suppress type errors
      "@typescript-eslint/ban-ts-comment": "warn",

      // Disallow redundant type annotations TypeScript can already infer
      // e.g. const name: string = "Ratul" → const name = "Ratul"
      "@typescript-eslint/no-inferrable-types": "error",

      // Warn on empty function bodies — usually indicates unfinished code
      "@typescript-eslint/no-empty-function": "warn",
    },
};