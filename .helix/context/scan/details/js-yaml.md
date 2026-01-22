# js-yaml - Vulnerability Details
**Package to Upgrade:** `js-yaml`
**Total Vulnerabilities:** 2
**Severity Breakdown:** 0 Critical, 0 High, 2 Medium, 0 Low

## Affected Lockfiles
- `grocery-shared/grocery-web/package-lock.json`
- `grocery-web/package-lock.json`

## Summary
These vulnerabilities are in transitive dependencies. Upgrade `js-yaml` in package.json to fix them.

## Vulnerabilities

### js-yaml
**Vulnerable Package:** `js-yaml`
**CVE Count:** 2

#### GHSA-mh29-5h37-fv8m
**Severity:** MODERATE
**CVSS Score:** 5.3

**Dependency Chain:** js-yaml

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

**References:**
- https://github.com/nodeca/js-yaml/security/advisories/GHSA-mh29-5h37-fv8m
- https://nvd.nist.gov/vuln/detail/CVE-2025-64718
- https://github.com/nodeca/js-yaml/commit/383665ff4248ec2192d1274e934462bb30426879
- https://github.com/nodeca/js-yaml/commit/5278870a17454fe8621dbd8c445c412529525266
- https://github.com/nodeca/js-yaml

---

#### GHSA-mh29-5h37-fv8m
**Severity:** MODERATE
**CVSS Score:** 5.3

**Dependency Chain:** js-yaml

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

**References:**
- https://github.com/nodeca/js-yaml/security/advisories/GHSA-mh29-5h37-fv8m
- https://nvd.nist.gov/vuln/detail/CVE-2025-64718
- https://github.com/nodeca/js-yaml/commit/383665ff4248ec2192d1274e934462bb30426879
- https://github.com/nodeca/js-yaml/commit/5278870a17454fe8621dbd8c445c412529525266
- https://github.com/nodeca/js-yaml

---

#### Triage Assessment for js-yaml

**Status:** completed

## Remediation Plan for js-yaml

**Upgrade Decision:** Schedule (dev-only safe upgrade)

**Analysis:**
- Current version: indirect via eslint and build tooling (devDependencies)
- Target version: js-yaml >= 4.1.1 (or upgrade eslint to a release that pulls js-yaml >= 4.1.1)
- Breaking changes: No (patch/minor within major)
- Affected code: No direct imports in our application code. js-yaml is used by eslint and @istanbuljs/load-nyc-config during linting and test coverage generation only. No YAML parsing occurs in production runtime paths.

**Recommendation:**
- Prefer upgrading eslint to a version that resolves to js-yaml >= 4.1.1, or add an overrides/resolutions block to enforce js-yaml >= 4.1.1. Accept Low risk until the next dependency refresh.

**Testing Checklist:**
- [ ] Run ESLint locally and in CI
- [ ] Run tests with coverage and verify coverage reports generate
- [ ] CI green

---

