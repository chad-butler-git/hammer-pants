# flatted - Vulnerability Details

**Package to Upgrade:** `flatted`

**Total Vulnerabilities:** 4

**Severity Breakdown:** 0 Critical, 4 High, 0 Medium, 0 Low

## Affected Lockfiles

- `./grocery-shared/grocery-web/package-lock.json`

## Summary

These vulnerabilities are in transitive dependencies. Upgrade `flatted` in package.json to fix them.

## Vulnerabilities

### flatted

**Vulnerable Package:** `flatted`

**CVE Count:** 4

#### GHSA-25h7-pfq9-p65f

**Severity:** HIGH

**CVSS Score:** 7.5

**Dependency Chain:** root → flatted

**Summary:** flatted vulnerable to unbounded recursion DoS in parse() revive phase

**Details:** ## Summary

flatted's `parse()` function uses a recursive `revive()` phase to resolve circular references in deserialized JSON. When given a crafted payload with deeply nested or self-referential `$` indices, the recursion depth is unbounded, causing a stack overflow that crashes the Node.js process.

## Impact

Denial of Service (DoS). Any application that passes untrusted input to `flatted.parse()` can be crashed by an unauthenticated attacker with a single request.

flatted has ~87M weekly npm downloads and is used as the circular-JSON serialization layer in many caching and logging libraries.

## Proof of Concept

```javascript
const flatted = require('flatted');

// Build deeply nested circular reference chain
const depth = 20000;
const arr = new Array(depth + 1);
arr[0] = '{"a":"1"}';
for (let i = 1; i <= depth; i++) {
  arr[i] = `{"a":"${i + 1}"}`;
}
arr[depth] = '{"a":"leaf"}';

const payload = JSON.stringify(arr);
flatted.parse(payload); // RangeError: Maximum call stack size exceeded
```

## Fix

The maintainer has already merged an iterative (non-recursive) implementation in PR #88, converting the recursive `revive()` to a stack-based loop.

## Affected Versions

All versions prior to the PR #88 fix.

**Fixed In:** 3.4.0

**Direct Upgrade:** `npm install flatted@3.4.0` (adds as direct dependency)

**Suggested Fix:** npm install flatted@latest (upgrade parent)

---

#### GHSA-rf6f-7fwh-wjgh

**Severity:** HIGH

**CVSS Score:** 9.0

**Dependency Chain:** root → flatted

**Summary:** Prototype Pollution via parse() in NodeJS flatted

**Details:** ---
  **Summary**

  The parse() function in flatted can use attacker-controlled string values from the parsed JSON as direct array index
  keys, without validating that they are numeric. Since the internal input buffer is a JavaScript Array, accessing it
  with the key "\_\_proto\_\_" returns Array.prototype via the inherited getter. This object is then treated as a legitimate
   parsed value and assigned as a property of the output object, effectively leaking a live reference to Array.prototype
   to the consumer. Any code that subsequently writes to that property will pollute the global prototype.

  ---
  **Root Cause**

  File: esm/index.js:29 (identical in cjs/index.js)
```
  const resolver = (input, lazy, parsed, $) => output => {
    for (let ke = keys(output), {length} = ke, y = 0; y < length; y++) {
      const k = ke[y];
      const value = output[k];    
      if (value instanceof Primitive) {
        const tmp = input[value];      // Bug is here
```

No validation that value is a safe numeric index input is built as a plain Array. JavaScript's property lookup on arrays traverses the prototype chain for non-numeric  keys. The key "\_\_proto\_\_" resolves to Array.prototype, which:

  - has type "object" → passes the typeof tmp === object guard at line 30
  - is not in the parsed Set yet → passes the !parsed.has(tmp) guard.
  - The reference to Array.prototype is then enqueued in lazy and later unconditionally assigned to the output object.
  ---
  **Replication Steps**
```
  const Flatted = require('flatted'); 
  const parsed = Flatted.parse('[{"x":"__proto__"}]');
  parsed.x.polluted = 'pwned';
  console.log([].polluted);  // Returns true
``` 
 ---
  **Impact**
 An attacker can supply a crafted flatted string to parse() that causes the returned object to hold a live reference to Array.prototype, enabling any downstream code that writes to that property to pollute the global prototype chain, potentially causing denial of service or code execution.

  **Recommended solution**
 Validate that the index string represents an integer within the bounds of input before accessing it:

  // Before (vulnerable)
  const tmp = input[value];

  // After (safe)
  const idx = +value;  // coerce boxed String → number
  const tmp = (Number.isInteger(idx) && idx >= 0 && idx < input.length)
    ? input[idx]
    : undefined;

