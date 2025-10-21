# fsevents - Vulnerability Details
**Package to Upgrade:** `fsevents`
**Total Vulnerabilities:** 7
**Severity Breakdown:** 0 Critical, 6 High, 1 Medium, 0 Low

## Affected Lockfiles
- `grocery-infra/package-lock.json`

## Summary
These vulnerabilities are in transitive dependencies. Upgrade `fsevents` in package.json to fix them.

## Vulnerabilities

### ini
**Vulnerable Package:** `ini`
**CVE Count:** 1

#### GHSA-qqgx-2p2h-9c37
**Severity:** HIGH

**Dependency Chain:** ini

**Description:** ini before 1.3.6 vulnerable to Prototype Pollution via ini.parse

**Fixed In:** 1.3.6

**Direct Fix:** `npm install ini@1.3.6`

---

#### Triage Assessment for ini

## Remediation Plan for ini

**Upgrade Decision:** Upgrade now

**Analysis:**
- Dependency type: Transitive (fsevents → node-pre-gyp → rc → ini)
- Vulnerable API: ini.parse (prototype pollution in ini < 1.3.6)
- Code usage evidence:
  - No direct imports of fsevents or ini in our codebase (searched grocery-infra/src and scripts; none found)
  - fsevents is an optionalDependency in grocery-infra/package.json at 1.2.9 and installs only on macOS
  - Node modules in this repo show fsevents only consumed by tooling (jest-haste-map/chokidar) and not by production runtime
  - No ini package present in grocery-infra/node_modules on this platform, indicating the vulnerable chain is not installed in our current environment; when present, ini is only used by node-pre-gyp/rc during install-time on developer machines
- Codebase Severity: Low (dev-only, local install-time/config parsing; no production exposure)
- Current versions: fsevents 1.2.9 (optional)
- Target versions: fsevents ^2.3.2 or newer (removes node-pre-gyp/rc → eliminates ini); alternatively ensure ini >=1.3.6 via overrides if absolutely needed
- Upgrade Impact: safe_upgrade (optional dependency; bumping to v2 is broadly compatible and not directly imported by our code)

**Recommendation:**
- In grocery-infra/package.json, bump optionalDependencies.fsevents from 1.2.9 to ^2.3.2 (or remove fsevents entirely if not required).
- Run npm install to update the lockfile; verify that node-pre-gyp/rc/ini are no longer pulled in under fsevents.
- If constrained to fsevents v1, add an npm override to force ini@>=1.3.6, but upgrading fsevents is strongly preferred.

**Testing Checklist:**
- [ ] Run jest on macOS and Linux and ensure file-watching/dev workflows (if any) work as expected
- [ ] Verify no production runtime paths rely on fsevents
- [ ] Smoke test developer environment on macOS where fsevents is installable

---


### tar
**Vulnerable Package:** `tar`
**CVE Count:** 6

#### GHSA-3jfq-g458-7qm9
**Severity:** HIGH

**Dependency Chain:** tar

**Description:** Arbitrary File Creation/Overwrite due to insufficient absolute path sanitization

**Fixed In:** 6.1.1

**Direct Fix:** `npm install tar@6.1.1`

---

#### GHSA-5955-9wpr-37jh
**Severity:** HIGH

**Dependency Chain:** tar

**Description:** Arbitrary File Creation/Overwrite on Windows via insufficient relative path sanitization

**Fixed In:** 6.1.9

**Direct Fix:** `npm install tar@6.1.9`

---

#### GHSA-9r2w-394v-53qc
**Severity:** HIGH

**Dependency Chain:** tar

**Description:** Arbitrary File Creation/Overwrite via insufficient symlink protection due to directory cache poisoning using symbolic links

**Fixed In:** 6.1.7

**Direct Fix:** `npm install tar@6.1.7`

---

#### GHSA-qq89-hq3f-393p
**Severity:** HIGH

**Dependency Chain:** tar

**Description:** Arbitrary File Creation/Overwrite via insufficient symlink protection due to directory cache poisoning using symbolic links

**Fixed In:** 6.1.9

**Direct Fix:** `npm install tar@6.1.9`

---

#### GHSA-r628-mhmh-qjhw
**Severity:** HIGH

**Dependency Chain:** tar

**Description:** Arbitrary File Creation/Overwrite via insufficient symlink protection due to directory cache poisoning

**Fixed In:** 6.1.2

**Direct Fix:** `npm install tar@6.1.2`

---

#### GHSA-f5x3-32g6-xq36
**Severity:** MEDIUM

**Dependency Chain:** tar

**Description:** Denial of service while parsing a tar file due to lack of folders count validation

**Fixed In:** 6.2.1

**Direct Fix:** `npm install tar@6.2.1`

---

#### Triage Assessment for tar

## Remediation Plan for tar

**Upgrade Decision:** Upgrade now

**Analysis:**
- Dependency type: Transitive (fsevents → node-pre-gyp → tar)
- Affected CVEs: GHSA-3jfq-g458-7qm9, GHSA-5955-9wpr-37jh, GHSA-9r2w-394v-53qc, GHSA-qq89-hq3f-393p, GHSA-r628-mhmh-qjhw, GHSA-f5x3-32g6-xq36
- Vulnerable APIs: tar extraction (e.g., extract, x) path/symlink handling; DoS in tar parsing
- Code usage evidence:
  - No direct imports of tar or fsevents in our source (searched grocery-infra/scripts and project src)
  - fsevents is listed as optionalDependencies at version 1.2.9 and only installs on macOS
  - Jest is used only in test/; fsevents involvement is limited to local file watching and dev tooling
  - package-lock shows tar is pulled in via node-pre-gyp inside fsevents v1, not by production code paths
- Codebase Severity: Low (dev-only, optional macOS-only install; no production exposure)
- Current versions: fsevents 1.2.9 (optional), tar ^4 via node-pre-gyp
- Target versions: fsevents ^2.3.2 or newer (drops node-pre-gyp/tar); alternatively ensure tar >=6.2.1
- Upgrade Impact: safe_upgrade (fsevents v2 is compatible with Node 8+ and commonly a non-breaking optional dep bump)

**Recommendation:**
- In grocery-infra/package.json, bump optionalDependencies.fsevents from 1.2.9 to ^2.3.2 or remove it entirely if not required.
- Run npm install to update lockfile; verify that node-pre-gyp and tar are no longer pulled in under fsevents.
- If keeping fsevents@1 for any reason, pin tar to >=6.2.1 in resolutions (npm overrides) to address CVEs, though upgrading fsevents is preferred.

**Testing Checklist:**
- [ ] Run existing test suite (jest) on macOS and Linux
- [ ] Verify local developer workflows (file watching, if any) still function
- [ ] Verify no production runtime paths rely on fsevents

---

