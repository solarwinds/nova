# Package.json Resolutions

This document explains the version resolutions pinned in `package.json`. These resolutions force specific versions of dependencies to ensure compatibility and stability across the Nova Framework.

## Pinned Resolutions

| Package              | Version | Reason                                                                                       |
| -------------------- | ------- | -------------------------------------------------------------------------------------------- |
| `d3-color`           | 3.1.0   | Security vulnerability in newer versions; locked for stability                               |
| `picomatch`          | 4.0.4   | Required by @compodoc/compodoc 1.2.1 (no compatibility patches available for newer versions) |
| `tablesort`          | 5.5.0   | Required by @compodoc/compodoc 1.2.1 (no compatibility patches available for newer versions) |
| `uuid`               | 11.1.1  | Required by @compodoc/compodoc 1.2.1 (transitive dependency compatibility)                   |
| `ajv`                | 8.18.0  | Required by @compodoc/compodoc 1.2.1 (transitive dependency compatibility)                   |
| `webpack-dev-server` | 5.2.4   | Required by @angular-devkit/build-angular 21.2.11 (compatible version constraint)            |
| `ws`                 | 8.20.1  | Required by karma 6.4.4 (WebSocket dependency for test runner)                               |

## How to Update Resolutions

When updating a resolution:

1. Update the version in the table above with the reason for the change
2. Update the version in `package.json`
3. Run `yarn install` to update lock files
4. Test thoroughly before committing
