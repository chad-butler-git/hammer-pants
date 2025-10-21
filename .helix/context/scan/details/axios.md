# Direct - Vulnerability Details
**Package to Upgrade:** `Direct`
**Total Vulnerabilities:** 3
**Severity Breakdown:** 0 Critical, 3 High, 0 Medium, 0 Low

## Affected Lockfiles
- `grocery-infra/package-lock.json`
- `grocery-shared/grocery-web/package-lock.json`
- `grocery-web/package-lock.json`

## Summary
This is a direct dependency. Upgrade it directly in package.json.

## Vulnerabilities

### axios
**Vulnerable Package:** `axios`
**CVE Count:** 3

#### GHSA-4hjh-wcwx-xvwj
**Severity:** HIGH

**Dependency Chain:** axios

**Description:** Axios is vulnerable to DoS attack through lack of data size check

**Fixed In:** 1.12.0

**Direct Fix:** `npm install axios@1.12.0`

---

#### GHSA-4hjh-wcwx-xvwj
**Severity:** HIGH

**Dependency Chain:** axios

**Description:** Axios is vulnerable to DoS attack through lack of data size check

**Fixed In:** 1.12.0

**Direct Fix:** `npm install axios@1.12.0`

---

#### GHSA-4hjh-wcwx-xvwj
**Severity:** HIGH

**Dependency Chain:** axios

**Description:** Axios is vulnerable to DoS attack through lack of data size check

**Fixed In:** 1.12.0

**Direct Fix:** `npm install axios@1.12.0`

---

## Remediation Plan for axios

**Upgrade Decision:** Upgrade now

**Analysis:**
- Current versions:
  - grocery-web: axios ^1.4.0
  - grocery-shared/grocery-web: axios ^1.10.0
  - grocery-infra: axios ^1.6.7
- Target version: axios 1.12.0 or later
- Breaking changes: No (minor upgrade within 1.x)
- Affected code (usage evidence):
  - grocery-web: axios instance in src/api/axios.js; API calls in src/api/stores.js, src/api/items.js, src/api/lists.js, src/api/route.js
  - grocery-infra: axios used in scripts/importSampleData.js and scripts/xmlImport.js
  - grocery-shared/grocery-web: no application imports found (axios present in deps but not referenced in source)

**Risk assessment (CVE: GHSA-4hjh-wcwx-xvwj – DoS via lack of data size checks):**
- The vulnerable surface is generic axios request/response handling when downloading untrusted, potentially large responses without limits.
- Our usage calls our own API endpoints returning bounded JSON. No untrusted arbitrary downloads detected.
- grocery-web (production): Low risk due to controlled API responses and typical small payloads.
- grocery-infra (dev/ops scripts): Low risk; local execution against controlled API.
- grocery-shared/grocery-web: None; no axios usage found in source.

**Recommendation:**
- Upgrade axios to >=1.12.0 in all affected projects:
  - grocery-web: npm install axios@^1.12.0
  - grocery-shared/grocery-web: npm install axios@^1.12.0
  - grocery-infra: npm install axios@^1.12.0
- Optional hardening: consider setting maxContentLength/maxBodyLength (Node) or implementing server-side response size limits.

**Testing Checklist:**
- [ ] Run existing test suites (web: vitest; infra: jest)
- [ ] Manually verify API flows: list/store/item CRUD, route generation
- [ ] Confirm axios interceptors still behave as expected (error handling)
- [ ] Verify builds/bundles succeed (vite) and scripts run successfully
- [ ] Sanity-check large but valid responses still work as expected

---

