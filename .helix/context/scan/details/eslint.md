# eslint - Vulnerability Details
**Package to Upgrade:** `eslint`
**Total Vulnerabilities:** 1
**Severity Breakdown:** 0 Critical, 0 High, 0 Medium, 1 Low

## Affected Lockfiles
- `grocery-api/package-lock.json`

## Summary
These vulnerabilities are in transitive dependencies. Upgrade `eslint` in package.json to fix them.

## Vulnerabilities

### tmp
**Vulnerable Package:** `tmp`
**CVE Count:** 1

#### GHSA-52f5-9888-hmc6
**Severity:** LOW

**Dependency Chain:** eslint → external-editor → tmp

**Description:** tmp allows arbitrary temporary file / directory write via symbolic link `dir` parameter

**Fixed In:** 0.2.4

**Direct Fix:** `npm install tmp@0.2.4`

---

#### Triage Assessment for tmp

**Status:** Completed

**Codebase Impact:** Low (dev-only; eslint is a devDependency and not used in production code. No imports of eslint, inquirer, external-editor, or tmp in src/.)

**Upgrade Decision:** Schedule (low risk; plan eslint major upgrade; add temporary override for tmp@0.2.4)

## Remediation Plan for tmp

**Analysis:**
- Current version: eslint 6.8.0 (devDependency) in grocery-api/package.json
- Vulnerable chain: eslint → inquirer → external-editor@3.1.0 → tmp@0.0.33
- CVE: GHSA-52f5-9888-hmc6 — tmp allows arbitrary temporary file/directory write via symbolic link dir parameter (fixed in 0.2.4)
- Affected code: Development tooling only; runtime unaffected. Evidence:
  - grocery-api/package.json shows eslint 6.8.0 in devDependencies
  - No runtime imports found in src/ for eslint/inquirer/external-editor/tmp
  - Inquirer EditorPrompt (grocery-api/node_modules/inquirer/lib/prompts/editor.js) uses external-editor.editAsync
  - external-editor (grocery-api/node_modules/external-editor/main/index.js) uses tmp.tmpNameSync without a custom dir option

**Recommendation:**
- Short-term: add npm overrides to pin tmp to a fixed version
  - In grocery-api/package.json, add:
    - "overrides": { "tmp": "0.2.4", "external-editor/tmp": "0.2.4", "inquirer/tmp": "0.2.4" }
  - Then run: npm install
- Medium-term: upgrade eslint to a modern major that pulls updated transitive deps
  - Command: npm install -D eslint@^9
  - Expect config/rule updates and higher Node.js requirements

**Testing Checklist:**
- [ ] Run existing test suite (npm test)
- [ ] Run linting (npx eslint .) and address config/rule changes
- [ ] Verify developer prompts (if used) still work after overrides/upgrade

---

