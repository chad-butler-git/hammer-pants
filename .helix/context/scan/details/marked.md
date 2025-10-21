# Direct - Vulnerability Details
**Package to Upgrade:** `Direct`
**Total Vulnerabilities:** 3
**Severity Breakdown:** 0 Critical, 2 High, 1 Medium, 0 Low

## Affected Lockfiles
- `grocery-shared/package-lock.json`

## Summary
This is a direct dependency. Upgrade it directly in package.json.

## Vulnerabilities

### marked
**Vulnerable Package:** `marked`
**CVE Count:** 3

#### GHSA-5v2h-r2cx-5xgj
**Severity:** HIGH

**Dependency Chain:** marked

**Description:** Inefficient Regular Expression Complexity in marked

**Fixed In:** 4.0.10

**Direct Fix:** `npm install marked@4.0.10`

---

#### GHSA-rrrm-qjm4-v8hf
**Severity:** HIGH

**Dependency Chain:** marked

**Description:** Inefficient Regular Expression Complexity in marked

**Fixed In:** 4.0.10

**Direct Fix:** `npm install marked@4.0.10`

---

#### GHSA-p9wx-2529-fp83
**Severity:** MEDIUM

**Dependency Chain:** marked

**Description:** Marked allows Regular Expression Denial of Service (ReDoS) attacks

**Fixed In:** 0.3.17

**Direct Fix:** `npm install marked@0.3.17`

---

#### Triage Assessment for marked

Status: Completed

## Remediation Plan for marked

**Upgrade Decision:** Upgrade now

**Analysis:**
- Current version: 0.3.9 (in grocery-shared/package.json)
- Target version: 4.0.10 (fixes GHSA-5v2h-r2cx-5xgj and GHSA-rrrm-qjm4-v8hf; later versions also include the fix for GHSA-p9wx-2529-fp83)
- Breaking changes: Yes — API changes from marked(text) to marked.parse(text); options handling changes; sanitize option removed; ESM defaults
- Affected code: 
  - grocery-shared/src/markdown.js uses marked(markdownText) to render markdown
  - grocery-api/src/routes/items.js imports sanitizeAndRenderMarkdown and passes user-controlled input (req.body.notes and item.notes) to marked via renderMarkdown
- Codebase Severity: High — user-supplied markdown can trigger ReDoS on the server, leading to CPU exhaustion and request latency/denial of service

**Recommendation:**
- Upgrade dependency in grocery-shared: `npm install marked@4.0.10`
- Refactor code to new API: replace `marked(text)` with `marked.parse(text)` in grocery-shared/src/markdown.js and adjust any options usage
- Remove deprecated sanitize option; if HTML sanitization is required, integrate a sanitizer like DOMPurify on the consumer side
- Update tests in grocery-shared/test/markdown.test.js to use the new API

**Testing Checklist:**
- [ ] Run existing test suite in grocery-shared and grocery-api
- [ ] Manually exercise endpoints that render notes (GET/POST/PUT /items) and verify markdown rendering still works
- [ ] Confirm no performance regressions or rendering differences for common markdown
- [ ] Verify no breaking changes in modules importing grocery-shared/src/markdown

---

