# lodash - Vulnerability Details

**Package to Upgrade:** `lodash`

**Total Vulnerabilities:** 5

**Severity Breakdown:** 0 Critical, 2 High, 3 Medium, 0 Low

## Affected Lockfiles

- `./grocery-api/package-lock.json`

## Summary

This is a direct dependency. Upgrade `lodash` directly in package.json.

## Vulnerabilities

### lodash

**Vulnerable Package:** `lodash`

**CVE Count:** 5

#### GHSA-35jh-r3h4-6jhm

**Severity:** HIGH

**CVSS Score:** 9.0

**Dependency Chain:** grocery-api → lodash

**Summary:** Command Injection in lodash

**Details:** `lodash` versions prior to 4.17.21 are vulnerable to Command Injection via the template function.

**Fixed In:** 4.17.21, 4.17.21, 4.17.21

**Recommended Fix:** `npm install lodash@4.17.21`

---

#### GHSA-r5fr-rjxr-66jc

**Severity:** HIGH

**CVSS Score:** 9.0

**Dependency Chain:** grocery-api → lodash

**Summary:** lodash vulnerable to Code Injection via `_.template` imports key names

**Details:** ### Impact

The fix for [CVE-2021-23337](https://github.com/advisories/GHSA-35jh-r3h4-6jhm) added validation for the `variable` option in `_.template` but did not apply the same validation to `options.imports` key names. Both paths flow into the same `Function()` constructor sink.

When an application passes untrusted input as `options.imports` key names, an attacker can inject default-parameter expressions that execute arbitrary code at template compilation time.

Additionally, `_.template` uses `assignInWith` to merge imports, which enumerates inherited properties via `for..in`. If `Object.prototype` has been polluted by any other vector, the polluted keys are copied into the imports object and passed to `Function()`.

### Patches

Users should upgrade to version 4.18.0.

The fix applies two changes:
1. Validate `importsKeys` against the existing `reForbiddenIdentifierChars` regex (same check already used for the `variable` option)
2. Replace `assignInWith` with `assignWith` when merging imports, so only own properties are enumerated

### Workarounds

Do not pass untrusted input as key names in `options.imports`. Only use developer-controlled, static key names.

**Fixed In:** 4.18.0, 4.18.0, 4.18.0

**Recommended Fix:** `npm install lodash@4.18.0`

---

#### GHSA-29mw-wpgm-hmr9

**Severity:** MEDIUM

**CVSS Score:** 5.0

**Dependency Chain:** grocery-api → lodash

**Summary:** Regular Expression Denial of Service (ReDoS) in lodash

**Details:** All versions of package lodash prior to 4.17.21 are vulnerable to Regular Expression Denial of Service (ReDoS) via the `toNumber`, `trim` and `trimEnd` functions. 

Steps to reproduce (provided by reporter Liyuan Chen):
```js
var lo = require('lodash');

function build_blank(n) {
    var ret = "1"
    for (var i = 0; i < n; i++) {
        ret += " "
    }
    return ret + "1";
}
var s = build_blank(50000) var time0 = Date.now();
lo.trim(s) 
var time_cost0 = Date.now() - time0;
console.log("time_cost0: " + time_cost0);
var time1 = Date.now();
lo.toNumber(s) var time_cost1 = Date.now() - time1;
console.log("time_cost1: " + time_cost1);
var time2 = Date.now();
lo.trimEnd(s);
var time_cost2 = Date.now() - time2;
console.log("time_cost2: " + time_cost2);
```

**Fixed In:** 4.17.21, 4.17.21, 4.17.21

**Recommended Fix:** `npm install lodash@4.17.21`

---

#### GHSA-f23m-r3pf-42rh

**Severity:** MEDIUM

**CVSS Score:** 5.0

**Dependency Chain:** grocery-api → lodash

**Summary:** lodash vulnerable to Prototype Pollution via array path bypass in `_.unset` and `_.omit`

**Details:** ### Impact

Lodash versions 4.17.23 and earlier are vulnerable to prototype pollution in the `_.unset` and `_.omit` functions. The fix for [CVE-2025-13465](https://github.com/lodash/lodash/security/advisories/GHSA-xxjr-mmjv-4gpg) only guards against string key members, so an attacker can bypass the check by passing array-wrapped path segments. This allows deletion of properties from built-in prototypes such as `Object.prototype`, `Number.prototype`, and `String.prototype`.

The issue permits deletion of prototype properties but does not allow overwriting their original behavior.

### Patches

This issue is patched in 4.18.0.

### Workarounds

None. Upgrade to the patched version.

**Fixed In:** 4.18.0, 4.18.0, 4.18.0

**Recommended Fix:** `npm install lodash@4.18.0`

---

#### GHSA-xxjr-mmjv-4gpg

**Severity:** MEDIUM

**CVSS Score:** 5.0

**Dependency Chain:** grocery-api → lodash

**Summary:** Lodash has Prototype Pollution Vulnerability in `_.unset` and `_.omit` functions

**Details:** ### Impact

Lodash versions 4.0.0 through 4.17.22 are vulnerable to prototype pollution in the `_.unset` and `_.omit` functions. An attacker can pass crafted paths which cause Lodash to delete methods from global prototypes. 

The issue permits deletion of properties but does not allow overwriting their original behavior.  

### Patches

This issue is patched on 4.17.23.

**Fixed In:** 4.17.23, 4.17.23, 4.17.23

**Recommended Fix:** `npm install lodash@4.17.23`

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

