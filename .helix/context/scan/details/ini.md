# ini - Vulnerability Details
**Package to Upgrade:** `ini`
**Total Vulnerabilities:** 1
**Severity Breakdown:** 0 Critical, 1 High, 0 Medium, 0 Low

## Affected Lockfiles
- `grocery-infra/package-lock.json`

## Summary
These vulnerabilities are in transitive dependencies. Upgrade `ini` in package.json to fix them.

## Vulnerabilities

### ini
**Vulnerable Package:** `ini`
**CVE Count:** 1

#### GHSA-qqgx-2p2h-9c37
**Severity:** HIGH
**CVSS Score:** 7.3

**Dependency Chain:** ini

**Summary:** ini before 1.3.6 vulnerable to Prototype Pollution via ini.parse

**Details:** ### Overview
The `ini` npm package before version 1.3.6 has a Prototype Pollution vulnerability.

If an attacker submits a malicious INI file to an application that parses it with `ini.parse`, they will pollute the prototype on the application. This can be exploited further depending on the context.

### Patches

This has been patched in 1.3.6.

### Steps to reproduce

payload.ini
```
[__proto__]
polluted = "polluted"
```

poc.js:
```
var fs = require('fs')
var ini = require('ini')

var parsed = ini.parse(fs.readFileSync('./payload.ini', 'utf-8'))
console.log(parsed)
console.log(parsed.__proto__)
console.log(polluted)
```

```
> node poc.js
{}
{ polluted: 'polluted' }
{ polluted: 'polluted' }
polluted
```

**Fixed In:** 1.3.6

**Direct Upgrade:** `npm install ini@1.3.6` (adds as direct dependency)

**References:**
- https://nvd.nist.gov/vuln/detail/CVE-2020-7788
- https://github.com/npm/ini/commit/56d2805e07ccd94e2ba0984ac9240ff02d44b6f1
- https://github.com/npm/ini
- https://lists.debian.org/debian-lts-announce/2020/12/msg00032.html
- https://snyk.io/vuln/SNYK-JS-INI-1048974
- ... and 1 more

---

#### Triage Assessment for ini

## Remediation Plan for ini

Upgrade Decision: Accept risk (dev/optional only) and schedule dependency hygiene

Analysis:
- Current version: ini 1.3.5 bundled under fsevents' tooling (fsevents → node-pre-gyp → rc → ini)
- Target version: ini >= 1.3.6 (fixes prototype pollution in ini.parse)
- Breaking changes: No (patch update for ini); fsevents optional, not used in prod
- Affected code: No direct imports. Search found no imports or requires of "ini" in src/ across the monorepo. Vulnerable API is ini.parse when parsing untrusted INI.
- Context: fsevents is listed as optionalDependency in grocery-infra and is macOS-specific file watcher used during local development; not part of production runtime.

Recommendation:
- Accept risk for production (not reachable). For hygiene, bump the transitive chain when convenient: remove legacy fsevents 1.x optional dependency or update tooling to versions that no longer bundle rc→ini@1.3.5. If retaining, override to ini@1.3.6+ where feasible.

Testing Checklist:
- [ ] CI: npm ci on macOS runner to verify no install-time regressions
- [ ] Run existing test suite
- [ ] Verify no changes to file watching in local dev on macOS

---

