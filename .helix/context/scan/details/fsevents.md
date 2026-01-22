# fsevents - Vulnerability Details
**Package to Upgrade:** `fsevents`
**Total Vulnerabilities:** 2
**Severity Breakdown:** 1 Critical, 0 High, 0 Medium, 0 Low

## Affected Lockfiles
- `grocery-infra/package-lock.json`

## Summary
These vulnerabilities are in transitive dependencies. Upgrade `fsevents` in package.json to fix them.

## Vulnerabilities

### fsevents
**Vulnerable Package:** `fsevents`
**CVE Count:** 2

#### GHSA-8r6j-v8pm-fqw3
**Severity:** CRITICAL
**CVSS Score:** 9.8

**Dependency Chain:** fsevents

**Summary:** Code injection in fsevents

**Details:** fsevents before 1.2.11 depends on the https://fsevents-binaries.s3-us-west-2.amazonaws.com URL, which might allow an adversary to execute arbitrary code if any JavaScript project (that depends on fsevents) distributes code that was obtained from that URL at a time when it was controlled by an adversary.

**Fixed In:** 1.2.11

**Direct Upgrade:** `npm install fsevents@1.2.11` (adds as direct dependency)

**References:**
- https://nvd.nist.gov/vuln/detail/CVE-2023-45311
- https://github.com/fsevents/fsevents/commit/909af26846834642c81d19f4148afa3b7557b058
- https://github.com/atlassian/moo/blob/56ccbdd41b493332bc2cd7a4097a5802594cdb9c/package-lock.json#L1901-L1902
- https://github.com/atlassian/react-immutable-proptypes/blob/ddb9fa5194b931bf7528eb4f2c0a8c3434f70edd/package-lock.json#L153
- https://github.com/cloudflare/authr/blob/3f6129d97d06e61033a7f237d84e35e678db490f/ts/package-lock.json#L1512
- ... and 6 more

---

#### MAL-2023-462
**Severity:** UNKNOWN

**Dependency Chain:** fsevents

**Summary:** Malicious code in fsevents (npm)

**Details:** 
---
_-= Per source details. Do not edit below this line.=-_

## Source: ghsa-malware (acdc3ae57250fab51aeff6e3938ed40197a1b74eb688a72cd5d7eee0c77a7167)
This advisory is intended to inform the npm ecosystem with details to resolve a third-party malware incident that may have impacted your infrastructure if you are directly or transitively dependent on the [fsevents](https://www.npmjs.com/package/fsevents) npm package.

## Overview

[fsevents](https://www.npmjs.com/package/fsevents) v1.0.0 <= v1.2.10 downloaded binary executables that contained unintended code due to an expired cloud storage resource being reclaimed by a third party.

## Details

The [fsevents npm package](https://www.npmjs.com/package/fsevents) v1.0.0 through v1.2.10 attempts to fetch a pre-built binary executable artifact (fse.node) from cloud storage. If this fetch fails, fsevents v1.x will attempt to build this artifact directly from source.

Version 1.x of fsevents has been deprecated for several years and as a result the aforementioned cloud storage resource namespace was available for registration. A third party, unrelated to the fsevents maintainers, subsequently claimed this namespace and in April 2023 this third party started serving modified versions of the “fse.node” binary executable artifact to new fsevents v1.x users. 

As of April 27, 2023 the cloud storage resource in question has been indefinitely suspended and is no longer serving binaries.

The affected cloud storage pre-fetch was [removed](https://github.com/fsevents/fsevents/commit/909af26846834642c81d19f4148afa3b7557b058) in fsevents version 1.2.11.

## Impact

The impact of the modified versions of fse.node appears to be limited to information gathering. 

Note that initial analysis was performed for the modified artifact associated with fsevents v1.2.9, which was distributed as fse-v1.2.9-node-v72-darwin-x64.tar.gz prior to the cloud storage resource being suspended. 

For more detailed analysis you may compare a decompilation of the v1.x fse.node artifacts on your systems with the intended fsevents v1.x source as it exists at https://github.com/fsevents/fsevents/tree/v1.x 

## How to fix it

If you are dependent on the deprecated version of fsevents v1.x, the recommended course of action is to upgrade to fsevents v2.x or remove the dependency altogether as currently maintained versions of Node.js no longer require fsevents for file system watching on macOS.


**Fixed In:** 1.2.11

**Direct Upgrade:** `npm install fsevents@1.2.11` (adds as direct dependency)

**References:**
- https://www.npmjs.com/package/fsevents
- https://github.com/fsevents/fsevents/commit/909af26846834642c81d19f4148afa3b7557b058
- https://github.com/advisories/GHSA-xv2f-5jw4-v95m

---

#### Triage Assessment for fsevents

## Remediation Plan for fsevents

**Upgrade Decision:** Upgrade now

**Analysis:**
- Current version: 1.2.9 (optionalDependency in grocery-infra/package.json)
- Target version: 1.2.11 or later (fix removes S3 binary fetch); ideally v2.x or removal
- Breaking changes: No for 1.2.x patch; v2.x is a major update, but fsevents is optional and macOS-only
- Affected code: None in our application code. No imports in src; only present under node_modules of tools like jest/vite/chokidar. Production runs on Linux containers where fsevents is not used.

**Recommendation:**
- Pin or bump optional dependency in /grocery-infra/package.json: "fsevents": ">=1.2.11" or remove the optional dependency entirely (preferred) since modern Node on Linux does not require it.
- Run: npm uninstall fsevents in grocery-infra, or npm install fsevents@^1.2.11 if keeping v1; consider v2.x if tooling supports it.

**Testing Checklist:**
- [ ] Run existing test suite (jest) on macOS developer machines to ensure watchers still work
- [ ] Validate file watching tooling (chokidar/jest/vite) behavior without direct fsevents on Linux
- [ ] Verify CI builds (Linux) remain green

**Codebase Severity:** None (macOS-only optional dependency; not used in prod)
**Upgrade Impact:** safe_upgrade (to >=1.2.11) or removal

---

