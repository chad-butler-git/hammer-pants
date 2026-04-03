# minimist - Vulnerability Details

**Package to Upgrade:** `minimist`

**Total Vulnerabilities:** 4

**Severity Breakdown:** 2 Critical, 0 High, 2 Medium, 0 Low

## Affected Lockfiles

- `./grocery-infra/package-lock.json`

## Summary

These vulnerabilities are in transitive dependencies. Upgrade `minimist` in package.json to fix them.

## Vulnerabilities

### minimist

**Vulnerable Package:** `minimist`

**CVE Count:** 4

#### GHSA-xvch-5gv4-984h

**Severity:** CRITICAL

**CVSS Score:** 9.0

**Dependency Chain:** grocery-infra → minimist

**Summary:** Prototype Pollution in minimist

**Details:** Minimist prior to 1.2.6 and 0.2.4 is vulnerable to Prototype Pollution via file `index.js`, function `setKey()` (lines 69-95).

**Fixed In:** 1.2.6, 0.2.4

**Direct Upgrade:** `npm install minimist@1.2.6` (adds as direct dependency)

**Suggested Fix:** npm install minimist@latest (upgrade parent)

---

#### GHSA-xvch-5gv4-984h

**Severity:** CRITICAL

**CVSS Score:** 9.0

**Dependency Chain:** grocery-infra → minimist

**Summary:** Prototype Pollution in minimist

**Details:** Minimist prior to 1.2.6 and 0.2.4 is vulnerable to Prototype Pollution via file `index.js`, function `setKey()` (lines 69-95).

**Fixed In:** 1.2.6, 0.2.4

**Direct Upgrade:** `npm install minimist@1.2.6` (adds as direct dependency)

**Suggested Fix:** npm install minimist@latest (upgrade parent)

---

#### GHSA-vh95-rmgr-6w4m

**Severity:** MEDIUM

**CVSS Score:** 7.5

**Dependency Chain:** grocery-infra → minimist

**Summary:** Prototype Pollution in minimist

**Details:** Affected versions of `minimist` are vulnerable to prototype pollution. Arguments are not properly sanitized, allowing an attacker to modify the prototype of `Object`, causing the addition or modification of an existing property that will exist on all objects.  
Parsing the argument `--__proto__.y=Polluted` adds a `y` property with value `Polluted` to all objects. The argument `--__proto__=Polluted` raises and uncaught error and crashes the application.  
This is exploitable if attackers have control over the arguments being passed to `minimist`.


## Recommendation

Upgrade to versions 0.2.1, 1.2.3 or later.

**Fixed In:** 0.2.1, 1.2.3

**Direct Upgrade:** `npm install minimist@0.2.1` (adds as direct dependency)

**Suggested Fix:** npm install minimist@latest (upgrade parent)

---

#### GHSA-vh95-rmgr-6w4m

**Severity:** MEDIUM

**CVSS Score:** 7.5

**Dependency Chain:** grocery-infra → minimist

**Summary:** Prototype Pollution in minimist

**Details:** Affected versions of `minimist` are vulnerable to prototype pollution. Arguments are not properly sanitized, allowing an attacker to modify the prototype of `Object`, causing the addition or modification of an existing property that will exist on all objects.  
Parsing the argument `--__proto__.y=Polluted` adds a `y` property with value `Polluted` to all objects. The argument `--__proto__=Polluted` raises and uncaught error and crashes the application.  
This is exploitable if attackers have control over the arguments being passed to `minimist`.


## Recommendation

Upgrade to versions 0.2.1, 1.2.3 or later.

**Fixed In:** 0.2.1, 1.2.3

**Direct Upgrade:** `npm install minimist@0.2.1` (adds as direct dependency)

**Suggested Fix:** npm install minimist@latest (upgrade parent)

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

