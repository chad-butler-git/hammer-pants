# vitest - Vulnerability Details

**Package to Upgrade:** `vitest`

**Total Vulnerabilities:** 4

**Severity Breakdown:** 0 Critical, 2 High, 2 Medium, 0 Low

## Affected Lockfiles

- `./grocery-shared/grocery-web/package-lock.json`

## Summary

These vulnerabilities are in transitive dependencies. Upgrade `vitest` in package.json to fix them.

## Vulnerabilities

### picomatch

**Vulnerable Package:** `picomatch`

**CVE Count:** 4

#### GHSA-c2c7-rcm5-vvqj

**Severity:** HIGH

**CVSS Score:** 7.5

**Dependency Chain:** root → vitest → picomatch

**Summary:** Picomatch has a ReDoS vulnerability via extglob quantifiers

**Details:** ### Impact
`picomatch` is vulnerable to Regular Expression Denial of Service (ReDoS) when processing crafted extglob patterns. Certain patterns using extglob quantifiers such as `+()` and `*()`, especially when combined with overlapping alternatives or nested extglobs, are compiled into regular expressions that can exhibit catastrophic backtracking on non-matching input.

Examples of problematic patterns include `+(a|aa)`, `+(*|?)`, `+(+(a))`, `*(+(a))`, and `+(+(+(a)))`. In local reproduction, these patterns caused multi-second event-loop blocking with relatively short inputs. For example, `+(a|aa)` compiled to `^(?:(?=.)(?:a|aa)+)$` and took about 2 seconds to reject a 41-character non-matching input, while nested patterns such as `+(+(a))` and `*(+(a))` took around 29 seconds to reject a 33-character input on a modern M1 MacBook.

Applications are impacted when they allow untrusted users to supply glob patterns that are passed to `picomatch` for compilation or matching. In those cases, an attacker can cause excessive CPU consumption and block the Node.js event loop, resulting in a denial of service. Applications that only use trusted, developer-controlled glob patterns are much less likely to be exposed in a security-relevant way.

### Patches
This issue is fixed in picomatch 4.0.4, 3.0.2 and 2.3.2.

Users should upgrade to one of these versions or later, depending on their supported release line.

### Workarounds
If upgrading is not immediately possible, avoid passing untrusted glob patterns to `picomatch`.

Possible mitigations include:
- disable extglob support for untrusted patterns by using `noextglob: true`
- reject or sanitize patterns containing nested extglobs or extglob quantifiers such as `+()` and `*()`
- enforce strict allowlists for accepted pattern syntax
- run matching in an isolated worker or separate process with time and resource limits
- apply application-level request throttling and input validation for any endpoint that accepts glob patterns

### Resources
- Picomatch repository: https://github.com/micromatch/picomatch
- `lib/parse.js` and `lib/constants.js` are involved in generating the vulnerable regex forms
- Comparable ReDoS precedent: CVE-2024-4067 (`micromatch`)
- Comparable generated-regex precedent: CVE-2024-45296 (`path-to-regexp`)

**Fixed In:** 4.0.4, 3.0.2, 2.3.2

**Direct Upgrade:** `npm install picomatch@4.0.4` (adds as direct dependency)

**Suggested Fix:** npm install vitest@latest (upgrade parent)

---

#### GHSA-c2c7-rcm5-vvqj

**Severity:** HIGH

**CVSS Score:** 7.5

**Dependency Chain:** root → vitest → picomatch

**Summary:** Picomatch has a ReDoS vulnerability via extglob quantifiers

**Details:** ### Impact
`picomatch` is vulnerable to Regular Expression Denial of Service (ReDoS) when processing crafted extglob patterns. Certain patterns using extglob quantifiers such as `+()` and `*()`, especially when combined with overlapping alternatives or nested extglobs, are compiled into regular expressions that can exhibit catastrophic backtracking on non-matching input.

Examples of problematic patterns include `+(a|aa)`, `+(*|?)`, `+(+(a))`, `*(+(a))`, and `+(+(+(a)))`. In local reproduction, these patterns caused multi-second event-loop blocking with relatively short inputs. For example, `+(a|aa)` compiled to `^(?:(?=.)(?:a|aa)+)$` and took about 2 seconds to reject a 41-character non-matching input, while nested patterns such as `+(+(a))` and `*(+(a))` took around 29 seconds to reject a 33-character input on a modern M1 MacBook.

Applications are impacted when they allow untrusted users to supply glob patterns that are passed to `picomatch` for compilation or matching. In those cases, an attacker can cause excessive CPU consumption and block the Node.js event loop, resulting in a denial of service. Applications that only use trusted, developer-controlled glob patterns are much less likely to be exposed in a security-relevant way.

### Patches
This issue is fixed in picomatch 4.0.4, 3.0.2 and 2.3.2.

Users should upgrade to one of these versions or later, depending on their supported release line.

### Workarounds
If upgrading is not immediately possible, avoid passing untrusted glob patterns to `picomatch`.

