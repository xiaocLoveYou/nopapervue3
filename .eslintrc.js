module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: '@babel/eslint-parser',
        ecmaVersion: 12,
        sourceType: 'module',
    },
    extends: [
        'eslint:recommended',
        'plugin:vue/vue3-recommended',
    ],
    globals: {
        process: 'readonly',  // This tells ESLint that `process` is a global variable
    },
    rules: {
        'vue/multi-word-component-names': 'off',
    },
};
