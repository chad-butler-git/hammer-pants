# lodash - Vulnerability Details
**Package to Upgrade:** `lodash`
**Total Vulnerabilities:** 2
**Severity Breakdown:** 0 Critical, 1 High, 1 Medium, 0 Low

## Affected Lockfiles
- `grocery-api/package-lock.json`

## Summary
This is a direct dependency. Upgrade `lodash` directly in package.json.

## Vulnerabilities

### lodash
**Vulnerable Package:** `lodash`
**CVE Count:** 2

#### GHSA-35jh-r3h4-6jhm
**Severity:** HIGH
**CVSS Score:** 7.2

**Dependency Chain:** grocery-api → lodash

**Summary:** Command Injection in lodash

**Details:** `lodash` versions prior to 4.17.21 are vulnerable to Command Injection via the template function.

**Fixed In:** 4.17.21, 4.17.21, 4.17.21

**Recommended Fix:** `npm install lodash@4.17.21`

**References:**
- https://nvd.nist.gov/vuln/detail/CVE-2021-23337
- https://github.com/lodash/lodash/commit/3469357cff396a26c363f8c1b5a91dde28ba4b1c
- https://www.oracle.com/security-alerts/cpuoct2021.html
- https://www.oracle.com/security-alerts/cpujul2022.html
- https://www.oracle.com/security-alerts/cpujan2022.html
- ... and 12 more

---

#### GHSA-29mw-wpgm-hmr9
**Severity:** MODERATE
**CVSS Score:** 5.3

**Dependency Chain:** grocery-api → lodash

**Summary:** Regular Expression Denial of Service (ReDoS) in lodash

**Details:** All versions of package lodash prior to 4.17.21 are vulnerable to Regular Expression Denial of Service (ReDoS) via the `toNumber`, `trim` and `trimEnd` functions. 

Steps to reproduce (provided by reporter Liyuan Chen):
```js
var lo = require('lodash');

function build_blank(n) {
    var ret = "1"
    for (var i = 0; i < n; i++) {
        ret += " "
    }
    return ret + "1";
}
var s = build_blank(50000) var time0 = Date.now();
lo.trim(s) 
var time_cost0 = Date.now() - time0;
console.log("time_cost0: " + time_cost0);
var time1 = Date.now();
lo.toNumber(s) var time_cost1 = Date.now() - time1;
console.log("time_cost1: " + time_cost1);
var time2 = Date.now();
lo.trimEnd(s);
var time_cost2 = Date.now() - time2;
console.log("time_cost2: " + time_cost2);
```

**Fixed In:** 4.17.21, 4.17.21, 4.17.21

**Recommended Fix:** `npm install lodash@4.17.21`

**References:**
- https://nvd.nist.gov/vuln/detail/CVE-2020-28500
- https://github.com/github/advisory-database/pull/6139
- https://github.com/lodash/lodash/pull/5065
- https://github.com/lodash/lodash/pull/5065/commits/02906b8191d3c100c193fe6f7b27d1c40f200bb7
- https://github.com/lodash/lodash/commit/c4847ebe7d14540bb28a8b932a9ce1b9ecbfee1a
- ... and 15 more

---

#### Triage Assessment for lodash

## Remediation Plan for lodash

**Upgrade Decision:** Upgrade now

**Analysis:**
- Current version: 4.17.19 (in grocery-api/package.json)
- Target version: 4.17.21
- Breaking changes: No (patch upgrade)
- Affected code: grocery-api/src/routes/items.js uses _.template with user input (req.body.name). ReDoS functions (toNumber/trim/trimEnd) are not used.

**Recommendation:**
- Update dependency: npm install lodash@4.17.21 in grocery-api
- Commit package.json and lockfile updates
- Consider adding server-side sanitization or escaping for template inputs, or remove _.template usage if unnecessary.

**Testing Checklist:**
- [ ] Run existing test suite (npm test)
- [ ] Test POST /items endpoint for correct behavior after lodash upgrade
- [ ] Verify rendering/templating still works as expected

---

