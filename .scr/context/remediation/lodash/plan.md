# Remediation Plan: lodash

## Summary
- **Current Version**: 4.17.19 (direct dependency in `grocery-api/package-lock.json`)
- **Target Version**: 4.18.1
- **CVEs Addressed**: 5 vulnerabilities
- **Lockfile**: grocery-api/package-lock.json

## CVEs Addressed
| CVE ID | Severity | Description |
|--------|----------|-------------|
| GHSA-35jh-r3h4-6jhm | High | Command injection in lodash via `_.template` (fixed in 4.17.21) |
| GHSA-r5fr-rjxr-66jc | High | Code injection via `_.template` `options.imports` key names / inherited property enumeration (fixed in 4.18.0) |
| GHSA-29mw-wpgm-hmr9 | Medium | ReDoS in `toNumber`, `trim`, `trimEnd` (fixed in 4.17.21) |
| GHSA-xxjr-mmjv-4gpg | Medium | Prototype pollution in `_.unset`/`_.omit` (fixed in 4.17.23) |
| GHSA-f23m-r3pf-42rh | Medium | Prototype pollution bypass via array path segments in `_.unset`/`_.omit` (fixed in 4.18.0) |

## Breaking Changes Analysis
- Upgrade path is **4.17.19 → 4.18.1**.
- Lodash is a mature library and these patch/minor releases are intended to be backward compatible, but security fixes here touch:
  - `_.template` validation and import merging behavior
  - `_.unset` / `_.omit` path validation/guardrails
- Potential behavior changes to watch for in this codebase:
  1. **`_.template`**: if the application uses `_.template` with custom `options.imports`, ensure import key names are valid identifiers and are developer-controlled.
  2. **`_.unset` / `_.omit`**: if code relies on unusual path formats (especially array-wrapped segments) or attempts to remove inherited/prototype properties, behavior may differ after the fix.

(Recommended: scan the codebase for `_.template(`, `template(`, `_.unset(`, `_.omit(` usages and add/adjust tests around those call sites.)

## Upgrade Command
From `grocery-api/`:
```bash
npm install lodash@4.18.1
```

## Post-Upgrade Steps
1. Re-generate lockfile cleanly (if needed): `npm install`
2. Run build: `npm run build`
3. Run tests: `npm test`
4. Smoke test key API flows that may touch lodash helpers (request validation, payload shaping, any templating logic).
5. Confirm `package-lock.json` now resolves `lodash` to **4.18.1** and that the vulnerability scan is clean for lodash.
