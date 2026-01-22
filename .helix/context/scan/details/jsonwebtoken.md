# jsonwebtoken - Vulnerability Details
**Package to Upgrade:** `jsonwebtoken`
**Total Vulnerabilities:** 4
**Severity Breakdown:** 0 Critical, 2 High, 2 Medium, 0 Low

## Affected Lockfiles
- `grocery-api/package-lock.json`

## Summary
This is a direct dependency. Upgrade `jsonwebtoken` directly in package.json.

## Vulnerabilities

### jsonwebtoken
**Vulnerable Package:** `jsonwebtoken`
**CVE Count:** 3

#### GHSA-8cf7-32gw-wr33
**Severity:** HIGH
**CVSS Score:** 8.1

**Dependency Chain:** grocery-api → jsonwebtoken

**Summary:** jsonwebtoken unrestricted key type could lead to legacy keys usage 

**Details:** # Overview

Versions `<=8.5.1` of `jsonwebtoken` library could be misconfigured so that legacy, insecure key types are used for signature verification. For example, DSA keys could be used with the RS256 algorithm. 

# Am I affected?

You are affected if you are using an algorithm and a key type other than the combinations mentioned below

| Key type |  algorithm                                    |
|----------|------------------------------------------|
| ec           | ES256, ES384, ES512                      |
| rsa          | RS256, RS384, RS512, PS256, PS384, PS512 |
| rsa-pss  | PS256, PS384, PS512                      |

And for Elliptic Curve algorithms:

| `alg` | Curve      |
|-------|------------|
| ES256 | prime256v1 |
| ES384 | secp384r1  |
| ES512 | secp521r1  |

# How do I fix it?

Update to version 9.0.0. This version validates for asymmetric key type and algorithm combinations. Please refer to the above mentioned algorithm / key type combinations for the valid secure configuration. After updating to version 9.0.0, If you still intend to continue with signing or verifying tokens using invalid key type/algorithm value combinations, you’ll need to set the `allowInvalidAsymmetricKeyTypes` option to `true` in the `sign()` and/or `verify()` functions.

# Will the fix impact my users?

There will be no impact, if you update to version 9.0.0 and you already use a valid secure combination of key type and algorithm. Otherwise,  use the  `allowInvalidAsymmetricKeyTypes` option  to `true` in the `sign()` and `verify()` functions to continue usage of invalid key type/algorithm combination in 9.0.0 for legacy compatibility. 



**Fixed In:** 9.0.0

**Recommended Fix:** `npm install jsonwebtoken@9.0.0`

**References:**
- https://github.com/auth0/node-jsonwebtoken/security/advisories/GHSA-8cf7-32gw-wr33
- https://nvd.nist.gov/vuln/detail/CVE-2022-23539
- https://github.com/auth0/node-jsonwebtoken/commit/e1fa9dcc12054a8681db4e6373da1b30cf7016e3
- https://github.com/auth0/node-jsonwebtoken
- https://security.netapp.com/advisory/ntap-20240621-0007

---

#### GHSA-hjrf-2m68-5959
**Severity:** MODERATE
**CVSS Score:** 5.0

**Dependency Chain:** grocery-api → jsonwebtoken

**Summary:** jsonwebtoken's insecure implementation of key retrieval function could lead to Forgeable Public/Private Tokens from RSA to HMAC

**Details:** # Overview

Versions `<=8.5.1` of `jsonwebtoken` library can be misconfigured so that passing a poorly implemented key retrieval function (referring to the `secretOrPublicKey` argument from the [readme link](https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback)) will result in incorrect verification of tokens. There is a possibility of using a different algorithm and key combination in verification  than the one that was used to sign the tokens. Specifically, tokens signed with an asymmetric public key could be verified with a symmetric HS256 algorithm. This can lead to successful validation of forged tokens. 

# Am I affected?

You will be affected if your application is supporting usage of both symmetric key and asymmetric key in jwt.verify() implementation with the same key retrieval function. 

# How do I fix it?
 
Update to version 9.0.0.

# Will the fix impact my users?

There is no impact for end users

**Fixed In:** 9.0.0

**Recommended Fix:** `npm install jsonwebtoken@9.0.0`

**References:**
- https://github.com/auth0/node-jsonwebtoken/security/advisories/GHSA-hjrf-2m68-5959
- https://nvd.nist.gov/vuln/detail/CVE-2022-23541
- https://github.com/auth0/node-jsonwebtoken/commit/e1fa9dcc12054a8681db4e6373da1b30cf7016e3
- https://github.com/auth0/node-jsonwebtoken
- https://github.com/auth0/node-jsonwebtoken/releases/tag/v9.0.0
- ... and 1 more

---

#### GHSA-qwph-4952-7xr6
**Severity:** MODERATE
**CVSS Score:** 6.4

**Dependency Chain:** grocery-api → jsonwebtoken

**Summary:** jsonwebtoken vulnerable to signature validation bypass due to insecure default algorithm in jwt.verify()

**Details:** # Overview

In versions <=8.5.1 of jsonwebtoken library, lack of algorithm definition and a falsy secret or key in the `jwt.verify()` function can lead to signature validation bypass due to defaulting to the `none` algorithm for signature verification.

# Am I affected?
You will be affected if all the following are true in the `jwt.verify()` function:
- a token with no signature is received
- no algorithms are specified 
- a falsy (e.g. null, false, undefined) secret or key is passed 