**Fixed In:** 3.4.2

**Direct Upgrade:** `npm install flatted@3.4.2` (adds as direct dependency)

**Suggested Fix:** npm install flatted@latest (upgrade parent)

---

#### GHSA-25h7-pfq9-p65f

**Severity:** HIGH

**CVSS Score:** 7.5

**Dependency Chain:** root → flatted

**Summary:** flatted vulnerable to unbounded recursion DoS in parse() revive phase

**Details:** ## Summary

flatted's `parse()` function uses a recursive `revive()` phase to resolve circular references in deserialized JSON. When given a crafted payload with deeply nested or self-referential `$` indices, the recursion depth is unbounded, causing a stack overflow that crashes the Node.js process.

## Impact

Denial of Service (DoS). Any application that passes untrusted input to `flatted.parse()` can be crashed by an unauthenticated attacker with a single request.

flatted has ~87M weekly npm downloads and is used as the circular-JSON serialization layer in many caching and logging libraries.

## Proof of Concept

```javascript
const flatted = require('flatted');

// Build deeply nested circular reference chain
const depth = 20000;
const arr = new Array(depth + 1);
arr[0] = '{"a":"1"}';
for (let i = 1; i <= depth; i++) {
  arr[i] = `{"a":"${i + 1}"}`;
}
arr[depth] = '{"a":"leaf"}';

const payload = JSON.stringify(arr);
flatted.parse(payload); // RangeError: Maximum call stack size exceeded
```

## Fix

The maintainer has already merged an iterative (non-recursive) implementation in PR #88, converting the recursive `revive()` to a stack-based loop.

## Affected Versions

All versions prior to the PR #88 fix.

**Fixed In:** 3.4.0

**Direct Upgrade:** `npm install flatted@3.4.0` (adds as direct dependency)

**Suggested Fix:** npm install flatted@latest (upgrade parent)

---

#### GHSA-rf6f-7fwh-wjgh

**Severity:** HIGH

**CVSS Score:** 9.0

**Dependency Chain:** root → flatted

**Summary:** Prototype Pollution via parse() in NodeJS flatted

**Details:** ---
  **Summary**

  The parse() function in flatted can use attacker-controlled string values from the parsed JSON as direct array index
  keys, without validating that they are numeric. Since the internal input buffer is a JavaScript Array, accessing it
  with the key "\_\_proto\_\_" returns Array.prototype via the inherited getter. This object is then treated as a legitimate
   parsed value and assigned as a property of the output object, effectively leaking a live reference to Array.prototype
   to the consumer. Any code that subsequently writes to that property will pollute the global prototype.

  ---
  **Root Cause**

  File: esm/index.js:29 (identical in cjs/index.js)
```
  const resolver = (input, lazy, parsed, $) => output => {
    for (let ke = keys(output), {length} = ke, y = 0; y < length; y++) {
      const k = ke[y];
      const value = output[k];    
      if (value instanceof Primitive) {
        const tmp = input[value];      // Bug is here
```

No validation that value is a safe numeric index input is built as a plain Array. JavaScript's property lookup on arrays traverses the prototype chain for non-numeric  keys. The key "\_\_proto\_\_" resolves to Array.prototype, which:

  - has type "object" → passes the typeof tmp === object guard at line 30
  - is not in the parsed Set yet → passes the !parsed.has(tmp) guard.
  - The reference to Array.prototype is then enqueued in lazy and later unconditionally assigned to the output object.
  ---
  **Replication Steps**
```
  const Flatted = require('flatted'); 
  const parsed = Flatted.parse('[{"x":"__proto__"}]');
  parsed.x.polluted = 'pwned';
  console.log([].polluted);  // Returns true
``` 
 ---
  **Impact**
 An attacker can supply a crafted flatted string to parse() that causes the returned object to hold a live reference to Array.prototype, enabling any downstream code that writes to that property to pollute the global prototype chain, potentially causing denial of service or code execution.

  **Recommended solution**
 Validate that the index string represents an integer within the bounds of input before accessing it:

  // Before (vulnerable)
  const tmp = input[value];

  // After (safe)
  const idx = +value;  // coerce boxed String → number
  const tmp = (Number.isInteger(idx) && idx >= 0 && idx < input.length)
    ? input[idx]
    : undefined;

**Fixed In:** 3.4.2

**Direct Upgrade:** `npm install flatted@3.4.2` (adds as direct dependency)

**Suggested Fix:** npm install flatted@latest (upgrade parent)

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

