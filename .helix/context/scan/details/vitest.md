# vitest - Vulnerability Details
**Package to Upgrade:** `vitest`
**Total Vulnerabilities:** 2
**Severity Breakdown:** 0 Critical, 0 High, 0 Medium, 2 Low

## Affected Lockfiles
- `grocery-shared/grocery-web/package-lock.json`

## Summary
These vulnerabilities are in transitive dependencies. Upgrade `vitest` in package.json to fix them.

## Vulnerabilities

### vite
**Vulnerable Package:** `vite`
**CVE Count:** 2

#### GHSA-g4jq-h2w9-997c
**Severity:** LOW

**Dependency Chain:** vitest → vite

**Description:** Vite middleware may serve files starting with the same name with the public directory

**Fixed In:** 7.1.5

**Direct Fix:** `npm install vite@7.1.5`

---

#### GHSA-jqfw-vq24-v9c3
**Severity:** LOW

**Dependency Chain:** vitest → vite

**Description:** Vite's `server.fs` settings were not applied to HTML files

**Fixed In:** 7.1.5

**Direct Fix:** `npm install vite@7.1.5`

---

#### Triage Assessment for vite

**Status:** Completed

**Codebase Impact:** Low — The vulnerable package is vite as a transitive dependency of vitest. The issues affect Vite's dev server behavior and do not impact our production code. Vitest usage is confined to test files (grocery-web/src/test/*.test.jsx) and configuration.

**Upgrade Decision:** Upgrade now — bump vite to >=7.1.5 within the grocery-shared/grocery-web workspace (either as an explicit devDependency or via upgrading vitest to a version that resolves vite 7.1.5).

**Remediation Plan:**
- Current version (resolved): vite 7.0.5 via vitest (grocery-shared/grocery-web/package-lock.json)
- Target version: vite 7.1.5 or later
- Dependency type: Transitive (vitest → vite)
- Breaking changes: No for this workspace — staying within Vite 7.x minor bump (7.0.5 → 7.1.5)
- Affected code: Test runner/dev server only

Recommendation:
- If vite is not explicitly declared, add devDependency in grocery-shared/grocery-web/package.json: "vite": "^7.1.5" and run npm install; or upgrade vitest to a release that ensures vite >=7.1.5.

Testing Checklist:
- [ ] Run vitest in this workspace
- [ ] Verify test config still loads (vitest uses Vite under the hood)
- [ ] Spot-check any HTML serving in tests if applicable

---

