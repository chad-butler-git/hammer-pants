# Direct - Vulnerability Details
**Package to Upgrade:** `Direct`
**Total Vulnerabilities:** 3
**Severity Breakdown:** 0 Critical, 1 High, 2 Medium, 0 Low

## Affected Lockfiles
- `grocery-api/package-lock.json`

## Summary
This is a direct dependency. Upgrade it directly in package.json.

## Vulnerabilities

### jsonwebtoken
**Vulnerable Package:** `jsonwebtoken`
**CVE Count:** 3

#### GHSA-8cf7-32gw-wr33
**Severity:** HIGH

**Dependency Chain:** jsonwebtoken

**Description:** jsonwebtoken unrestricted key type could lead to legacy keys usage 

**Fixed In:** 9.0.0

**Direct Fix:** `npm install jsonwebtoken@9.0.0`

---

#### GHSA-hjrf-2m68-5959
**Severity:** MEDIUM

**Dependency Chain:** jsonwebtoken

**Description:** jsonwebtoken's insecure implementation of key retrieval function could lead to Forgeable Public/Private Tokens from RSA to HMAC

**Fixed In:** 9.0.0

**Direct Fix:** `npm install jsonwebtoken@9.0.0`

---

#### GHSA-qwph-4952-7xr6
**Severity:** MEDIUM

**Dependency Chain:** jsonwebtoken

**Description:** jsonwebtoken vulnerable to signature validation bypass due to insecure default algorithm in jwt.verify()

**Fixed In:** 9.0.0

**Direct Fix:** `npm install jsonwebtoken@9.0.0`

---

#### Triage Assessment for jsonwebtoken

## Remediation Plan for jsonwebtoken

**Upgrade Decision:** Upgrade now

**Analysis:**
- Current version: 8.5.1 (grocery-api/package.json)
- Target version: 9.0.0
- Breaking changes: Yes — major version. v9 tightens algorithm handling and key-type validation; default algorithm behavior changes. Our code already pins algorithms for share tokens; verifyToken should be updated to specify algorithms ['HS256'] or removed if unused.
- Affected code:
  - grocery-api/src/utils/auth.js — uses jwt.sign() and jwt.verify(); verifyShareToken() verifies user-supplied tokens with algorithms ['HS256']; verifyToken() uses default algorithms and is not referenced by routes.
  - grocery-api/src/routes/lists.js — calls verifyShareToken() on req.params.token
  - grocery-api/test/utils/*.js — tests for token generation and verification

**Recommendation:**
- Bump jsonwebtoken to ^9.0.0 in grocery-api: `npm install jsonwebtoken@9.0.0`
- Code hygiene:
  - Update verifyToken() to specify algorithms: `jwt.verify(token, secretKey, { algorithms: ['HS256'] })`
  - Move secret out of source to environment variable; ensure sufficient entropy
  - Keep explicit algorithm in generateShareToken() as HS256
  - Consider removing unused verifyToken() if not needed

**Testing Checklist:**
- [ ] Run grocery-api test suite
- [ ] Manually test GET /api/shared/:token with valid, tampered, and expired tokens
- [ ] Confirm tokens from POST /lists/:id/share expire after 15m
- [ ] Verify no breaking runtime errors after upgrade (sync sign/verify still work)
- [ ] Security regression: ensure jwt.verify rejects tokens with alg 'none' or mismatched alg

---

