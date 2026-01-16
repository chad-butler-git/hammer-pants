# Remediation Plan: validator

## Summary
- Package: validator
- Current Version: 13.5.2
- Target Version: 13.15.22
- CVEs Fixed: 4
- Estimated Effort: low

## CVEs Addressed
| CVE ID | Severity | Vulnerable Package |
|--------|----------|--------------------|
| GHSA-vghf-hv5q-vc2g | High | validator |
| GHSA-9965-vmph-33xx | Moderate | validator |
| GHSA-qgmg-gppg-76g5 | Moderate | validator |
| GHSA-xx4c-jj58-r7x6 | Moderate | validator |

## Breaking Changes

### 1. URL parsing tightened in isURL()
- What changed: Security fixes in 13.15.20 adjusted protocol parsing (uses ':' instead of '://') to match browser behavior and close a validation bypass.
- Impact: Inputs previously considered valid by isURL may now be rejected; any custom allowlists relying on the old behavior may need updates.
- Mitigation: Review any uses of isURL (particularly where protocols are enforced). Update tests and allowlists to align with stricter parsing.

### 2. String length calculation in isLength() with Unicode variation selectors
- What changed: 13.15.22 fixes handling of \uFE0E/\uFE0F variation selectors so length is computed correctly.
- Impact: Inputs with emoji/variation selectors that previously passed max length checks might now fail (or vice versa) due to correct counting.
- Mitigation: If you validate emoji-heavy user input, re-verify max/min constraints and adjust limits or messaging as needed.

### 3. Regex DoS and sanitizer behavior for trim/rtrim
- What changed: Prior to 13.7.0, inefficient regexes in trim/rtrim could cause performance issues; fixes landed in >=13.7.0.
- Impact: Sanitization behavior should be equivalent for normal inputs, but extremely pathological inputs no longer cause excessive processing time.
- Mitigation: No code changes expected; keep version >=13.7.0.

### 4. General inefficient regex complexity fixes
- What changed: Broader regex performance improvements shipped in 13.7.0 to prevent excessive backtracking.
- Impact: None expected beyond performance improvements; edge-case strings may validate differently if previously timeouts were masked.
- Mitigation: Ensure tests cover any custom validators or heavy regex usage paths.

## Upgrade Command
```bash
npm install validator@13.15.22
```

## Post-Upgrade Steps
1. Run `npm install` in grocery-shared
2. Run `npm run build` (if applicable) and `npm test`
3. Spot-check flows using validator (URL validation, string length checks, trim/rtrim sanitization)
4. Update tests/allowlists if stricter validation causes failures (e.g., isURL, emoji/variation-selector cases)

## Risk Assessment
- Breaking changes: No (same major version; behavior is stricter but API-stable)
- Requires code changes: Unlikely (possible minor test updates if relying on previous permissive behavior)
- Test coverage needed: URL validation, any inputs with emoji/variation selectors, sanitization flows (trim/rtrim), any custom validators built atop validator APIs
