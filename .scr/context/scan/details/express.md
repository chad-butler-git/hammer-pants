# express - Vulnerability Details

**Package to Upgrade:** `express`

**Total Vulnerabilities:** 3

**Severity Breakdown:** 0 Critical, 1 High, 1 Medium, 1 Low

## Affected Lockfiles

- `./grocery-api/package-lock.json`

## Summary

These vulnerabilities are in transitive dependencies. Upgrade `express` in package.json to fix them.

## Vulnerabilities

### path-to-regexp

**Vulnerable Package:** `path-to-regexp`

**CVE Count:** 1

#### GHSA-37ch-88jc-xwx2

**Severity:** HIGH

**CVSS Score:** 7.5

**Dependency Chain:** grocery-api → express → path-to-regexp

**Summary:** path-to-regexp vulnerable to Regular Expression Denial of Service via multiple route parameters

**Details:** ### Impact

A bad regular expression is generated any time you have three or more parameters within a single segment, separated by something that is not a period (`.`). For example, `/:a-:b-:c` or `/:a-:b-:c-:d`. The backtrack protection added in `path-to-regexp@0.1.12` only prevents ambiguity for two parameters. With three or more, the generated lookahead does not block single separator characters, so capture groups overlap and cause catastrophic backtracking.

### Patches

