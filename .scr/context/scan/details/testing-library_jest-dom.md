# @testing-library/jest-dom - Vulnerability Details

**Package to Upgrade:** `@testing-library/jest-dom`

**Total Vulnerabilities:** 6

**Severity Breakdown:** 0 Critical, 2 High, 4 Medium, 0 Low

## Affected Lockfiles

- `./grocery-shared/grocery-web/package-lock.json`

## Summary

These vulnerabilities are in transitive dependencies. Upgrade `@testing-library/jest-dom` in package.json to fix them.

## Vulnerabilities

### lodash

**Vulnerable Package:** `lodash`

**CVE Count:** 6

#### GHSA-r5fr-rjxr-66jc

**Severity:** HIGH

**CVSS Score:** 9.0

**Dependency Chain:** root → @testing-library/jest-dom → lodash

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

**Direct Upgrade:** `npm install lodash@4.18.0` (adds as direct dependency)

**Suggested Fix:** npm install @testing-library/jest-dom@latest (upgrade parent)

---

#### GHSA-r5fr-rjxr-66jc

**Severity:** HIGH

**CVSS Score:** 9.0

**Dependency Chain:** root → @testing-library/jest-dom → lodash

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

**Direct Upgrade:** `npm install lodash@4.18.0` (adds as direct dependency)

**Suggested Fix:** npm install @testing-library/jest-dom@latest (upgrade parent)

---

#### GHSA-f23m-r3pf-42rh

**Severity:** MEDIUM

**CVSS Score:** 5.0

**Dependency Chain:** root → @testing-library/jest-dom → lodash

**Summary:** lodash vulnerable to Prototype Pollution via array path bypass in `_.unset` and `_.omit`

**Details:** ### Impact

Lodash versions 4.17.23 and earlier are vulnerable to prototype pollution in the `_.unset` and `_.omit` functions. The fix for [CVE-2025-13465](https://github.com/lodash/lodash/security/advisories/GHSA-xxjr-mmjv-4gpg) only guards against string key members, so an attacker can bypass the check by passing array-wrapped path segments. This allows deletion of properties from built-in prototypes such as `Object.prototype`, `Number.prototype`, and `String.prototype`.

The issue permits deletion of prototype properties but does not allow overwriting their original behavior.

### Patches

This issue is patched in 4.18.0.

### Workarounds

None. Upgrade to the patched version.

**Fixed In:** 4.18.0, 4.18.0, 4.18.0

**Direct Upgrade:** `npm install lodash@4.18.0` (adds as direct dependency)

**Suggested Fix:** npm install @testing-library/jest-dom@latest (upgrade parent)

---

#### GHSA-xxjr-mmjv-4gpg

**Severity:** MEDIUM

**CVSS Score:** 5.0

**Dependency Chain:** root → @testing-library/jest-dom → lodash

**Summary:** Lodash has Prototype Pollution Vulnerability in `_.unset` and `_.omit` functions

**Details:** ### Impact

Lodash versions 4.0.0 through 4.17.22 are vulnerable to prototype pollution in the `_.unset` and `_.omit` functions. An attacker can pass crafted paths which cause Lodash to delete methods from global prototypes. 

The issue permits deletion of properties but does not allow overwriting their original behavior.  

### Patches

This issue is patched on 4.17.23.

**Fixed In:** 4.17.23, 4.17.23, 4.17.23

**Direct Upgrade:** `npm install lodash@4.17.23` (adds as direct dependency)

**Suggested Fix:** npm install @testing-library/jest-dom@latest (upgrade parent)

---

#### GHSA-f23m-r3pf-42rh

**Severity:** MEDIUM

**CVSS Score:** 5.0

**Dependency Chain:** root → @testing-library/jest-dom → lodash

**Summary:** lodash vulnerable to Prototype Pollution via array path bypass in `_.unset` and `_.omit`

**Details:** ### Impact

Lodash versions 4.17.23 and earlier are vulnerable to prototype pollution in the `_.unset` and `_.omit` functions. The fix for [CVE-2025-13465](https://github.com/lodash/lodash/security/advisories/GHSA-xxjr-mmjv-4gpg) only guards against string key members, so an attacker can bypass the check by passing array-wrapped path segments. This allows deletion of properties from built-in prototypes such as `Object.prototype`, `Number.prototype`, and `String.prototype`.

The issue permits deletion of prototype properties but does not allow overwriting their original behavior.

### Patches

This issue is patched in 4.18.0.

### Workarounds

None. Upgrade to the patched version.

**Fixed In:** 4.18.0, 4.18.0, 4.18.0

**Direct Upgrade:** `npm install lodash@4.18.0` (adds as direct dependency)

**Suggested Fix:** npm install @testing-library/jest-dom@latest (upgrade parent)

---

#### GHSA-xxjr-mmjv-4gpg

**Severity:** MEDIUM

**CVSS Score:** 5.0

**Dependency Chain:** root → @testing-library/jest-dom → lodash

**Summary:** Lodash has Prototype Pollution Vulnerability in `_.unset` and `_.omit` functions

**Details:** ### Impact

Lodash versions 4.0.0 through 4.17.22 are vulnerable to prototype pollution in the `_.unset` and `_.omit` functions. An attacker can pass crafted paths which cause Lodash to delete methods from global prototypes. 

The issue permits deletion of properties but does not allow overwriting their original behavior.  

### Patches

This issue is patched on 4.17.23.

**Fixed In:** 4.17.23, 4.17.23, 4.17.23

**Direct Upgrade:** `npm install lodash@4.17.23` (adds as direct dependency)

**Suggested Fix:** npm install @testing-library/jest-dom@latest (upgrade parent)

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

