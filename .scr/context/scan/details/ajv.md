# ajv - Vulnerability Details

**Package to Upgrade:** `ajv`

**Total Vulnerabilities:** 2

**Severity Breakdown:** 0 Critical, 0 High, 2 Medium, 0 Low

## Affected Lockfiles

- `./grocery-shared/grocery-web/package-lock.json`

## Summary

These vulnerabilities are in transitive dependencies. Upgrade `ajv` in package.json to fix them.

## Vulnerabilities

### ajv

**Vulnerable Package:** `ajv`

**CVE Count:** 2

#### GHSA-2g4f-4pwh-qvx6

**Severity:** MEDIUM

**CVSS Score:** 5.0

**Dependency Chain:** root → ajv

**Summary:** ajv has ReDoS when using `$data` option

**Details:** ajv (Another JSON Schema Validator) through version 8.17.1 is vulnerable to Regular Expression Denial of Service (ReDoS) when the `$data` option is enabled. The pattern keyword accepts runtime data via JSON Pointer syntax (`$data` reference), which is passed directly to the JavaScript `RegExp()` constructor without validation. An attacker can inject a malicious regex pattern (e.g., `\"^(a|a)*$\"`) combined with crafted input to cause catastrophic backtracking. A 31-character payload causes approximately 44 seconds of CPU blocking, with each additional character doubling execution time. This enables complete denial of service with a single HTTP request against any API using ajv with `$data`: true for dynamic schema validation.

**Fixed In:** 8.18.0, 6.14.0

**Direct Upgrade:** `npm install ajv@8.18.0` (adds as direct dependency)

**Suggested Fix:** npm install ajv@latest (upgrade parent)

---

#### GHSA-2g4f-4pwh-qvx6

**Severity:** MEDIUM

**CVSS Score:** 5.0

**Dependency Chain:** root → ajv

**Summary:** ajv has ReDoS when using `$data` option

**Details:** ajv (Another JSON Schema Validator) through version 8.17.1 is vulnerable to Regular Expression Denial of Service (ReDoS) when the `$data` option is enabled. The pattern keyword accepts runtime data via JSON Pointer syntax (`$data` reference), which is passed directly to the JavaScript `RegExp()` constructor without validation. An attacker can inject a malicious regex pattern (e.g., `\"^(a|a)*$\"`) combined with crafted input to cause catastrophic backtracking. A 31-character payload causes approximately 44 seconds of CPU blocking, with each additional character doubling execution time. This enables complete denial of service with a single HTTP request against any API using ajv with `$data`: true for dynamic schema validation.

**Fixed In:** 8.18.0, 6.14.0

**Direct Upgrade:** `npm install ajv@8.18.0` (adds as direct dependency)

**Suggested Fix:** npm install ajv@latest (upgrade parent)

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

