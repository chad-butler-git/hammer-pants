# minimist - Vulnerability Details
**Package to Upgrade:** `minimist`
**Total Vulnerabilities:** 4
**Severity Breakdown:** 2 Critical, 0 High, 2 Medium, 0 Low

## Affected Lockfiles
- `grocery-infra/package-lock.json`

## Summary
These vulnerabilities are in transitive dependencies. Upgrade `minimist` in package.json to fix them.

## Vulnerabilities

### minimist
**Vulnerable Package:** `minimist`
**CVE Count:** 4

#### GHSA-xvch-5gv4-984h
**Severity:** CRITICAL
**CVSS Score:** 9.8

**Dependency Chain:** minimist

**Summary:** Prototype Pollution in minimist

**Details:** Minimist prior to 1.2.6 and 0.2.4 is vulnerable to Prototype Pollution via file `index.js`, function `setKey()` (lines 69-95).

**Fixed In:** 1.2.6, 0.2.4

**Direct Upgrade:** `npm install minimist@1.2.6` (adds as direct dependency)

**References:**
- https://nvd.nist.gov/vuln/detail/CVE-2021-44906
- https://github.com/minimistjs/minimist/issues/11
- https://github.com/substack/minimist/issues/164
- https://github.com/minimistjs/minimist/pull/24
- https://github.com/minimistjs/minimist/commit/34e20b8461118608703d6485326abbb8e35e1703
- ... and 10 more

---

#### GHSA-xvch-5gv4-984h
**Severity:** CRITICAL
**CVSS Score:** 9.8

**Dependency Chain:** minimist

**Summary:** Prototype Pollution in minimist

**Details:** Minimist prior to 1.2.6 and 0.2.4 is vulnerable to Prototype Pollution via file `index.js`, function `setKey()` (lines 69-95).

**Fixed In:** 1.2.6, 0.2.4

**Direct Upgrade:** `npm install minimist@1.2.6` (adds as direct dependency)

**References:**
- https://nvd.nist.gov/vuln/detail/CVE-2021-44906
- https://github.com/minimistjs/minimist/issues/11
- https://github.com/substack/minimist/issues/164
- https://github.com/minimistjs/minimist/pull/24
- https://github.com/minimistjs/minimist/commit/34e20b8461118608703d6485326abbb8e35e1703
- ... and 10 more

---

#### GHSA-vh95-rmgr-6w4m
**Severity:** MODERATE
**CVSS Score:** 5.6

**Dependency Chain:** minimist

**Summary:** Prototype Pollution in minimist

**Details:** Affected versions of `minimist` are vulnerable to prototype pollution. Arguments are not properly sanitized, allowing an attacker to modify the prototype of `Object`, causing the addition or modification of an existing property that will exist on all objects.  
Parsing the argument `--__proto__.y=Polluted` adds a `y` property with value `Polluted` to all objects. The argument `--__proto__=Polluted` raises and uncaught error and crashes the application.  
This is exploitable if attackers have control over the arguments being passed to `minimist`.


## Recommendation

Upgrade to versions 0.2.1, 1.2.3 or later.

**Fixed In:** 0.2.1, 1.2.3

**Direct Upgrade:** `npm install minimist@0.2.1` (adds as direct dependency)

**References:**
- https://nvd.nist.gov/vuln/detail/CVE-2020-7598
- https://github.com/minimistjs/minimist/commit/10bd4cdf49d9686d48214be9d579a9cdfda37c68
- https://github.com/minimistjs/minimist/commit/38a4d1caead72ef99e824bb420a2528eec03d9ab
- https://github.com/minimistjs/minimist/commit/4cf1354839cb972e38496d35e12f806eea92c11f#diff-a1e0ee62c91705696ddb71aa30ad4f95
- https://github.com/minimistjs/minimist/commit/63e7ed05aa4b1889ec2f3b196426db4500cbda94
- ... and 4 more

---

#### GHSA-vh95-rmgr-6w4m
**Severity:** MODERATE
**CVSS Score:** 5.6

**Dependency Chain:** minimist

**Summary:** Prototype Pollution in minimist

**Details:** Affected versions of `minimist` are vulnerable to prototype pollution. Arguments are not properly sanitized, allowing an attacker to modify the prototype of `Object`, causing the addition or modification of an existing property that will exist on all objects.  
Parsing the argument `--__proto__.y=Polluted` adds a `y` property with value `Polluted` to all objects. The argument `--__proto__=Polluted` raises and uncaught error and crashes the application.  
This is exploitable if attackers have control over the arguments being passed to `minimist`.


## Recommendation

Upgrade to versions 0.2.1, 1.2.3 or later.

**Fixed In:** 0.2.1, 1.2.3

**Direct Upgrade:** `npm install minimist@0.2.1` (adds as direct dependency)

**References:**
- https://nvd.nist.gov/vuln/detail/CVE-2020-7598
- https://github.com/minimistjs/minimist/commit/10bd4cdf49d9686d48214be9d579a9cdfda37c68
- https://github.com/minimistjs/minimist/commit/38a4d1caead72ef99e824bb420a2528eec03d9ab
- https://github.com/minimistjs/minimist/commit/4cf1354839cb972e38496d35e12f806eea92c11f#diff-a1e0ee62c91705696ddb71aa30ad4f95
- https://github.com/minimistjs/minimist/commit/63e7ed05aa4b1889ec2f3b196426db4500cbda94
- ... and 4 more

---

#### Triage Assessment for minimist

**Status:** Completed

**Codebase Impact:** None (no direct imports/usage; only present in dev tooling inside node_modules)

**Upgrade Decision:** Accept risk short-term; plan safe upgrade

**Remediation Plan:**

## Remediation Plan for minimist

**Upgrade Decision:** Schedule (dev-only exposure; low impact)

**Analysis:**
- Current version: transitive, versions below 1.2.6 may be present via tooling
- Target version: >= 1.2.6 (or >= 0.2.4 for 0.x)
- Breaking changes: No (patch/minor upgrade for transitive deps)
- Affected code: None in our repo; grep found usage only in node_modules (e.g., @bcoe/v8-coverage gulpfile, tsconfig-paths, esrecurse). Vulnerable API is setKey() in minimist's index.js used when parsing CLI args; our application does not pass attacker-controlled CLI args to minimist.

**Recommendation:**
- Prefer safe upgrade by bumping parent packages or adding an override/resolution:
  - For npm: add "overrides": { "minimist": ">=1.2.6" } in affected package.json (e.g., grocery-infra)
  - For yarn/pnpm: add a resolutions/overrides entry to force >=1.2.6
- Alternatively, pin as a devDependency to ensure hoisted patched version: npm i -D minimist@^1.2.6
- Run a fresh install to dedupe and verify lockfile updates.

**Testing Checklist:**
- [ ] Run existing test suite
- [ ] Smoke test developer scripts that rely on tooling (jest, tsconfig-paths)
- [ ] Verify no regressions in local dev workflows

---

