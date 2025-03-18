module.exports = {
  printWidth: 120,
  tabWidth: 2,
  singleQuote: false,
  plugins: ['@shopify/prettier-plugin-liquid', 'prettier-plugin-tailwindcss'],
  // bracketSpacing: true,
  // bracketSameLine: true,
  // singleLineLinkTags: true,
  overrides: [
    {
      files: '*.liquid',
      options: {},
    },
  ],
};
