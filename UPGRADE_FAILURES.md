# Expected Failures When Upgrading Vulnerable Packages

This document describes the expected failures that will occur when upgrading the vulnerable packages to their fixed versions without making the necessary code changes.

## Overview

The project includes three vulnerable packages that require major version upgrades to fix security issues:

1. **jsonwebtoken@8.5.1** → **jsonwebtoken@9.0.0**
2. **marked@0.3.9** → **marked@4.0.10+**
3. **fast-xml-parser@3.21.1** → **fast-xml-parser@4.4.1+**

Each of these upgrades introduces breaking changes that will cause the application to fail if not properly addressed.

## 1. jsonwebtoken@8.5.1 → jsonwebtoken@9.0.0

### Expected Failures

When upgrading jsonwebtoken from v8.5.1 to v9.0.0 without code changes, the following failures will occur:

1. **Token Verification Failures**:
   - Error: `"algorithms" is required`
   - Location: `grocery-api/src/utils/auth.js` in the `verifyToken` and `verifyShareToken` functions
   - Test: `grocery-api/test/utils/share-token.test.js` will fail on the "BREAKING CHANGE" test

2. **Token Generation Warnings**:
   - Warning: `"algorithm" option is missing`
   - Location: `grocery-api/src/utils/auth.js` in the `generateToken` and `generateShareToken` functions

3. **API Endpoint Failures**:
   - The `/shared/:token` endpoint will return 401 Unauthorized
   - Location: `grocery-api/src/routes/lists.js`

### Stack Traces

```
Error: "algorithms" is required
    at module.exports [as verify] (.../node_modules/jsonwebtoken/verify.js:...)
    at verifyShareToken (.../grocery-api/src/utils/auth.js:...)
    at .../grocery-api/src/routes/lists.js:...
```

## 2. marked@0.3.9 → marked@4.0.10+

### Expected Failures

When upgrading marked from v0.3.9 to v4.0.10+ without code changes, the following failures will occur:

1. **Function Call Errors**:
   - Error: `marked is not a function`
   - Location: `grocery-shared/src/markdown.js` in the `renderMarkdown` function
   - Test: `grocery-shared/test/markdown.test.js` will fail on the "BREAKING CHANGE" tests

2. **Option Handling Errors**:
   - Error: `The "sanitize" option is deprecated since version 0.7.0`
   - Location: Any code using the `sanitize` option

3. **Rendering Failures**:
   - Item notes will not render correctly in the UI
   - Location: `grocery-web/src/pages/ShoppingListPage.jsx` and `grocery-web/src/pages/SharedListPage.jsx`

### Stack Traces

```
TypeError: marked is not a function
    at renderMarkdown (.../grocery-shared/src/markdown.js:...)
    at .../grocery-api/src/routes/items.js:...
```

## 3. fast-xml-parser@3.21.1 → fast-xml-parser@4.4.1+

### Expected Failures

When upgrading fast-xml-parser from v3.21.1 to v4.4.1+ without code changes, the following failures will occur:

1. **Function Call Errors**:
   - Error: `parser.validate is not a function`
   - Error: `parser.parse is not a function`
   - Location: `grocery-infra/scripts/xmlImport.js` in the `parseXmlFile` function
   - Test: `grocery-infra/test/xmlImport.test.js` will fail on the "BREAKING CHANGE" tests

2. **Option Handling Errors**:
   - Error: `attrNodeName is not a valid option`
   - Location: `grocery-infra/scripts/xmlImport.js` in the options object

3. **XML Import Failures**:
   - The XML import process will fail completely
   - Location: `grocery-infra/scripts/importSampleData.js` when using the `--use-xml` flag

### Stack Traces

```
TypeError: parser.validate is not a function
    at parseXmlFile (.../grocery-infra/scripts/xmlImport.js:...)
    at importXmlStores (.../grocery-infra/scripts/xmlImport.js:...)
```

## Running the Tests to Verify Failures

To verify these failures, you can:

1. Run the tests with the vulnerable versions:
   ```
   npm test
   ```

2. Upgrade the packages:
   ```
   npm install jsonwebtoken@9.0.0 marked@4.0.10 fast-xml-parser@4.4.1
   ```

3. Run the tests again to see the failures:
   ```
   npm test
   ```

## Fixing the Issues

The necessary code changes to fix these issues are documented in the [VULNERABILITIES.md](VULNERABILITIES.md) file. The changes include:

1. Updating function calls to match the new APIs
2. Changing option names and structures
3. Adapting to new module formats and import styles

By making these changes, the application can be upgraded to use the fixed versions of the packages without breaking functionality.