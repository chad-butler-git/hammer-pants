# fix(security): Upgrade lodash to 4.18.1

## Summary
This PR upgrades **lodash** from **4.17.19** to **4.18.1** (as resolved in `grocery-api/package-lock.json`) to remediate known security vulnerabilities.

## Vulnerabilities Resolved
- [GHSA-35jh-r3h4-6jhm](https://github.com/advisories/GHSA-35jh-r3h4-6jhm) — Command injection in lodash via `_.template` (fixed in 4.17.21)
- [GHSA-r5fr-rjxr-66jc](https://github.com/advisories/GHSA-r5fr-rjxr-66jc) — Code injection via `_.template` `options.imports` key names / inherited property enumeration (fixed in 4.18.0)
- [GHSA-29mw-wpgm-hmr9](https://github.com/advisories/GHSA-29mw-wpgm-hmr9) — ReDoS in `toNumber`, `trim`, `trimEnd` (fixed in 4.17.21)
- [GHSA-xxjr-mmjv-4gpg](https://github.com/advisories/GHSA-xxjr-mmjv-4gpg) — Prototype pollution in `_.unset`/`_.omit` (fixed in 4.17.23)
- [GHSA-f23m-r3pf-42rh](https://github.com/advisories/GHSA-f23m-r3pf-42rh) — Prototype pollution bypass via array path segments in `_.unset`/`_.omit` (fixed in 4.18.0)

## Breaking/Behavior Change Notes
Lodash releases in this range are intended to be backwards compatible, but the security fixes may change behavior in:
- **`_.template`**: tighter validation / import merging behavior. If the app uses `_.template` with custom `options.imports`, ensure import key names are valid identifiers and developer-controlled.
- **`_.unset` / `_.omit`**: additional path validation/guardrails. If code relies on unusual path formats (notably array-wrapped segments) or attempts to remove inherited/prototype properties, behavior may differ.

## What Changed
- Updated resolved lodash version to **4.18.1** in `grocery-api/package-lock.json`.

## Validation
Recommended after merge:
- From `grocery-api/`: `npm test` (and `npm run build` if applicable)
- Smoke test any code paths using `_.template`, `_.unset`, or `_.omit`.
