import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat();

const config = [
  {
    ignores: [
      "**/dist/**",
      "**/.next/**",
      "**/node_modules/**"
    ]
  },
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      "react/no-unescaped-entities": "warn",
      "react/jsx-no-comment-textnodes": "warn",
      "@next/next/no-img-element": "warn",
      "react-hooks/exhaustive-deps": "error"
    }
  }
];

export default config;