Possible mitigations include:
- disable extglob support for untrusted patterns by using `noextglob: true`
- reject or sanitize patterns containing nested extglobs or extglob quantifiers such as `+()` and `*()`
- enforce strict allowlists for accepted pattern syntax
- run matching in an isolated worker or separate process with time and resource limits
- apply application-level request throttling and input validation for any endpoint that accepts glob patterns

### Resources
- Picomatch repository: https://github.com/micromatch/picomatch
- `lib/parse.js` and `lib/constants.js` are involved in generating the vulnerable regex forms
- Comparable ReDoS precedent: CVE-2024-4067 (`micromatch`)
- Comparable generated-regex precedent: CVE-2024-45296 (`path-to-regexp`)

**Fixed In:** 4.0.4, 3.0.2, 2.3.2

**Direct Upgrade:** `npm install picomatch@4.0.4` (adds as direct dependency)

**Suggested Fix:** npm install vitest@latest (upgrade parent)

---

#### GHSA-3v7f-55p6-f55p

**Severity:** MEDIUM

**CVSS Score:** 5.0

**Dependency Chain:** root → vitest → picomatch

**Summary:** Picomatch: Method Injection in POSIX Character Classes causes incorrect Glob Matching

**Details:** ### Impact
picomatch is vulnerable to a **method injection vulnerability (CWE-1321)** affecting the `POSIX_REGEX_SOURCE` object. Because the object inherits from `Object.prototype`, specially crafted POSIX bracket expressions (e.g., `[[:constructor:]]`) can reference inherited method names. These methods are implicitly converted to strings and injected into the generated regular expression.

This leads to **incorrect glob matching behavior (integrity impact)**, where patterns may match unintended filenames. The issue does **not enable remote code execution**, but it can cause security-relevant logic errors in applications that rely on glob matching for filtering, validation, or access control.

All users of affected `picomatch` versions that process untrusted or user-controlled glob patterns are potentially impacted.

### Patches

This issue is fixed in picomatch 4.0.4, 3.0.2 and 2.3.2.

Users should upgrade to one of these versions or later, depending on their supported release line.

### Workarounds

If upgrading is not immediately possible, avoid passing untrusted glob patterns to picomatch.

Possible mitigations include:
- Sanitizing or rejecting untrusted glob patterns, especially those containing POSIX character classes like `[[:...:]]`.
- Avoiding the use of POSIX bracket expressions if user input is involved.
- Manually patching the library by modifying `POSIX_REGEX_SOURCE` to use a null prototype:

  ```js
  const POSIX_REGEX_SOURCE = {
    __proto__: null,
    alnum: 'a-zA-Z0-9',
    alpha: 'a-zA-Z',
    // ... rest unchanged
  };
  
### Resources

- fix for similar issue: https://github.com/micromatch/picomatch/pull/144
- picomatch repository https://github.com/micromatch/picomatch

**Fixed In:** 4.0.4, 3.0.2, 2.3.2

**Direct Upgrade:** `npm install picomatch@4.0.4` (adds as direct dependency)

**Suggested Fix:** npm install vitest@latest (upgrade parent)

---

#### GHSA-3v7f-55p6-f55p

**Severity:** MEDIUM

**CVSS Score:** 5.0

**Dependency Chain:** root → vitest → picomatch

**Summary:** Picomatch: Method Injection in POSIX Character Classes causes incorrect Glob Matching

**Details:** ### Impact
picomatch is vulnerable to a **method injection vulnerability (CWE-1321)** affecting the `POSIX_REGEX_SOURCE` object. Because the object inherits from `Object.prototype`, specially crafted POSIX bracket expressions (e.g., `[[:constructor:]]`) can reference inherited method names. These methods are implicitly converted to strings and injected into the generated regular expression.

This leads to **incorrect glob matching behavior (integrity impact)**, where patterns may match unintended filenames. The issue does **not enable remote code execution**, but it can cause security-relevant logic errors in applications that rely on glob matching for filtering, validation, or access control.

All users of affected `picomatch` versions that process untrusted or user-controlled glob patterns are potentially impacted.

### Patches

This issue is fixed in picomatch 4.0.4, 3.0.2 and 2.3.2.

Users should upgrade to one of these versions or later, depending on their supported release line.

### Workarounds

If upgrading is not immediately possible, avoid passing untrusted glob patterns to picomatch.

Possible mitigations include:
- Sanitizing or rejecting untrusted glob patterns, especially those containing POSIX character classes like `[[:...:]]`.
- Avoiding the use of POSIX bracket expressions if user input is involved.
- Manually patching the library by modifying `POSIX_REGEX_SOURCE` to use a null prototype:

  ```js
  const POSIX_REGEX_SOURCE = {
    __proto__: null,
    alnum: 'a-zA-Z0-9',
    alpha: 'a-zA-Z',
    // ... rest unchanged
  };
  
### Resources

- fix for similar issue: https://github.com/micromatch/picomatch/pull/144
- picomatch repository https://github.com/micromatch/picomatch

**Fixed In:** 4.0.4, 3.0.2, 2.3.2

**Direct Upgrade:** `npm install picomatch@4.0.4` (adds as direct dependency)

**Suggested Fix:** npm install vitest@latest (upgrade parent)

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

