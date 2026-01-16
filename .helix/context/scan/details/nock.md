# nock - Vulnerability Details
**Package to Upgrade:** `nock`
**Total Vulnerabilities:** 1
**Severity Breakdown:** 0 Critical, 0 High, 0 Medium, 1 Low

## Affected Lockfiles
- `grocery-infra/package-lock.json`

## Summary
These vulnerabilities are in transitive dependencies. Upgrade `nock` in package.json to fix them.

## Vulnerabilities

### debug
**Vulnerable Package:** `debug`
**CVE Count:** 1

#### GHSA-gxpj-cx7g-858c
**Severity:** LOW
**CVSS Score:** 3.7

**Dependency Chain:** grocery-infra → nock → debug

**Summary:** Regular Expression Denial of Service in debug

**Details:** Affected versions of `debug` are vulnerable to regular expression denial of service when untrusted user input is passed into the `o` formatter. 

As it takes 50,000 characters to block the event loop for 2 seconds, this issue is a low severity issue.

This was later re-introduced in version v3.2.0, and then repatched in versions 3.2.7 and 4.3.1.

## Recommendation

Version 2.x.x: Update to version 2.6.9 or later.
Version 3.1.x: Update to version 3.1.0 or later.
Version 3.2.x: Update to version 3.2.7 or later.
Version 4.x.x: Update to version 4.3.1 or later.

**Fixed In:** 2.6.9, 3.1.0, 3.2.7 (and 1 more)

**Direct Upgrade:** `npm install debug@2.6.9` (adds as direct dependency)

**Suggested Fix:** npm install nock@latest (upgrade parent - triage will determine best version)

**References:**
- https://nvd.nist.gov/vuln/detail/CVE-2017-16137
- https://github.com/debug-js/debug/issues/797
- https://github.com/visionmedia/debug/issues/501
- https://github.com/visionmedia/debug/pull/504
- https://github.com/debug-js/debug/commit/4e2150207c568adb9ead8f4c4528016081c88020
- ... and 6 more

---

#### Triage Assessment for debug

**Status:** Completed

**Codebase Impact:** Low (dev-only). nock is only imported in tests at grocery-infra/test/importSampleData.test.js. The vulnerable behavior in debug requires passing untrusted user input into the %o formatter; nock's usage of debug does not use %o in our installed code, and our installed debug version is 4.4.1 (package-lock), which includes the fix (>=4.3.1). Additionally, nock is a test/dev dependency and not used in production code paths.

**Upgrade Decision:** Accept risk / No action required

**Remediation Plan:**

## Remediation Plan for debug

- Upgrade Decision: Accept risk (no upgrade required)

- Analysis:
  - Current nock version: devDependency ^13.5.1 (installed 13.5.6)
  - Current debug version (transitive): 4.4.1 (fixed per advisory >=4.3.1)
  - Dependency Chain: nock → debug
  - Dependency Type: Transitive; dev-only usage in tests
  - Affected code: grocery-infra/test/importSampleData.test.js uses nock to mock HTTP; no production imports found

- Recommendation:
  - No immediate changes needed. Keep nock updated via regular dependency maintenance. If pinning is desired, ensure debug >= 4.3.1 (already satisfied).

- Testing Checklist:
  - [ ] Run jest test suite in grocery-infra
  - [ ] Verify no production code imports nock
  - [ ] Monitor for future advisories on nock or debug

---

