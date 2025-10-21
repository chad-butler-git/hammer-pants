# Direct - Vulnerability Details
**Package to Upgrade:** `Direct`
**Total Vulnerabilities:** 2
**Severity Breakdown:** 0 Critical, 1 High, 1 Medium, 0 Low

## Affected Lockfiles
- `grocery-api/package-lock.json`

## Summary
This is a direct dependency. Upgrade it directly in package.json.

## Vulnerabilities

### lodash
**Vulnerable Package:** `lodash`
**CVE Count:** 2

#### GHSA-35jh-r3h4-6jhm
**Severity:** HIGH

**Dependency Chain:** lodash

**Description:** Command Injection in lodash

**Fixed In:** 4.17.21

**Direct Fix:** `npm install lodash@4.17.21`

---

#### GHSA-29mw-wpgm-hmr9
**Severity:** MEDIUM

**Dependency Chain:** lodash

**Description:** Regular Expression Denial of Service (ReDoS) in lodash

**Fixed In:** 4.17.21

**Direct Fix:** `npm install lodash@4.17.21`

---

## Remediation Plan for lodash

**Upgrade Decision:** Upgrade now

**Analysis:**
- Current version: 4.17.19 (in grocery-api/package.json)
- Target version: 4.17.21 (fixes GHSA-35jh-r3h4-6jhm and GHSA-29mw-wpgm-hmr9)
- Breaking changes: No (patch upgrade within 4.17.x)
- Affected code: grocery-api/src/routes/items.js uses _.template with user input (req.body.name)

Evidence:
- Import: grocery-api/src/routes/items.js line 9 -> const _ = require('lodash');
- Vulnerable call: grocery-api/src/routes/items.js lines 54-56 -> _.template compiled and rendered with req.body.name

Risk Assessment:
- Codebase Severity: Low (lodash is used, but the command injection vector requires attacker-controlled template source; here the template string is constant and output is only logged)

**Recommendation:**
- Update lodash to 4.17.21: npm install lodash@4.17.21 --workspace=grocery-api
- Alternatively, pin in grocery-api/package.json to "lodash": "4.17.21" and run npm install
- Review usage of _.template for proper escaping; consider using safer rendering or explicit escaping where needed.

**Testing Checklist:**
- [ ] Run API test suite: npm test --workspace=grocery-api
- [ ] Exercise POST /items with various name values to ensure correct rendering and no errors
- [ ] Verify no regressions in routes using lodash utilities
- [ ] Re-run security scan to confirm CVEs are resolved
---

