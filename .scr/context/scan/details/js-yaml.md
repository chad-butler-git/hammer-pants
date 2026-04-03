# js-yaml - Vulnerability Details

**Package to Upgrade:** `js-yaml`

**Total Vulnerabilities:** 2

**Severity Breakdown:** 0 Critical, 0 High, 2 Medium, 0 Low

## Affected Lockfiles

- `./grocery-shared/grocery-web/package-lock.json`

## Summary

These vulnerabilities are in transitive dependencies. Upgrade `js-yaml` in package.json to fix them.

## Vulnerabilities

### js-yaml

**Vulnerable Package:** `js-yaml`

**CVE Count:** 2

#### GHSA-mh29-5h37-fv8m

**Severity:** MEDIUM

**CVSS Score:** 5.0

**Dependency Chain:** root → js-yaml

**Summary:** js-yaml has prototype pollution in merge (<<)

**Details:** ### Impact

In js-yaml 4.1.0, 4.0.0, and 3.14.1 and below, it's possible for an attacker to modify the prototype of the result of a parsed yaml document via prototype pollution (`__proto__`). All users who parse untrusted yaml documents may be impacted.

### Patches

Problem is patched in js-yaml 4.1.1 and 3.14.2.

### Workarounds

You can protect against this kind of attack on the server by using `node --disable-proto=delete` or `deno` (in Deno, pollution protection is on by default).

### References

https://cheatsheetseries.owasp.org/cheatsheets/Prototype_Pollution_Prevention_Cheat_Sheet.html

**Fixed In:** 4.1.1, 3.14.2

**Direct Upgrade:** `npm install js-yaml@4.1.1` (adds as direct dependency)

**Suggested Fix:** npm install js-yaml@latest (upgrade parent)

---

#### GHSA-mh29-5h37-fv8m

**Severity:** MEDIUM

**CVSS Score:** 5.0

**Dependency Chain:** root → js-yaml

**Summary:** js-yaml has prototype pollution in merge (<<)

**Details:** ### Impact

In js-yaml 4.1.0, 4.0.0, and 3.14.1 and below, it's possible for an attacker to modify the prototype of the result of a parsed yaml document via prototype pollution (`__proto__`). All users who parse untrusted yaml documents may be impacted.

### Patches

Problem is patched in js-yaml 4.1.1 and 3.14.2.

### Workarounds

You can protect against this kind of attack on the server by using `node --disable-proto=delete` or `deno` (in Deno, pollution protection is on by default).

### References

https://cheatsheetseries.owasp.org/cheatsheets/Prototype_Pollution_Prevention_Cheat_Sheet.html

**Fixed In:** 4.1.1, 3.14.2

**Direct Upgrade:** `npm install js-yaml@4.1.1` (adds as direct dependency)

**Suggested Fix:** npm install js-yaml@latest (upgrade parent)

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

