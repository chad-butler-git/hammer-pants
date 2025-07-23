# Grocery Shared

Re-usable JavaScript models and utilities for the grocery application.

## Description

This package contains shared models, utilities, and common code used across the grocery application ecosystem. It is published as a GitHub-hosted npm package.

## Installation

```bash
# Install dependencies
npm install
```

## Usage

### Local Development

During local development, you can link this package to other repositories:

```bash
# In this directory (grocery-shared)
npm link

# In the consuming repository (e.g., grocery-api or grocery-web)
npm link grocery-shared
```

### As a Dependency

To use this package as a dependency in other repositories, add it to your package.json:

```json
"dependencies": {
  "grocery-shared": "github:your-org/grocery-shared#v0.1.0"
}
```

Then import it in your code:

```javascript
const shared = require('grocery-shared');
// or
import shared from 'grocery-shared';
```

## Models

Model | Fields | Validation Rules |
|-------|--------|------------------|
Item | - id (UUID v4 string)<br>- name (string)<br>- category (string) | - id: required UUID v4<br>- name: required string<br>- category: required string |
Aisle | - number (integer)<br>- categories (array of strings) | - number: integer between 1-20<br>- categories: array of strings |
Store | - id (UUID v4 string)<br>- name (string)<br>- address (string)<br>- aisles (array of Aisle) | - id: required UUID v4<br>- name: required string<br>- address: required string<br>- aisles: array of valid Aisle objects |
ShoppingList | - id (UUID v4 string)<br>- storeId (UUID v4 string)<br>- items (array of Item) | - id: required UUID v4<br>- storeId: required UUID v4<br>- items: array of valid Item objects |
RouteStep | - aisleNumber (integer)<br>- items (array of Item) | - aisleNumber: integer between 1-20<br>- items: array of valid Item objects |

## License

MIT

## ⚠️ Known Vulnerabilities (intentional)

| CVE ID | Package | Version | Description | Location |
|--------|---------|---------|-------------|----------|
| CVE-2021-3762 | validator | 13.5.2 | ReDoS vulnerability in isEmail() | test/Item.test.js |

This vulnerability is intentionally included for security testing and educational purposes. The vulnerable version of validator (13.5.2) contains a Regular Expression Denial of Service (ReDoS) vulnerability in the isEmail() function, which can be exploited with specially crafted inputs to cause excessive CPU consumption.

## 🔍 False-Positive Examples

| Package | Version | Pattern | Explanation | Why it's a false positive |
|---------|---------|---------|-------------|---------------------------|
| marked | 0.3.9 | Unreachable vulnerable call | Added to dependencies with an unused file | Code exists but is never imported or executed |

This false-positive pattern demonstrates a scenario where a vulnerable package is installed but never actually used in the application. The file `src/unused/markdown.js` imports and calls the vulnerable `marked` package, but this file is never imported or executed anywhere else in the codebase. Security scanners will flag this vulnerability, but it poses no actual risk since the vulnerable code path is never executed.