/** @type {import("prettier").Config} */
const config = {
  trailingComma: 'all',
  semi: true,
  singleQuote: false,
  plugins: [],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
};

export default config;
