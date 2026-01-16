# validator - Vulnerability Details
**Package to Upgrade:** `validator`
**Total Vulnerabilities:** 4
**Severity Breakdown:** 0 Critical, 1 High, 3 Medium, 0 Low

## Affected Lockfiles
- `grocery-shared/package-lock.json`

## Summary
This is a direct dependency. Upgrade `validator` directly in package.json.

## Vulnerabilities

### validator
**Vulnerable Package:** `validator`
**CVE Count:** 4

#### GHSA-vghf-hv5q-vc2g
**Severity:** HIGH
**CVSS Score:** 7.7

**Dependency Chain:** grocery-shared → validator

**Summary:** Validator is Vulnerable to Incomplete Filtering of One or More Instances of Special Elements

**Details:** Versions of the package validator before 13.15.22 are vulnerable to Incomplete Filtering of One or More Instances of Special Elements in the isLength() function that does not take into account Unicode variation selectors (\uFE0F, \uFE0E) appearing in a sequence which lead to improper string length calculation. This can lead to an application using isLength for input validation accepting strings significantly longer than intended, resulting in issues like data truncation in databases, buffer overflows in other system components, or denial-of-service.

**Fixed In:** 13.15.22

**Recommended Fix:** `npm install validator@13.15.22`

**References:**
- https://nvd.nist.gov/vuln/detail/CVE-2025-12758
- https://github.com/validatorjs/validator.js/pull/2616
- https://github.com/validatorjs/validator.js/commit/d457ecaf55b0f3d8bd379d82757425d0d13dd382
- https://gist.github.com/koral--/ad31208b25b9e3d1e2e35f1d4d72572e
- https://github.com/validatorjs/validator.js
- ... and 1 more

---

#### GHSA-9965-vmph-33xx
**Severity:** MODERATE
**CVSS Score:** 6.1

**Dependency Chain:** grocery-shared → validator

**Summary:** validator.js has a URL validation bypass vulnerability in its isURL function

**Details:** A URL validation bypass vulnerability exists in validator.js prior to version 13.15.20. The isURL() function uses '://' as a delimiter to parse protocols, while browsers use ':' as the delimiter. This parsing difference allows attackers to bypass protocol and domain validation by crafting URLs leading to XSS and Open Redirect attacks.

**Fixed In:** 13.15.20

**Recommended Fix:** `npm install validator@13.15.20`

**References:**
- https://nvd.nist.gov/vuln/detail/CVE-2025-56200
- https://github.com/validatorjs/validator.js/issues/2600
- https://github.com/validatorjs/validator.js/pull/2608
- https://github.com/validatorjs/validator.js/commit/cbef5088f02d36caf978f378bb845fe49bdc0809
- https://gist.github.com/junan-98/27ae092aa40e2a057d41a0f95148f666
- ... and 4 more

---

#### GHSA-qgmg-gppg-76g5
**Severity:** MODERATE
**CVSS Score:** 5.3

**Dependency Chain:** grocery-shared → validator

**Summary:** Inefficient Regular Expression Complexity in validator.js

**Details:** validator.js prior to 13.7.0 is vulnerable to Inefficient Regular Expression Complexity

**Fixed In:** 13.7.0

**Recommended Fix:** `npm install validator@13.7.0`

**References:**
- https://nvd.nist.gov/vuln/detail/CVE-2021-3765
- https://github.com/validatorjs/validator.js/commit/496fc8b2a7f5997acaaec33cc44d0b8dba5fb5e1
- https://github.com/validatorjs/validator.js
- https://huntr.dev/bounties/c37e975c-21a3-4c5f-9b57-04d63b28cfc9

---

#### GHSA-xx4c-jj58-r7x6
**Severity:** MODERATE
**CVSS Score:** 5.3

**Dependency Chain:** grocery-shared → validator

**Summary:** Inefficient Regular Expression Complexity in Validator.js

**Details:** ### Impact
Versions of `validator` prior to 13.7.0 are affected by an inefficient Regular Expression complexity  when using the `rtrim` and `trim` sanitizers.

### Patches
The problem has been patched in validator 13.7.0

**Fixed In:** 13.7.0

**Recommended Fix:** `npm install validator@13.7.0`

**References:**
- https://github.com/validatorjs/validator.js/security/advisories/GHSA-xx4c-jj58-r7x6
- https://nvd.nist.gov/vuln/detail/CVE-2021-3765
- https://github.com/validatorjs/validator.js/issues/1599
- https://github.com/validatorjs/validator.js/pull/1738
- https://github.com/validatorjs/validator.js
- ... and 1 more

---

#### Triage Assessment for validator

## Remediation Plan for validator

Upgrade Decision: Upgrade now

Analysis:
- Current version: 13.5.2 (grocery-shared/package.json)
- Target version: 13.15.22
- Breaking changes: No (within major v13)
- Vulnerable APIs per CVEs: isURL (parsing bypass), isLength (Unicode variation selector length), trim/rtrim (regex DoS), general inefficient regex complexity prior to 13.7.0
- Affected code: No production imports found in grocery-api/src, grocery-shared/src, or grocery-web/src; test-only usage found in grocery-shared/test/Item.test.js (validator.isEmail)

Recommendation:
- Update dependency in grocery-shared/package.json: "validator": "13.15.22"
- Run npm install in grocery-shared to refresh package-lock.json
- Commit changes and open PR; since this is a patch/minor upgrade within v13, breaking risk is low

Testing Checklist:
- [ ] Run the full test suite in all packages
- [ ] Spot-check any input validation flows that could rely on URL/length/trim sanitization
- [ ] Verify no regressions in test utilities that import validator (grocery-shared/test/Item.test.js)

---

