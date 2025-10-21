# Direct - Vulnerability Details
**Package to Upgrade:** `Direct`
**Total Vulnerabilities:** 2
**Severity Breakdown:** 0 Critical, 0 High, 0 Medium, 2 Low

## Affected Lockfiles
- `grocery-web/package-lock.json`

## Summary
This is a direct dependency. Upgrade it directly in package.json.

## Vulnerabilities

### vite
**Vulnerable Package:** `vite`
**CVE Count:** 2

#### GHSA-g4jq-h2w9-997c
**Severity:** LOW

**Dependency Chain:** vitest → vite-node → esbuild → vite

**Description:** Vite middleware may serve files starting with the same name with the public directory

**Fixed In:** 7.1.5

**Direct Fix:** `npm install vite@7.1.5`

---

#### GHSA-jqfw-vq24-v9c3
**Severity:** LOW

**Dependency Chain:** vitest → vite-node → esbuild → vite

**Description:** Vite's `server.fs` settings were not applied to HTML files

**Fixed In:** 7.1.5

**Direct Fix:** `npm install vite@7.1.5`

---

#### Triage Assessment for vite

**Status:** Completed

**Codebase Impact:** Low — Vite is a dev/build tool. The reported issues (middleware serving files with public-like names; server.fs settings not applied to HTML) affect the dev/preview server only. Our usage is limited to development via scripts (vite, vite build, vite preview) and configuration in grocery-web/vite.config.js. No production code imports Vite.

**Upgrade Decision:** Schedule upgrade — move from Vite 4.5.14 to >=7.1.5 which contains fixes.

**Remediation Plan:**
- Current version: 4.5.14 (grocery-web/package-lock.json)
- Target version: 7.1.5 or later
- Dependency type: Direct (devDependency)
- Breaking changes: Yes — major version jumps from 4.x to 7.x. However, @vitejs/plugin-react has peer support for ^4 || ^5 || ^6 || ^7, so compatibility is expected. Node version requirements may increase.
- Affected code: Dev server and build only

Recommendation:
- Update grocery-web/package.json devDependency: "vite": "^7.1.5"
- Run: npm install && npm run dev/build to verify
- Verify vite.config.js (server options) still behave as expected

Testing Checklist:
- [ ] Run existing unit tests (vitest)
- [ ] Test local dev server (vite) and preview
- [ ] Verify HMR and build output
- [ ] Check @vitejs/plugin-react compatibility and Node engine

---

