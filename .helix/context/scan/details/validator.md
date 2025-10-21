# Direct - Vulnerability Details
**Package to Upgrade:** `Direct`
**Total Vulnerabilities:** 3
**Severity Breakdown:** 0 Critical, 0 High, 3 Medium, 0 Low

## Affected Lockfiles
- `grocery-shared/package-lock.json`

## Summary
This is a direct dependency. Upgrade it directly in package.json.

## Vulnerabilities

### validator
**Vulnerable Package:** `validator`
**CVE Count:** 3

#### GHSA-9965-vmph-33xx
**Severity:** MEDIUM

**Dependency Chain:** validator

**Description:** validator.js has a URL validation bypass vulnerability in its isURL function

**Status:** No fix available

---

#### GHSA-qgmg-gppg-76g5
**Severity:** MEDIUM

**Dependency Chain:** validator

**Description:** Inefficient Regular Expression Complexity in validator.js

**Fixed In:** 13.7.0

**Direct Fix:** `npm install validator@13.7.0`

---

#### GHSA-xx4c-jj58-r7x6
**Severity:** MEDIUM

**Dependency Chain:** validator

**Description:** Inefficient Regular Expression Complexity in Validator.js

**Fixed In:** 13.7.0

**Direct Fix:** `npm install validator@13.7.0`

---

#### Triage Assessment for validator

## Remediation Plan for validator

**Upgrade Decision:** Upgrade now

**Analysis:**
- Current version: 13.5.2 (from grocery-shared/package.json)
- Target version: 13.7.0 (fixes GHSA-qgmg-gppg-76g5 and GHSA-xx4c-jj58-r7x6; GHSA-9965-vmph-33xx currently has no fix)
- Breaking changes: No (patch/minor upgrade within 13.x)
- Affected code: validator is only imported in test code at grocery-shared/test/Item.test.js and used via validator.isEmail(); no imports in production code under grocery-shared/src

**Recommendation:**
- Run: npm install validator@13.7.0 in grocery-shared
- Keep tracking GHSA-9965-vmph-33xx (isURL validation bypass) for a future fix; since validator is not used in production, residual risk is minimal

**Testing Checklist:**
- [ ] Run existing test suite: npm test in grocery-shared
- [ ] Spot-check any validation-related tests that rely on validator (Item.test.js)
- [ ] Verify no breaking changes in packaging or build

---

