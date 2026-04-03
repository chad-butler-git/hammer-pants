# nock - Vulnerability Details

**Package to Upgrade:** `nock`

**Total Vulnerabilities:** 1

**Severity Breakdown:** 0 Critical, 0 High, 0 Medium, 1 Low

## Affected Lockfiles

- `./grocery-infra/package-lock.json`

## Summary

These vulnerabilities are in transitive dependencies. Upgrade `nock` in package.json to fix them.

## Vulnerabilities

### debug

**Vulnerable Package:** `debug`

**CVE Count:** 1

#### GHSA-gxpj-cx7g-858c

**Severity:** LOW

**CVSS Score:** 7.5

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

**Fixed In:** 2.6.9, 3.1.0, 3.2.7

**Direct Upgrade:** `npm install debug@2.6.9` (adds as direct dependency)

**Suggested Fix:** npm install nock@latest (upgrade parent)

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

