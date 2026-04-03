# react-router-dom - Vulnerability Details

**Package to Upgrade:** `react-router-dom`

**Total Vulnerabilities:** 4

**Severity Breakdown:** 0 Critical, 2 High, 2 Medium, 0 Low

## Affected Lockfiles

- `./grocery-shared/grocery-web/package-lock.json`

## Summary

These vulnerabilities are in transitive dependencies. Upgrade `react-router-dom` in package.json to fix them.

## Vulnerabilities

### @remix-run/router

**Vulnerable Package:** `@remix-run/router`

**CVE Count:** 2

#### GHSA-2w69-qvjg-hvjx

**Severity:** HIGH

**CVSS Score:** 9.0

**Dependency Chain:** root → react-router-dom → @remix-run/router

**Summary:** React Router vulnerable to XSS via Open Redirects

**Details:** React Router (and Remix v1/v2) SPA open navigation redirects originating from loaders or actions in [Framework Mode](https://reactrouter.com/start/modes#framework), [Data Mode](https://reactrouter.com/start/modes#data), or the unstable RSC modes can result in unsafe URLs causing unintended javascript execution on the client. This is only an issue if developers are creating redirect paths from untrusted content or via an open redirect.

> [!NOTE]
> This does not impact applications that use [Declarative Mode](https://reactrouter.com/start/modes#declarative) (`<BrowserRouter>`).

**Fixed In:** 7.12.0, 1.23.2

**Direct Upgrade:** `npm install @remix-run/router@7.12.0` (adds as direct dependency)

**Suggested Fix:** npm install react-router-dom@latest (upgrade parent)

---

#### GHSA-2w69-qvjg-hvjx

**Severity:** HIGH

**CVSS Score:** 9.0

**Dependency Chain:** root → react-router-dom → @remix-run/router

**Summary:** React Router vulnerable to XSS via Open Redirects

**Details:** React Router (and Remix v1/v2) SPA open navigation redirects originating from loaders or actions in [Framework Mode](https://reactrouter.com/start/modes#framework), [Data Mode](https://reactrouter.com/start/modes#data), or the unstable RSC modes can result in unsafe URLs causing unintended javascript execution on the client. This is only an issue if developers are creating redirect paths from untrusted content or via an open redirect.

> [!NOTE]
> This does not impact applications that use [Declarative Mode](https://reactrouter.com/start/modes#declarative) (`<BrowserRouter>`).

**Fixed In:** 7.12.0, 1.23.2

**Direct Upgrade:** `npm install @remix-run/router@7.12.0` (adds as direct dependency)

**Suggested Fix:** npm install react-router-dom@latest (upgrade parent)

---

### react-router

**Vulnerable Package:** `react-router`

**CVE Count:** 2

#### GHSA-9jcx-v3wj-wh4m

**Severity:** MEDIUM

**CVSS Score:** 7.5

**Dependency Chain:** root → react-router-dom → react-router

**Summary:** React Router has unexpected external redirect via untrusted paths

**Details:** An attacker-supplied path can be crafted so that when a React Router application navigates to it via `navigate()`, `<Link>`, or `redirect()`, the app performs a navigation/redirect to an external URL. This is only an issue if developers pass untrusted content into navigation paths in their application code.

**Fixed In:** 6.30.2, 7.9.6

**Direct Upgrade:** `npm install react-router@6.30.2` (adds as direct dependency)

**Suggested Fix:** npm install react-router-dom@latest (upgrade parent)

---

#### GHSA-9jcx-v3wj-wh4m

**Severity:** MEDIUM

**CVSS Score:** 7.5

**Dependency Chain:** root → react-router-dom → react-router

**Summary:** React Router has unexpected external redirect via untrusted paths

**Details:** An attacker-supplied path can be crafted so that when a React Router application navigates to it via `navigate()`, `<Link>`, or `redirect()`, the app performs a navigation/redirect to an external URL. This is only an issue if developers pass untrusted content into navigation paths in their application code.

**Fixed In:** 6.30.2, 7.9.6

**Direct Upgrade:** `npm install react-router@6.30.2` (adds as direct dependency)

**Suggested Fix:** npm install react-router-dom@latest (upgrade parent)

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

