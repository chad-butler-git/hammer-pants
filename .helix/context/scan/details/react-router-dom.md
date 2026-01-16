# react-router-dom - Vulnerability Details
**Package to Upgrade:** `react-router-dom`
**Total Vulnerabilities:** 4
**Severity Breakdown:** 0 Critical, 2 High, 2 Medium, 0 Low

## Affected Lockfiles
- `grocery-shared/grocery-web/package-lock.json`
- `grocery-web/package-lock.json`

## Summary
These vulnerabilities are in transitive dependencies. Upgrade `react-router-dom` in package.json to fix them.

## Vulnerabilities

### @remix-run/router
**Vulnerable Package:** `@remix-run/router`
**CVE Count:** 2

#### GHSA-2w69-qvjg-hvjx
**Severity:** HIGH
**CVSS Score:** 8.0

**Dependency Chain:** root → react-router-dom → @remix-run/router

**Summary:** React Router vulnerable to XSS via Open Redirects

**Details:** React Router (and Remix v1/v2) SPA open navigation redirects originating from loaders or actions in [Framework Mode](https://reactrouter.com/start/modes#framework), [Data Mode](https://reactrouter.com/start/modes#data), or the unstable RSC modes can result in unsafe URLs causing unintended javascript execution on the client. This is only an issue if developers are creating redirect paths from untrusted content or via an open redirect.

> [!NOTE]
> This does not impact applications that use [Declarative Mode](https://reactrouter.com/start/modes#declarative) (`<BrowserRouter>`).

**Fixed In:** 7.12.0, 1.23.2

**Direct Upgrade:** `npm install @remix-run/router@7.12.0` (adds as direct dependency)

**Suggested Fix:** npm install react-router-dom@latest (upgrade parent - triage will determine best version)

**References:**
- https://github.com/remix-run/react-router/security/advisories/GHSA-2w69-qvjg-hvjx
- https://github.com/remix-run/react-router

---

#### GHSA-2w69-qvjg-hvjx
**Severity:** HIGH
**CVSS Score:** 8.0

**Dependency Chain:** root → react-router-dom → @remix-run/router

**Summary:** React Router vulnerable to XSS via Open Redirects

**Details:** React Router (and Remix v1/v2) SPA open navigation redirects originating from loaders or actions in [Framework Mode](https://reactrouter.com/start/modes#framework), [Data Mode](https://reactrouter.com/start/modes#data), or the unstable RSC modes can result in unsafe URLs causing unintended javascript execution on the client. This is only an issue if developers are creating redirect paths from untrusted content or via an open redirect.

> [!NOTE]
> This does not impact applications that use [Declarative Mode](https://reactrouter.com/start/modes#declarative) (`<BrowserRouter>`).

**Fixed In:** 7.12.0, 1.23.2

**Direct Upgrade:** `npm install @remix-run/router@7.12.0` (adds as direct dependency)

**Suggested Fix:** npm install react-router-dom@latest (upgrade parent - triage will determine best version)

**References:**
- https://github.com/remix-run/react-router/security/advisories/GHSA-2w69-qvjg-hvjx
- https://github.com/remix-run/react-router

---

## Remediation Plan for @remix-run/router

**Upgrade Decision:** Upgrade now

**Analysis:**
- Current version: @remix-run/router 1.23.0 (via react-router-dom 6.x in grocery-web and grocery-shared/grocery-web)
- Target version: @remix-run/router 1.23.2 (patch with fix)
- Breaking changes: No (patch upgrade only)
- Affected code: 
  - grocery-web/src/main.jsx uses <BrowserRouter> (Declarative Mode), which the advisory notes is not impacted.
  - Navigation calls use static internal paths only: useNavigate('/') or '/route' in pages/*, and <Link to="/..."> in components and pages. No untrusted user input is passed into navigate(), Link, or redirect().

**Recommendation:**
- Bump react-router-dom to a patched 6.x that resolves @remix-run/router>=1.23.2 (e.g., react-router-dom ^6.30.2) and reinstall to update the lockfile.
  - Example: npm install react-router-dom@^6.30.2 --workspace=grocery-web --save-exact (adjust for your package manager/workspaces) and do the same for grocery-shared/grocery-web.
  - Alternatively, run npm update to pull patched transitive versions if your semver ranges allow it.

**Testing Checklist:**
- [ ] Run existing test suite (vitest) in both web apps
- [ ] Manually verify in-browser navigation: Home -> List -> Route -> back to Home
- [ ] Verify wildcard route (<Navigate to="/" replace />) behavior is unchanged
- [ ] Sanity check deep links (e.g., /items/edit/:id) still render

---


### react-router
**Vulnerable Package:** `react-router`
**CVE Count:** 2

#### GHSA-9jcx-v3wj-wh4m
**Severity:** MODERATE
**CVSS Score:** 6.5

**Dependency Chain:** root → react-router-dom → react-router

**Summary:** React Router has unexpected external redirect via untrusted paths

**Details:** An attacker-supplied path can be crafted so that when a React Router application navigates to it via `navigate()`, `<Link>`, or `redirect()`, the app performs a navigation/redirect to an external URL. This is only an issue if developers pass untrusted content into navigation paths in their application code.

**Fixed In:** 6.30.2, 7.9.6

**Direct Upgrade:** `npm install react-router@6.30.2` (adds as direct dependency)

**Suggested Fix:** npm install react-router-dom@latest (upgrade parent - triage will determine best version)

**References:**
- https://github.com/remix-run/react-router/security/advisories/GHSA-9jcx-v3wj-wh4m
- https://github.com/remix-run/react-router

---

#### GHSA-9jcx-v3wj-wh4m
**Severity:** MODERATE
**CVSS Score:** 6.5

**Dependency Chain:** root → react-router-dom → react-router

**Summary:** React Router has unexpected external redirect via untrusted paths

**Details:** An attacker-supplied path can be crafted so that when a React Router application navigates to it via `navigate()`, `<Link>`, or `redirect()`, the app performs a navigation/redirect to an external URL. This is only an issue if developers pass untrusted content into navigation paths in their application code.

**Fixed In:** 6.30.2, 7.9.6

**Direct Upgrade:** `npm install react-router@6.30.2` (adds as direct dependency)

**Suggested Fix:** npm install react-router-dom@latest (upgrade parent - triage will determine best version)

**References:**
- https://github.com/remix-run/react-router/security/advisories/GHSA-9jcx-v3wj-wh4m
- https://github.com/remix-run/react-router

---

## Remediation Plan for react-router

**Upgrade Decision:** Upgrade now

**Analysis:**
- Current version: react-router 6.30.1 (via react-router-dom in both grocery web apps)
- Target version: react-router 6.30.2 (patch with fix)
- Breaking changes: No (patch upgrade only)
- Affected code: We use useNavigate and <Link> but only with hardcoded internal paths (e.g., '/', '/route', `/items/edit/${item.id}`) derived from app state, not from untrusted user input or query params. This means the external redirect issue is not reachable in our code.

**Recommendation:**
- Update react-router-dom to a version that pulls react-router>=6.30.2 (e.g., react-router-dom ^6.30.2) and refresh the lockfile.
- If needed, add a direct dependency pin for react-router 6.30.2 to force resolution, then remove after lock is updated.

**Testing Checklist:**
- [ ] Run test suite and click through navigation flows
- [ ] Validate useNavigate('/') redirects after actions still work
- [ ] Verify all <Link to> buttons navigate internally as expected

---