Upgrade to [path-to-regexp@0.1.13](https://github.com/pillarjs/path-to-regexp/releases/tag/v.0.1.13)

Custom regex patterns in route definitions (e.g., `/:a-:b([^-/]+)-:c([^-/]+)`) are not affected because they override the default capture group.

### Workarounds

All versions can be patched by providing a custom regular expression for parameters after the first in a single segment. As long as the custom regular expression does not match the text before the parameter, you will be safe. For example, change `/:a-:b-:c` to `/:a-:b([^-/]+)-:c([^-/]+)`.

If paths cannot be rewritten and versions cannot be upgraded, another alternative is to limit the URL length.

### References

- [GHSA-9wv6-86v2-598j](https://github.com/advisories/GHSA-9wv6-86v2-598j)
- [Detailed blog post: ReDoS the web](https://blakeembrey.com/posts/2024-09-web-redos/)

**Fixed In:** 0.1.13

**Direct Upgrade:** `npm install path-to-regexp@0.1.13` (adds as direct dependency)

**Suggested Fix:** npm install express@latest (upgrade parent)

---

### qs

**Vulnerable Package:** `qs`

**CVE Count:** 2

#### GHSA-6rw7-vpxm-498p

**Severity:** MEDIUM

**CVSS Score:** 7.5

**Dependency Chain:** grocery-api → express → qs

**Summary:** qs's arrayLimit bypass in its bracket notation allows DoS via memory exhaustion

**Details:** ### Summary

The `arrayLimit` option in qs did not enforce limits for bracket notation (`a[]=1&a[]=2`), only for indexed notation (`a[0]=1`). This is a consistency bug; `arrayLimit` should apply uniformly across all array notations.

**Note:** The default `parameterLimit` of 1000 effectively mitigates the DoS scenario originally described. With default options, bracket notation cannot produce arrays larger than `parameterLimit` regardless of `arrayLimit`, because each `a[]=value` consumes one parameter slot. The severity has been reduced accordingly.

### Details

The `arrayLimit` option only checked limits for indexed notation (`a[0]=1&a[1]=2`) but did not enforce it for bracket notation (`a[]=1&a[]=2`).

**Vulnerable code** (`lib/parse.js:159-162`):
```javascript
if (root === '[]' && options.parseArrays) {
    obj = utils.combine([], leaf);  // No arrayLimit check
}
```

**Working code** (`lib/parse.js:175`):
```javascript
else if (index <= options.arrayLimit) {  // Limit checked here
    obj = [];
    obj[index] = leaf;
}
```

The bracket notation handler at line 159 uses `utils.combine([], leaf)` without validating against `options.arrayLimit`, while indexed notation at line 175 checks `index <= options.arrayLimit` before creating arrays.

### PoC

```javascript
const qs = require('qs');
const result = qs.parse('a[]=1&a[]=2&a[]=3&a[]=4&a[]=5&a[]=6', { arrayLimit: 5 });
console.log(result.a.length);  // Output: 6 (should be max 5)
```

**Note on parameterLimit interaction:** The original advisory's "DoS demonstration" claimed a length of 10,000, but `parameterLimit` (default: 1000) caps parsing to 1,000 parameters. With default options, the actual output is 1,000, not 10,000.

### Impact

Consistency bug in `arrayLimit` enforcement. With default `parameterLimit`, the practical DoS risk is negligible since `parameterLimit` already caps the total number of parsed parameters (and thus array elements from bracket notation). The risk increases only when `parameterLimit` is explicitly set to a very high value.

**Fixed In:** 6.14.1

**Direct Upgrade:** `npm install qs@6.14.1` (adds as direct dependency)

**Suggested Fix:** npm install express@latest (upgrade parent)

---

#### GHSA-w7fw-mjwx-w883

**Severity:** LOW

**CVSS Score:** 7.5

**Dependency Chain:** grocery-api → express → qs

**Summary:** qs's arrayLimit bypass in comma parsing allows denial of service

**Details:** ### Summary
The `arrayLimit` option in qs does not enforce limits for comma-separated values when `comma: true` is enabled, allowing attackers to cause denial-of-service via memory exhaustion. This is a bypass of the array limit enforcement, similar to the bracket notation bypass addressed in GHSA-6rw7-vpxm-498p (CVE-2025-15284).

### Details
When the `comma` option is set to `true` (not the default, but configurable in applications), qs allows parsing comma-separated strings as arrays (e.g., `?param=a,b,c` becomes `['a', 'b', 'c']`). However, the limit check for `arrayLimit` (default: 20) and the optional throwOnLimitExceeded occur after the comma-handling logic in `parseArrayValue`, enabling a bypass. This permits creation of arbitrarily large arrays from a single parameter, leading to excessive memory allocation.

**Vulnerable code** (lib/parse.js: lines ~40-50):
```js
if (val && typeof val === 'string' && options.comma && val.indexOf(',') > -1) {
    return val.split(',');
}

if (options.throwOnLimitExceeded && currentArrayLength >= options.arrayLimit) {
    throw new RangeError('Array limit exceeded. Only ' + options.arrayLimit + ' element' + (options.arrayLimit === 1 ? '' : 's') + ' allowed in an array.');
}

return val;
```
The `split(',')` returns the array immediately, skipping the subsequent limit check. Downstream merging via `utils.combine` does not prevent allocation, even if it marks overflows for sparse arrays.This discrepancy allows attackers to send a single parameter with millions of commas (e.g., `?param=,,,,,,,,...`), allocating massive arrays in memory without triggering limits. It bypasses the intent of `arrayLimit`, which is enforced correctly for indexed (`a[0]=`) and bracket (`a[]=`) notations (the latter fixed in v6.14.1 per GHSA-6rw7-vpxm-498p).

### PoC
**Test 1 - Basic bypass:**
```
npm install qs
```

```js
const qs = require('qs');

const payload = 'a=' + ','.repeat(25);  // 26 elements after split (bypasses arrayLimit: 5)
const options = { comma: true, arrayLimit: 5, throwOnLimitExceeded: true };

try {
  const result = qs.parse(payload, options);
  console.log(result.a.length);  // Outputs: 26 (bypass successful)
} catch (e) {
  console.log('Limit enforced:', e.message);  // Not thrown
}
```
**Configuration:**
- `comma: true`
- `arrayLimit: 5`
- `throwOnLimitExceeded: true`

Expected: Throws "Array limit exceeded" error.
Actual: Parses successfully, creating an array of length 26.


### Impact
Denial of Service (DoS) via memory exhaustion.

### Suggested Fix
Move the `arrayLimit` check before the comma split in `parseArrayValue`, and enforce it on the resulting array length. Use `currentArrayLength` (already calculated upstream) for consistency with bracket notation fixes.

**Current code** (lib/parse.js: lines ~40-50):
```js
if (val && typeof val === 'string' && options.comma && val.indexOf(',') > -1) {
    return val.split(',');
}

if (options.throwOnLimitExceeded && currentArrayLength >= options.arrayLimit) {
    throw new RangeError('Array limit exceeded. Only ' + options.arrayLimit + ' element' + (options.arrayLimit === 1 ? '' : 's') + ' allowed in an array.');
}

return val;
```

**Fixed code:**
```js
if (val && typeof val === 'string' && options.comma && val.indexOf(',') > -1) {
    const splitArray = val.split(',');
    if (splitArray.length > options.arrayLimit - currentArrayLength) {  // Check against remaining limit
        if (options.throwOnLimitExceeded) {
            throw new RangeError('Array limit exceeded. Only ' + options.arrayLimit + ' element' + (options.arrayLimit === 1 ? '' : 's') + ' allowed in an array.');
        } else {
            // Optionally convert to object or truncate, per README
            return splitArray.slice(0, options.arrayLimit - currentArrayLength);
        }
    }
    return splitArray;
}

if (options.throwOnLimitExceeded && currentArrayLength >= options.arrayLimit) {
    throw new RangeError('Array limit exceeded. Only ' + options.arrayLimit + ' element' + (options.arrayLimit === 1 ? '' : 's') + ' allowed in an array.');
}

return val;
```
This aligns behavior with indexed and bracket notations, reuses `currentArrayLength`, and respects `throwOnLimitExceeded`. Update README to note the consistent enforcement.

**Fixed In:** 6.14.2

**Direct Upgrade:** `npm install qs@6.14.2` (adds as direct dependency)

**Suggested Fix:** npm install express@latest (upgrade parent)

---

## Remediation Plan

**Triage Status:** Pending

**Upgrade Decision:** _To be determined by triage agent_

### Analysis

- **Current Version:** _To be determined_
- **Target Version:** _To be determined_
- **Breaking Changes:** _To be determined_
- **Affected Code:** _To be determined by codebase analysis_
- **Exposure Analysis:** _To be determined_

### Recommendation

_To be filled in by triage agent after codebase analysis_

### Testing Checklist

- [ ] Run existing test suite
- [ ] Verify no breaking changes in affected code paths
- [ ] Smoke test affected functionality

---

