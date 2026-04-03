# jsonwebtoken - Vulnerability Details

**Package to Upgrade:** `jsonwebtoken`

**Total Vulnerabilities:** 4

**Severity Breakdown:** 0 Critical, 2 High, 2 Medium, 0 Low

## Affected Lockfiles

- `./grocery-api/package-lock.json`

## Summary

This is a direct dependency. Upgrade `jsonwebtoken` directly in package.json.

## Vulnerabilities

### jsonwebtoken

**Vulnerable Package:** `jsonwebtoken`

**CVE Count:** 3

#### GHSA-8cf7-32gw-wr33

**Severity:** HIGH

**CVSS Score:** 9.0

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

---

#### GHSA-hjrf-2m68-5959

**Severity:** MEDIUM

**CVSS Score:** 7.5

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

---

#### GHSA-qwph-4952-7xr6

**Severity:** MEDIUM

**CVSS Score:** 9.0

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

**Suggested Fix:** npm install jsonwebtoken@latest (upgrade parent)

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

