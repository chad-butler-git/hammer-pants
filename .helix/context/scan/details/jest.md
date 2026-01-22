# jest - Vulnerability Details
**Package to Upgrade:** `jest`
**Total Vulnerabilities:** 5
**Severity Breakdown:** 0 Critical, 2 High, 2 Medium, 1 Low

## Affected Lockfiles
- `grocery-infra/package-lock.json`
- `grocery-shared/package-lock.json`

## Summary
These vulnerabilities are in transitive dependencies. Upgrade `jest` in package.json to fix them.

## Vulnerabilities

### minimatch
**Vulnerable Package:** `minimatch`
**CVE Count:** 1

#### GHSA-f8q6-p94x-37v3
**Severity:** HIGH
**CVSS Score:** 7.5

**Dependency Chain:** grocery-infra → jest → @jest/core → @jest/reporters → glob → minimatch

**Summary:** minimatch ReDoS vulnerability

**Details:** A vulnerability was found in the minimatch package. This flaw allows a Regular Expression Denial of Service (ReDoS) when calling the braceExpand function with specific arguments, resulting in a Denial of Service.

**Fixed In:** 3.0.5

**Direct Upgrade:** `npm install minimatch@3.0.5` (adds as direct dependency)

**Suggested Fix:** npm install jest@latest (upgrade parent - triage will determine best version)

**References:**
- https://nvd.nist.gov/vuln/detail/CVE-2022-3517
- https://github.com/grafana/grafana-image-renderer/issues/329
- https://github.com/nodejs/node/issues/42510
- https://github.com/isaacs/minimatch/commit/a8763f4388e51956be62dc6025cec1126beeb5e6
- https://github.com/isaacs/minimatch
- ... and 3 more

---

#### Triage Assessment for minimatch

**Status:** completed

## Remediation Plan for minimatch

**Upgrade Decision:** Schedule (dev-only safe upgrade)

**Analysis:**
- Current version: jest ^29.7.0 (devDependencies in grocery-api, grocery-infra, grocery-shared)
- Target version: latest 29.x (keeps same major) or add override to pull minimatch >=3.0.5
- Breaking changes: No (staying within major)
- Affected code: Jest reporters/glob usage during tests only; no production imports. Evidence: no jest/@jest imports under src/; jest only in devDependencies.

**Recommendation:**
- Bump jest within 29.x and re-lock (npm install -D jest@^29) or add package manager overrides/resolutions to force minimatch@>=3.0.5. Accept low risk until then.

**Testing Checklist:**
- [ ] Run existing test suites in grocery-api, grocery-infra, grocery-shared
- [ ] Verify coverage and reporters run normally
- [ ] Verify CI passes

---


### semver
**Vulnerable Package:** `semver`
**CVE Count:** 1

#### GHSA-c2qf-rxjj-qqgw
**Severity:** HIGH
**CVSS Score:** 7.5

**Dependency Chain:** grocery-infra → jest → @jest/core → jest-snapshot → semver

**Summary:** semver vulnerable to Regular Expression Denial of Service

**Details:** Versions of the package semver before 7.5.2 on the 7.x branch, before 6.3.1 on the 6.x branch, and all other versions before 5.7.2 are vulnerable to Regular Expression Denial of Service (ReDoS) via the function new Range, when untrusted user data is provided as a range.

**Fixed In:** 7.5.2, 6.3.1, 5.7.2

**Direct Upgrade:** `npm install semver@7.5.2` (adds as direct dependency)

**Suggested Fix:** npm install jest@latest (upgrade parent - triage will determine best version)

**References:**
- https://nvd.nist.gov/vuln/detail/CVE-2022-25883
- https://github.com/npm/node-semver/pull/564
- https://github.com/npm/node-semver/pull/585
- https://github.com/npm/node-semver/pull/593
- https://github.com/npm/node-semver/commit/2f8fd41487acf380194579ecb6f8b1bbfe116be0
- ... and 11 more

---

#### Triage Assessment for semver

**Status:** completed

## Remediation Plan for semver

**Upgrade Decision:** Schedule (dev-only safe upgrade)

**Analysis:**
- Current version: jest ^29.7.0 (devDependencies)
- Target version: latest 29.x (keeps same major) or override semver >=7.5.2 used by jest-snapshot
- Breaking changes: No (within major)
- Affected code: semver is used by jest-snapshot during tests only; no production imports of jest/@jest.

**Recommendation:**
- Bump jest within 29.x and re-lock; if needed, use overrides/resolutions to enforce semver@>=7.5.2. Risk is Low because this runs only in test context.

