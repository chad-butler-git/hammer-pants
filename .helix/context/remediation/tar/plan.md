# Remediation Plan: tar

## Summary
- **Package:** tar
- **Current Version:** 4.4.8 (transitive, observed in grocery-infra/package-lock.json under fsevents → node-pre-gyp)
- **Target Version:** 6.2.1
- **CVEs Fixed:** 6
- **Estimated Effort:** low

## CVEs Addressed
| CVE ID | Severity | Vulnerable Package |
|--------|----------|--------------------|
| GHSA-3jfq-g458-7qm9 | High | tar |
| GHSA-5955-9wpr-37jh | High | tar |
| GHSA-9r2w-394v-53qc | High | tar |
| GHSA-f5x3-32g6-xq36 | Moderate | tar |
| GHSA-qq89-hq3f-393p | High | tar |
| GHSA-r628-mhmh-qjhw | High | tar |

Notes:
- Minimum fixed versions per advisory:
  - GHSA-3jfq-g458-7qm9: 4.4.14+, 5.0.6+, 6.1.1+
  - GHSA-5955-9wpr-37jh: 4.4.18+, 5.0.10+, 6.1.9+
  - GHSA-9r2w-394v-53qc: 4.4.16+, 5.0.8+, 6.1.7+
  - GHSA-qq89-hq3f-393p: 4.4.18+, 5.0.10+, 6.1.9+
  - GHSA-r628-mhmh-qjhw: 4.4.15+, 5.0.7+, 6.1.2+
  - GHSA-f5x3-32g6-xq36: 6.2.1+
- Therefore, to fix ALL CVEs, target tar >= 6.2.1.

## Breaking Changes

Context: tar is not directly used by the application code; it is a transitive dependency (primarily via optional dependency fsevents → node-pre-gyp). Upgrading to 6.x should not require code changes in this repo, but note the following:

### 1. Major version bump (4.x → 6.x)
- **What changed:** tar 6.x includes internal changes and tightened path normalization/symlink handling. Node.js engine requirement is now node >= 10.
- **Impact:** No direct imports of tar in this codebase. Transitive consumers (e.g., node-pre-gyp) typically use stable APIs that remain compatible across these versions. Low risk of incompatibility, but watch for tooling that bundles/extracts archives (install/build steps) particularly on Windows.
- **Mitigation:** Prefer npm overrides to force tar >= 6.2.1 across the workspace. Validate install/build on CI and a Windows dev machine if applicable.

### 2. Path normalization behavior
- **What changed:** tar 6.x more aggressively normalizes paths (e.g., always '/' as separator in entry.path) and hardens against symlink/directory cache confusion.
- **Impact:** If any scripts compare raw entry.path strings, results may differ. None found in this repo.
- **Mitigation:** Not applicable here; just regression-test install/build.

## Upgrade Command

Because tar is transitive here, there are two practical approaches:

- Preferred (no new direct dep): add an npm override in grocery-infra/package.json
  "overrides": { "tar": "6.2.1" }
  Then run:
```bash
npm install
```

- Alternative (explicit pin if overrides are not available): add tar as a dev dependency to ensure a patched version is hoisted:
```bash
npm install --save-dev tar@6.2.1
```

## Post-Upgrade Steps
1. Run `npm install` in grocery-infra.
2. Run `npm run build` and `npm test`.
3. On Windows (if used by contributors/CI), smoke test install steps that may invoke node-pre-gyp to confirm no regressions.
4. Address any unexpected issues in tooling that performs archive extraction.

## Risk Assessment
- **Breaking changes:** No (for our codebase; major bump is transitive only)
- **Requires code changes:** Unlikely
- **Test coverage needed:** CI install/build, Jest tests; optional Windows dev environment checks for fsevents/node-pre-gyp flows.
