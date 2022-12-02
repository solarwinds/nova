# Troubleshooting

## Problem

I'm getting compilation errors caused by the tree-shaking of lodash.

## Possible Fix

Follow these steps:

1. Update your tsconfig.json to have `allowSyntheticDefaultImports: true` property in **compilerOptions**. This property allows users to import CommonJS modules as default imports.
   - If you have compilation error like `TypeError: find_1.default is not a function` when running tests you might need to add `esModuleInterop: true` to your compilerOptions. Or you can try Solution #2 from this [article](https://medium.com/martin_hotell/tree-shake-lodash-with-webpack-jest-and-typescript-2734fa13b5cd).

2. After updates in tsconfig.json change imports of lodash to such way in **all files**:

   ```js
   import forEach from “lodash/forEach”;
   ```

## Additional articles about tsconfig compilerOptions:

- <https://blogs.msdn.microsoft.com/typescript/2018/01/31/announcing-typescript-2-7/>
- <https://www.typescriptlang.org/docs/handbook/compiler-options.html>