**Testing Checklist:**
- [ ] Run test suites across packages
- [ ] Validate snapshots and expect behavior
- [ ] CI green

---


### js-yaml
**Vulnerable Package:** `js-yaml`
**CVE Count:** 2

#### GHSA-mh29-5h37-fv8m
**Severity:** MODERATE
**CVSS Score:** 5.3

**Dependency Chain:** grocery-shared → jest → @jest/core → @jest/transform → babel-plugin-istanbul → @istanbuljs/load-nyc-config → js-yaml

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

**Suggested Fix:** npm install jest@latest (upgrade parent - triage will determine best version)

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

**Dependency Chain:** grocery-infra → jest → @jest/core → @jest/transform → babel-plugin-istanbul → @istanbuljs/load-nyc-config → js-yaml

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

**Suggested Fix:** npm install jest@latest (upgrade parent - triage will determine best version)

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
- Current version: jest ^29.7.0 (devDependencies)
- Target version: latest 29.x (keeps same major) or override @istanbuljs/load-nyc-config/js-yaml to >=4.1.1
- Breaking changes: No (within major)
- Affected code: js-yaml appears via coverage/instrumentation chain (babel-plugin-istanbul → @istanbuljs/load-nyc-config) only when running tests. No yaml parsing in production runtime paths.

**Recommendation:**
- Bump jest within 29.x and re-lock; consider overrides to js-yaml >=4.1.1 via @istanbuljs/load-nyc-config. Accept Low risk until upgrade.

**Testing Checklist:**
- [ ] Run tests with coverage enabled
- [ ] Verify coverage reports generate normally
- [ ] CI green

---


### brace-expansion
**Vulnerable Package:** `brace-expansion`
**CVE Count:** 1

#### GHSA-v6h2-p8h4-qcjw
**Severity:** LOW
**CVSS Score:** 3.1

**Dependency Chain:** grocery-infra → jest → @jest/core → @jest/reporters → glob → minimatch → brace-expansion

**Summary:** brace-expansion Regular Expression Denial of Service vulnerability

**Details:** A vulnerability was found in juliangruber brace-expansion up to 1.1.11/2.0.1/3.0.0/4.0.0. It has been rated as problematic. Affected by this issue is the function expand of the file index.js. The manipulation leads to inefficient regular expression complexity. The attack may be launched remotely. The complexity of an attack is rather high. The exploitation is known to be difficult. The exploit has been disclosed to the public and may be used. Upgrading to version 1.1.12, 2.0.2, 3.0.1 and 4.0.1 is able to address this issue. The name of the patch is `a5b98a4f30d7813266b221435e1eaaf25a1b0ac5`. It is recommended to upgrade the affected component.

**Fixed In:** 2.0.2, 1.1.12, 3.0.1 (and 1 more)

**Direct Upgrade:** `npm install brace-expansion@2.0.2` (adds as direct dependency)

**Suggested Fix:** npm install jest@latest (upgrade parent - triage will determine best version)

**References:**
- https://nvd.nist.gov/vuln/detail/CVE-2025-5889
- https://github.com/juliangruber/brace-expansion/pull/65/commits/a5b98a4f30d7813266b221435e1eaaf25a1b0ac5
- https://github.com/juliangruber/brace-expansion/commit/0b6a9781e18e9d2769bb2931f4856d1360243ed2
- https://github.com/juliangruber/brace-expansion/commit/15f9b3c75ebf5988198241fecaebdc45eff28a9f
- https://github.com/juliangruber/brace-expansion/commit/36603d5f3599a37af9e85eda30acd7d28599c36e
- ... and 6 more

---

#### Triage Assessment for brace-expansion

**Status:** completed

## Remediation Plan for brace-expansion

**Upgrade Decision:** Schedule (dev-only safe upgrade)

**Analysis:**
- Current version: jest ^29.7.0 (devDependencies)
- Target version: latest 29.x (keeps same major) or override minimatch/brace-expansion to fixed versions (minimatch >=3.0.5, brace-expansion >=2.0.2)
- Breaking changes: No (within major)
- Affected code: glob pattern expansion inside jest reporters during tests; not reachable in production runtime.

**Recommendation:**
- Bump jest within 29.x and re-lock; optionally use overrides/resolutions to enforce patched brace-expansion/minimatch. Low risk accepted until upgrade.

**Testing Checklist:**
- [ ] Run tests and confirm reporters execute
- [ ] Validate no slowdowns or ReDoS-like behavior
- [ ] CI passes

---