# How do I fix it?
 
Update to version 9.0.0 which removes the default support for the none algorithm in the `jwt.verify()` method. 

# Will the fix impact my users?

There will be no impact, if you update to version 9.0.0 and you don’t need to allow for the `none` algorithm. If you need 'none' algorithm, you have to explicitly specify that in `jwt.verify()` options.

**Fixed In:** 9.0.0

**Recommended Fix:** `npm install jsonwebtoken@9.0.0`

**References:**
- https://github.com/auth0/node-jsonwebtoken/security/advisories/GHSA-qwph-4952-7xr6
- https://nvd.nist.gov/vuln/detail/CVE-2022-23540
- https://github.com/auth0/node-jsonwebtoken/commit/e1fa9dcc12054a8681db4e6373da1b30cf7016e3
- https://github.com/auth0/node-jsonwebtoken
- https://security.netapp.com/advisory/ntap-20240621-0007

---

#### Triage Assessment for jsonwebtoken

## Remediation Plan for jsonwebtoken

**Upgrade Decision:** Upgrade now

**Analysis:**
- Current version: 8.5.1 (in grocery-api/package.json)
- Target version: 9.0.0 or latest 9.x
- Breaking changes: Yes – v9 is a major release that enforces stricter key type/algorithm validation and removes default support for the 'none' algorithm. Code may need explicit algorithm options.
- Affected code: grocery-api/src/utils/auth.js uses jwt.sign() and jwt.verify() in production; verifyToken currently calls jwt.verify(token, secretKey) without specifying algorithms. verifyShareToken correctly restricts algorithms to ['HS256'].

**Recommendation:**
- Bump dependency: npm install jsonwebtoken@^9.0.0 in grocery-api
- Harden verification: Update verifyToken to specify allowed algorithms, e.g., jwt.verify(token, secretKey, { algorithms: ['HS256'] }) to match signing. Ensure we only use HS256 with a symmetric secret.
- Review any key retrieval or dynamic secret logic (none currently) to avoid misconfiguration.

**Testing Checklist:**
- [ ] Run existing test suite (grocery-api)
- [ ] Test authentication flows that generate and verify tokens
- [ ] Test shared list links (/lists/shared/:token)
- [ ] Verify tokens signed with HS256 continue to verify after upgrade
- [ ] Confirm that tokens with alg 'none' are rejected

---


### jws
**Vulnerable Package:** `jws`
**CVE Count:** 1

#### GHSA-869p-cjfg-cm3x
**Severity:** HIGH
**CVSS Score:** 7.5

**Dependency Chain:** grocery-api → jsonwebtoken → jws

**Summary:** auth0/node-jws Improperly Verifies HMAC Signature

**Details:** ### Overview
An improper signature verification vulnerability exists when using auth0/node-jws with the HS256 algorithm under specific conditions.

### Am I Affected?
You are affected by this vulnerability if you meet all of the following preconditions:

1. Application uses the auth0/node-jws implementation of JSON Web Signatures, versions <=3.2.2 || 4.0.0
2. Application uses the jws.createVerify() function for HMAC algorithms
3. Application uses user-provided data from the JSON Web Signature Protected Header or Payload in the HMAC secret lookup routines

You are NOT affected by this vulnerability if you meet any of the following preconditions:
1. Application uses the jws.verify() interface (note: `auth0/node-jsonwebtoken` users fall into this category and are therefore NOT affected by this vulnerability)
2. Application uses only asymmetric algorithms (e.g. RS256)
3. Application doesn’t use user-provided data from the JSON Web Signature Protected Header or Payload in the HMAC secret lookup routines

### Fix
Upgrade auth0/node-jws version to version 3.2.3 or 4.0.1

### Acknowledgement
Okta would like to thank Félix Charette for discovering this vulnerability.

**Fixed In:** 3.2.3, 4.0.1

**Direct Upgrade:** `npm install jws@3.2.3` (adds as direct dependency)

**Suggested Fix:** npm install jsonwebtoken@latest (upgrade parent - triage will determine best version)

**References:**
- https://github.com/auth0/node-jws/security/advisories/GHSA-869p-cjfg-cm3x
- https://nvd.nist.gov/vuln/detail/CVE-2025-65945
- https://github.com/auth0/node-jws/commit/34c45b2c04434f925b638de6a061de9339c0ea2e
- https://github.com/auth0/node-jws/commit/4f6e73f24df42f07d632dec6431ade8eda8d11a6
- https://github.com/auth0/node-jws
- ... and 2 more

---

#### Triage Assessment for jws

## Remediation Plan for jws

**Upgrade Decision:** Accept risk (not affected via jsonwebtoken)

**Analysis:**
- Current version: Transitively pulled by jsonwebtoken
- Affected API: jws.createVerify() for HMAC with user-influenced secret lookup
- Our usage: We do not call jws directly; we only use jsonwebtoken's jwt.sign/jwt.verify. The advisory explicitly states node-jsonwebtoken users are not affected when using jws.verify.

**Recommendation:**
- No direct action required for jws. Proceed with jsonwebtoken upgrade to v9 which will also bring safe transitive versions.

**Testing Checklist:**
- [ ] Basic auth flows still work after jsonwebtoken upgrade

---

