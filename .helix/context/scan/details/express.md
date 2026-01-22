# express - Vulnerability Details
**Package to Upgrade:** `express`
**Total Vulnerabilities:** 1
**Severity Breakdown:** 0 Critical, 1 High, 0 Medium, 0 Low

## Affected Lockfiles
- `grocery-api/package-lock.json`

## Summary
These vulnerabilities are in transitive dependencies. Upgrade `express` in package.json to fix them.

## Vulnerabilities

### qs
**Vulnerable Package:** `qs`
**CVE Count:** 1

#### GHSA-6rw7-vpxm-498p
**Severity:** HIGH
**CVSS Score:** 8.7

**Dependency Chain:** grocery-api → express → qs

**Summary:** qs's arrayLimit bypass in its bracket notation allows DoS via memory exhaustion

**Details:** ### Summary

The `arrayLimit` option in qs does not enforce limits for bracket notation (`a[]=1&a[]=2`), allowing attackers to cause denial-of-service via memory exhaustion. Applications using `arrayLimit` for DoS protection are vulnerable.

### Details

The `arrayLimit` option only checks limits for indexed notation (`a[0]=1&a[1]=2`) but completely bypasses it for bracket notation (`a[]=1&a[]=2`).

**Vulnerable code** (`lib/parse.js:159-162`):
```javascript
if (root === '[]' && options.parseArrays) {
    obj = utils.combine([], leaf);  // No arrayLimit check
}
```

**Working code** (`lib/parse.js:175`):
```javascript
else if (index <= options.arrayLimit) {  // Limit checked here
    obj = [];
    obj[index] = leaf;
}
```

The bracket notation handler at line 159 uses `utils.combine([], leaf)` without validating against `options.arrayLimit`, while indexed notation at line 175 checks `index <= options.arrayLimit` before creating arrays.

### PoC

**Test 1 - Basic bypass:**
```bash
npm install qs
```

```javascript
const qs = require('qs');
const result = qs.parse('a[]=1&a[]=2&a[]=3&a[]=4&a[]=5&a[]=6', { arrayLimit: 5 });
console.log(result.a.length);  // Output: 6 (should be max 5)
```

**Test 2 - DoS demonstration:**
```javascript
const qs = require('qs');
const attack = 'a[]=' + Array(10000).fill('x').join('&a[]=');
const result = qs.parse(attack, { arrayLimit: 100 });
console.log(result.a.length);  // Output: 10000 (should be max 100)
```

**Configuration:**
- `arrayLimit: 5` (test 1) or `arrayLimit: 100` (test 2)
- Use bracket notation: `a[]=value` (not indexed `a[0]=value`)

### Impact

Denial of Service via memory exhaustion. Affects applications using `qs.parse()` with user-controlled input and `arrayLimit` for protection.

**Attack scenario:**
1. Attacker sends HTTP request: `GET /api/search?filters[]=x&filters[]=x&...&filters[]=x` (100,000+ times)
2. Application parses with `qs.parse(query, { arrayLimit: 100 })`
3. qs ignores limit, parses all 100,000 elements into array
4. Server memory exhausted → application crashes or becomes unresponsive
5. Service unavailable for all users

**Real-world impact:**
- Single malicious request can crash server
- No authentication required
- Easy to automate and scale
- Affects any endpoint parsing query strings with bracket notation

### Suggested Fix

Add `arrayLimit` validation to the bracket notation handler. The code already calculates `currentArrayLength` at line 147-151, but it's not used in the bracket notation handler at line 159.

**Current code** (`lib/parse.js:159-162`):
```javascript
if (root === '[]' && options.parseArrays) {
    obj = options.allowEmptyArrays && (leaf === '' || (options.strictNullHandling && leaf === null))
        ? []
        : utils.combine([], leaf);  // No arrayLimit check
}
```

**Fixed code**:
```javascript
if (root === '[]' && options.parseArrays) {
    // Use currentArrayLength already calculated at line 147-151
    if (options.throwOnLimitExceeded && currentArrayLength >= options.arrayLimit) {
        throw new RangeError('Array limit exceeded. Only ' + options.arrayLimit + ' element' + (options.arrayLimit === 1 ? '' : 's') + ' allowed in an array.');
    }
    
    // If limit exceeded and not throwing, convert to object (consistent with indexed notation behavior)
    if (currentArrayLength >= options.arrayLimit) {
        obj = options.plainObjects ? { __proto__: null } : {};
        obj[currentArrayLength] = leaf;
    } else {
        obj = options.allowEmptyArrays && (leaf === '' || (options.strictNullHandling && leaf === null))
            ? []
            : utils.combine([], leaf);
    }
}
```

This makes bracket notation behaviour consistent with indexed notation, enforcing `arrayLimit` and converting to object when limit is exceeded (per README documentation).

**Fixed In:** 6.14.1

**Direct Upgrade:** `npm install qs@6.14.1` (adds as direct dependency)

**Suggested Fix:** npm install express@latest (upgrade parent - triage will determine best version)

**References:**
- https://github.com/ljharb/qs/security/advisories/GHSA-6rw7-vpxm-498p
- https://nvd.nist.gov/vuln/detail/CVE-2025-15284
- https://github.com/ljharb/qs/commit/3086902ecf7f088d0d1803887643ac6c03d415b9
- https://github.com/ljharb/qs

---

## Remediation Plan for qs

Upgrade Decision: Upgrade now

Analysis:
- Current version: express 4.21.2 (qs 6.13.0 transitive)
- Target version: qs 6.14.1 (or express 4.x that includes qs >= 6.14.1)
- Breaking changes: No (patch-level bump to qs or a minor/patch update within Express 4.x)
- Affected code:
  - /home/ubuntu/helix/hammerpants/grocery-api/src/index.js initializes the Express app; Express's query parser runs on every request
  - /home/ubuntu/helix/hammerpants/grocery-api/node_modules/express/lib/middleware/query.js calls qs.parse() on the URL query string for each request
  - /home/ubuntu/helix/hammerpants/grocery-api/node_modules/express/lib/utils.js parseExtendedQueryString delegates to qs.parse()
- Exposure analysis: The vulnerability (GHSA-6rw7-vpxm-498p) allows a DoS via bracket-notation arrays bypassing arrayLimit. Because Express parses query strings automatically, a single unauthenticated request with a large bracket-notation array can trigger excessive memory allocation, impacting availability.

Recommendation:
- Immediate mitigation: Add an npm overrides rule to force qs >= 6.14.1 under express:
  - In /home/ubuntu/helix/hammerpants/grocery-api/package.json add:
    "overrides": { "express": { "qs": "6.14.1" } }
  - Then run: npm install (from /home/ubuntu/helix/hammerpants/grocery-api)
- Alternative: Upgrade express to the latest 4.x release that declares qs >= 6.14.1 when available. This should be a safe, non-breaking update.
- No source code changes are required in our app.

Testing Checklist:
- [ ] Run existing test suite
- [ ] Send requests with large bracket-notation arrays (e.g., /api/items?filters[]=x&filters[]=... repeated) and verify the server remains responsive and no excessive memory usage occurs
- [ ] Smoke test all API endpoints for normal behavior


---

