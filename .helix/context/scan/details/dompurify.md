# Direct - Vulnerability Details
**Package to Upgrade:** `Direct`
**Total Vulnerabilities:** 4
**Severity Breakdown:** 1 Critical, 2 High, 1 Medium, 0 Low

## Affected Lockfiles
- `grocery-web/package-lock.json`

## Summary
This is a direct dependency. Upgrade it directly in package.json.

## Vulnerabilities

### dompurify
**Vulnerable Package:** `dompurify`
**CVE Count:** 4

#### GHSA-p3vf-v8qc-cwcr
**Severity:** CRITICAL

**Dependency Chain:** dompurify

**Description:** DOMPurify vulnerable to tampering by prototype polution

**Fixed In:** 2.4.2

**Direct Fix:** `npm install dompurify@2.4.2`

---

#### GHSA-gx9m-whjm-85jf
**Severity:** HIGH

**Dependency Chain:** dompurify

**Description:** DOMpurify has a nesting-based mXSS

**Fixed In:** 3.1.3

**Direct Fix:** `npm install dompurify@3.1.3`

---

#### GHSA-mmhx-hmjr-r674
**Severity:** HIGH

**Dependency Chain:** dompurify

**Description:** DOMPurify allows tampering by prototype pollution

**Fixed In:** 3.1.3

**Direct Fix:** `npm install dompurify@3.1.3`

---

#### GHSA-vhxf-7vqr-mrjg
**Severity:** MEDIUM

**Dependency Chain:** dompurify

**Description:** DOMPurify allows Cross-site Scripting (XSS)

**Fixed In:** 3.2.4

**Direct Fix:** `npm install dompurify@3.2.4`

---

#### Triage Assessment for dompurify

## Remediation Plan for dompurify (CVE-2021-23337)

**Upgrade Decision:** Upgrade now

**Analysis:**
- Current version: 2.2.6 (grocery-web/package.json)
- Target version: 3.2.4 (fixes all listed GHSA advisories for dompurify)
- Breaking changes: Yes (major upgrade from 2.x to 3.x)
- Affected code:
  - grocery-web/src/components/ItemSelector.jsx — DOMPurify.sanitize called with a constant string only (safe)
  - grocery-web/src/components/MarkdownEditor.jsx — DOMPurify.sanitize called on HTML derived from user-provided markdown; however, current preview rendering later overrides this with a simple <p>${markdown}</p> string, meaning sanitized output is not actually used. The vulnerable API is present but not currently feeding rendered output.

**Recommendation:**
- Bump dompurify to 3.2.4: npm install dompurify@^3.2.4
- Verify sanitize() usage remains compatible. No special config flags (e.g., SAFE_FOR_TEMPLATES) are used today; keep defaults.
- Consider ensuring the preview uses the sanitized output consistently and does not override it with unsanitized content before dangerouslySetInnerHTML.

**Testing Checklist:**
- [ ] Run existing test suite
- [ ] Manually test Markdown preview to ensure sanitized output renders correctly and no XSS payloads execute
- [ ] Verify no regressions in ItemSelector and other components that might add HTML rendering in the future

---

