# brace-expansion - Vulnerability Details

**Package to Upgrade:** `brace-expansion`

**Total Vulnerabilities:** 2

**Severity Breakdown:** 0 Critical, 0 High, 2 Medium, 0 Low

## Affected Lockfiles

- `./grocery-shared/grocery-web/package-lock.json`

## Summary

These vulnerabilities are in transitive dependencies. Upgrade `brace-expansion` in package.json to fix them.

## Vulnerabilities

### brace-expansion

**Vulnerable Package:** `brace-expansion`

**CVE Count:** 2

#### GHSA-f886-m6hf-6m8v

**Severity:** MEDIUM

**CVSS Score:** 7.5

**Dependency Chain:** root → brace-expansion

**Summary:** brace-expansion: Zero-step sequence causes process hang and memory exhaustion

**Details:** ### Impact

A brace pattern with a zero step value (e.g., `{1..2..0}`) causes the sequence generation loop to run indefinitely, making the process hang for seconds and allocate heaps of memory.

The loop in question:

https://github.com/juliangruber/brace-expansion/blob/daa71bcb4a30a2df9bcb7f7b8daaf2ab30e5794a/src/index.ts#L184

`test()` is one of

https://github.com/juliangruber/brace-expansion/blob/daa71bcb4a30a2df9bcb7f7b8daaf2ab30e5794a/src/index.ts#L107-L113

The increment is computed as `Math.abs(0) = 0`, so the loop variable never advances. On a test machine, the process hangs for about 3.5 seconds and allocates roughly 1.9 GB of memory before throwing a `RangeError`. Setting max to any value has no effect because the limit is only checked at the output combination step, not during sequence generation.

This affects any application that passes untrusted strings to expand(), or by error sets a step value of `0`. That includes tools built on minimatch/glob that resolve patterns from CLI arguments or config files. The input needed is just 10 bytes.

### Patches


Upgrade to versions
- 5.0.5+

A step increment of 0 is now sanitized to 1, which matches bash behavior.

### Workarounds

Sanitize strings passed to `expand()` to ensure a step value of `0` is not used.

**Fixed In:** 5.0.5, 3.0.2, 2.0.3

**Direct Upgrade:** `npm install brace-expansion@5.0.5` (adds as direct dependency)

**Suggested Fix:** npm install brace-expansion@latest (upgrade parent)

---

#### GHSA-f886-m6hf-6m8v

**Severity:** MEDIUM

**CVSS Score:** 7.5

**Dependency Chain:** root → brace-expansion

**Summary:** brace-expansion: Zero-step sequence causes process hang and memory exhaustion

**Details:** ### Impact

A brace pattern with a zero step value (e.g., `{1..2..0}`) causes the sequence generation loop to run indefinitely, making the process hang for seconds and allocate heaps of memory.

The loop in question:

https://github.com/juliangruber/brace-expansion/blob/daa71bcb4a30a2df9bcb7f7b8daaf2ab30e5794a/src/index.ts#L184

`test()` is one of

https://github.com/juliangruber/brace-expansion/blob/daa71bcb4a30a2df9bcb7f7b8daaf2ab30e5794a/src/index.ts#L107-L113

The increment is computed as `Math.abs(0) = 0`, so the loop variable never advances. On a test machine, the process hangs for about 3.5 seconds and allocates roughly 1.9 GB of memory before throwing a `RangeError`. Setting max to any value has no effect because the limit is only checked at the output combination step, not during sequence generation.

This affects any application that passes untrusted strings to expand(), or by error sets a step value of `0`. That includes tools built on minimatch/glob that resolve patterns from CLI arguments or config files. The input needed is just 10 bytes.

### Patches


Upgrade to versions
- 5.0.5+

A step increment of 0 is now sanitized to 1, which matches bash behavior.

### Workarounds

Sanitize strings passed to `expand()` to ensure a step value of `0` is not used.

**Fixed In:** 5.0.5, 3.0.2, 2.0.3

**Direct Upgrade:** `npm install brace-expansion@5.0.5` (adds as direct dependency)

**Suggested Fix:** npm install brace-expansion@latest (upgrade parent)

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

