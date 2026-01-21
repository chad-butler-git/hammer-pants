# Remediation Plan: validator

## Summary
- Package: validator
- Current Version: 13.15.22
- Target Version: 13.15.22 (minimum that fixes all known CVEs; latest available is 13.15.26)
- CVEs Fixed: 4
- Estimated Effort: low

## CVEs Addressed
| CVE/GHSA ID | Severity | Vulnerable Package |
|-------------|----------|--------------------|
| GHSA-vghf-hv5q-vc2g | High | validator |
| GHSA-9965-vmph-33xx | Moderate | validator |
| GHSA-qgmg-gppg-76g5 | Moderate | validator |
| GHSA-xx4c-jj58-r7x6 | Moderate | validator |

Notes:
- Fix versions per details file:
  - GHSA-vghf-hv5q-vc2g: fixed in 13.15.22 (isLength Unicode variation selectors)
  - GHSA-9965-vmph-33xx: fixed in 13.15.20 (isURL parsing bypass)
  - GHSA-qgmg-gppg-76g5: fixed in 13.7.0 (inefficient regex)
  - GHSA-xx4c-jj58-r7x6: fixed in 13.7.0 (trim/rtrim inefficient regex)
- Therefore, 13.15.22 is the minimum version that remediates all.

## Breaking Changes
No formal breaking changes expected within major v13. However, security fixes may tighten validation behavior:

### 1. Input validation semantics tightened (URLs)
- What changed: isURL now parses protocols in a browser-consistent way (":" delimiter rather than "://").
- Impact: Previously accepted malformed URLs may now be rejected. Tests or code relying on the older permissive behavior could fail.
- Mitigation: Update any fixtures or inputs to use valid URLs; if permissive behavior is desired, adjust options passed to isURL or implement custom validation.

### 2. String length calculation for emoji/variation selectors
- What changed: isLength accounts for Unicode variation selectors (\uFE0F/\uFE0E), preventing undercounting.
- Impact: Inputs that were previously considered within limits might now exceed limits and be rejected.
- Mitigation: Revisit length limits where emoji and variation selectors are common; consider higher limits if appropriate.

### 3. Regex performance improvements in trim/rtrim and other validators
- What changed: Inefficient regular expressions were fixed to prevent potential ReDoS.
- Impact: Behavior is functionally equivalent but performance under adversarial inputs is improved; no action required.
- Mitigation: None required; keep package updated.

## Upgrade Command
```bash
npm install validator@13.15.22
```

Since the repository already specifies validator 13.15.22 and the lockfile resolves to 13.15.22, no package change is necessary. If opting to follow the latest patch, you may choose:
```bash
npm install validator@13.15.26
```
(13.15.26 is the current "latest" dist-tag as of planning; still within v13 and not expected to introduce breaking changes.)

## Post-Upgrade Steps
1. Run `npm install` in grocery-shared
2. Run `npm run test` in all workspaces
3. Run `npm run build` where applicable
4. Spot-check any code paths using validator (tests reference isEmail in grocery-shared/test/Item.test.js) and any URL/length sanitization flows
5. Address any test failures due to stricter validation behavior

## Risk Assessment
- Breaking changes: No (within major v13), but behavior tighter in some validators
- Requires code changes: Unlikely; only if code relied on permissive/buggy behavior
- Test coverage needed: URL validation, string length constraints, any custom sanitization that uses trim/rtrim
