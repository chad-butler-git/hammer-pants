# ini - Vulnerability Details

**Package to Upgrade:** `ini`

**Total Vulnerabilities:** 1

**Severity Breakdown:** 0 Critical, 1 High, 0 Medium, 0 Low

## Affected Lockfiles

- `./grocery-infra/package-lock.json`

## Summary

These vulnerabilities are in transitive dependencies. Upgrade `ini` in package.json to fix them.

## Vulnerabilities

### ini

**Vulnerable Package:** `ini`

**CVE Count:** 1

#### GHSA-qqgx-2p2h-9c37

**Severity:** HIGH

**CVSS Score:** 5.0

**Dependency Chain:** grocery-infra → ini

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

**Suggested Fix:** npm install ini@latest (upgrade parent)

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

