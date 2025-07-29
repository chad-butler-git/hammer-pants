# Vulnerabilities and Upgrade Guide

This document describes the intentional vulnerabilities included in this project for testing SCA tools, along with the breaking changes that occur when upgrading to fixed versions.

## Overview

This project includes three vulnerable packages that require major version upgrades to fix security issues:

1. **jsonwebtoken@8.5.1** - Used for JWT-based "share my list" links
2. **marked@0.3.9** - Used for markdown notes on items
3. **fast-xml-parser@3.21.1** - Used for XML store layout parsing

Each of these packages has real CVEs and requires a major version upgrade to fix, which introduces breaking changes to the API.

## 1. jsonwebtoken@8.5.1

### Vulnerability

- **CVE-2022-23529**: JWT verification bypass / potential RCE
- **Severity**: High
- **Fixed in**: jsonwebtoken@9.0.0
- **Location**: `grocery-api/package.json`
- **Usage**: JWT-based "share my list" links in grocery-api

### Breaking Changes in v9.0.0

The upgrade to jsonwebtoken@9.0.0 introduces several breaking changes:

1. **Algorithm Handling**:
   - v9 is more strict about algorithms and requires explicit algorithm specification
   - The `algorithms` option is now required in `verify()` calls

2. **Error Types and Messages**:
   - Error types and messages have changed
   - Applications relying on specific error messages will break

3. **Option Names**:
   - Some option names have changed
   - Type definitions have been updated

### Code Changes Required

```javascript
// Before (v8.5.1)
const token = jwt.sign({ data }, secretKey, { expiresIn: '15m' });
const decoded = jwt.verify(token, secretKey);

// After (v9.0.0)
const token = jwt.sign({ data }, secretKey, { expiresIn: '15m', algorithm: 'HS256' });
const decoded = jwt.verify(token, secretKey, { algorithms: ['HS256'] });
```

## 2. marked@0.3.9

### Vulnerability

- **CVE-2022-21680 / CVE-2022-21648**: Regular Expression Denial of Service (ReDoS)
- **Severity**: Medium
- **Fixed in**: marked@4.0.10+
- **Location**: `grocery-shared/package.json`
- **Usage**: Markdown notes on items

### Breaking Changes in v4.0.10+

The upgrade to marked@4.0.10+ introduces significant API changes:

1. **Function Signature**:
   - Changed from `marked(text)` to `marked.parse(text)`
   - Different return types and behavior

2. **Module Format**:
   - ESM build is now the default
   - Import syntax changes required

3. **Options Handling**:
   - Option structure and names have changed
   - Renderer hooks work differently

### Code Changes Required

```javascript
// Before (v0.3.9)
const marked = require('marked');
const html = marked(markdownText);

// After (v4.0.10+)
// ESM style:
import { marked } from 'marked';
const html = marked.parse(markdownText);

// CommonJS style:
const { marked } = require('marked');
const html = marked.parse(markdownText);
```

## 3. fast-xml-parser@3.21.1

### Vulnerability

- **CVE-2024-41818**: Regular Expression Denial of Service (ReDoS)
- **Severity**: Medium
- **Fixed in**: fast-xml-parser@4.4.1+
- **Location**: `grocery-infra/package.json`
- **Usage**: XML store layout parsing

### Breaking Changes in v4.4.1+

The upgrade to fast-xml-parser@4.4.1+ completely changes the API:

1. **Class-based API**:
   - Replaced function-based API with class-based API (XMLParser class)
   - Different instantiation and usage patterns

2. **Option Names**:
   - Many option names have changed
   - Some options have been removed or replaced

3. **Parsing Method**:
   - Different method signature and behavior
   - Changed attribute handling

### Code Changes Required

```javascript
// Before (v3.21.1)
const parser = require('fast-xml-parser');
const options = {
  attributeNamePrefix: '',
  attrNodeName: 'attr',
  ignoreAttributes: false
};

if (parser.validate(xmlData) === true) {
  const jsonObj = parser.parse(xmlData, options);
}

// After (v4.4.1+)
const { XMLParser } = require('fast-xml-parser');
const options = {
  attributeNamePrefix: '',
  isAttributeNameExists: true,
  ignoreAttributes: false
};

const parser = new XMLParser(options);
const jsonObj = parser.parse(xmlData);
```

## Testing SCA Tools

This project is designed to test how SCA tools handle vulnerabilities that require major version upgrades with breaking changes. When running SCA tools against this project, they should:

1. Detect the vulnerable packages
2. Identify the minimum safe versions (which are major upgrades)
3. Ideally, suggest code modifications needed for safe upgrades

## Upgrade Strategy

When upgrading these packages:

1. **Identify all usage points** in the codebase
2. **Create tests** to verify current functionality
3. **Update package versions** in package.json files
4. **Refactor code** to use the new APIs
5. **Run tests** to ensure functionality is preserved

## Test Cases

The project includes test cases that demonstrate the functionality with the vulnerable versions and will fail when upgrading without code changes:

- JWT sharing functionality tests
- Markdown notes rendering tests
- XML store layout parsing tests

These tests can be used to verify that the upgrades are applied correctly.