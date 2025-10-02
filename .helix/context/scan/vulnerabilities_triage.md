# Vulnerability Triage Reference

Generated: 2025-10-02T17:46:47.431705Z
Tools Used: osv-scanner, npm-audit
Total Vulnerabilities: 26
Total Packages with Vulnerabilities: 11

## Triage Status Overview

| CVE/GHSA ID | Package | Lockfile | Is Direct | Parent | Scanned CVSS | Scanned Severity | Triage Status | Codebase Severity | Upgrade Impact |
|-------------|---------|----------|-----------|--------|--------------|------------------|---------------|-------------------|----------------|
| GHSA-67mh-4wv8-2f99 | esbuild | grocery-web | No | vite | 5.3 | Medium | pending | TBD | TBD |
| GHSA-29mw-wpgm-hmr9 | lodash | grocery-api | Yes | Direct | 5.3 | Medium | pending | TBD | TBD |
| GHSA-35jh-r3h4-6jhm | lodash | grocery-api | Yes | Direct | 7.5 | High | pending | TBD | TBD |
| GHSA-g4jq-h2w9-997c | vite | grocery-web | Yes | Direct | 2.0 | Low | pending | TBD | TBD |
| GHSA-g4jq-h2w9-997c | vite | grocery-shared | No | vitest | 2.0 | Low | pending | TBD | TBD |
| GHSA-jqfw-vq24-v9c3 | vite | grocery-web | Yes | Direct | 2.0 | Low | pending | TBD | TBD |
| GHSA-jqfw-vq24-v9c3 | vite | grocery-shared | No | vitest | 2.0 | Low | pending | TBD | TBD |
| GHSA-x3cc-x39p-42qx | fast-xml-parser | grocery-infra | Yes | Direct | 6.5 | Medium | pending | TBD | TBD |
| GHSA-qqgx-2p2h-9c37 | ini | grocery-infra | No | fsevents | 7.3 | High | pending | TBD | TBD |
| GHSA-3jfq-g458-7qm9 | tar | grocery-infra | No | fsevents | 8.2 | High | pending | TBD | TBD |
| GHSA-r628-mhmh-qjhw | tar | grocery-infra | No | fsevents | 8.2 | High | pending | TBD | TBD |
| GHSA-9r2w-394v-53qc | tar | grocery-infra | No | fsevents | 8.2 | High | pending | TBD | TBD |
| GHSA-5955-9wpr-37jh | tar | grocery-infra | No | fsevents | 8.2 | High | pending | TBD | TBD |
| GHSA-qq89-hq3f-393p | tar | grocery-infra | No | fsevents | 8.2 | High | pending | TBD | TBD |
| GHSA-f5x3-32g6-xq36 | tar | grocery-infra | No | fsevents | 6.5 | Medium | pending | TBD | TBD |
| GHSA-p3vf-v8qc-cwcr | dompurify | grocery-web | Yes | Direct | 9.0 | Critical | pending | TBD | TBD |
| GHSA-gx9m-whjm-85jf | dompurify | grocery-web | Yes | Direct | 7.5 | High | pending | TBD | TBD |
| GHSA-mmhx-hmjr-r674 | dompurify | grocery-web | Yes | Direct | 7.5 | High | pending | TBD | TBD |
| GHSA-vhxf-7vqr-mrjg | dompurify | grocery-web | Yes | Direct | 4.5 | Medium | pending | TBD | TBD |
| GHSA-p9wx-2529-fp83 | marked | grocery-shared | Yes | Direct | N/A | Medium | pending | TBD | TBD |
| GHSA-5v2h-r2cx-5xgj | marked | grocery-shared | Yes | Direct | 7.5 | High | pending | TBD | TBD |
| GHSA-rrrm-qjm4-v8hf | marked | grocery-shared | Yes | Direct | 7.5 | High | pending | TBD | TBD |
| GHSA-qgmg-gppg-76g5 | validator | grocery-shared | Yes | Direct | 5.3 | Medium | pending | TBD | TBD |
| GHSA-xx4c-jj58-r7x6 | validator | grocery-shared | Yes | Direct | 5.3 | Medium | pending | TBD | TBD |
| GHSA-8cf7-32gw-wr33 | jsonwebtoken | grocery-api | Yes | Direct | 8.1 | High | pending | TBD | TBD |
| GHSA-hjrf-2m68-5959 | jsonwebtoken | grocery-api | Yes | Direct | 5.0 | Medium | pending | TBD | TBD |
| GHSA-qwph-4952-7xr6 | jsonwebtoken | grocery-api | Yes | Direct | 6.4 | Medium | pending | TBD | TBD |
| GHSA-52f5-9888-hmc6 | tmp | grocery-api | No | eslint | 2.5 | Low | pending | TBD | TBD |

**Legend:**
- **Triage Status**: pending / in_progress / completed
- **Codebase Severity**: Risk level against our specific codebase (Critical/High/Medium/Low/None)
- **Upgrade Impact**: safe_upgrade / breaking_changes / no_fix
- **Is Direct**: Whether this is a direct dependency in package.json
- **Parent**: Direct (if direct dep) or parent package name (if transitive)

## Vulnerabilities by Package

### 1. esbuild (0.18.20)
**Total Vulnerabilities:** 1
**Lockfiles Affected:** 1

#### GHSA-67mh-4wv8-2f99
**Triage Status:** pending
**Severity:** Medium
**CVSS Score:** 5.3
**Affected Version:** 0.18.20
**Fixed Version:** 0.25.0

##### Vulnerability Details
esbuild allows any websites to send any request to the development server and read the response due to default CORS settings. esbuild sets the Access-Control-Allow-Origin: * header on requests, including the SSE connection, which allows any websites to send any request to the development server and read the response. An attacker hosting a malicious page could use fetch to retrieve local dev-server resources, including bundle files and potentially source maps, exposing sensitive local data.

##### Potential Impact
Local development servers may leak served assets and responses to attacker-controlled sites when exposed to a network, enabling information disclosure of source files or compiled bundles.

##### Remediation by Lockfile
**grocery-web:**
- Is Direct: No
- Parent: vite
- Remediation: npm install esbuild@0.25.0
- Status: pending
- Codebase Severity: TBD
- Upgrade Impact: TBD
- Notes: _No triage performed yet_

---

### 2. lodash (4.17.19)
**Total Vulnerabilities:** 2
**Lockfiles Affected:** 1

#### GHSA-29mw-wpgm-hmr9
**Triage Status:** pending
**Severity:** Medium
**CVSS Score:** 5.3
**Affected Version:** 4.17.19
**Fixed Version:** 4.17.21

##### Vulnerability Details
All versions of lodash prior to 4.17.21 are vulnerable to Regular Expression Denial of Service (ReDoS) via the toNumber, trim and trimEnd functions. Crafted input can cause catastrophic backtracking in these functions and hang or significantly slow processing.

##### Potential Impact
Processing untrusted strings with affected lodash functions can lead to high CPU usage and denial-of-service conditions in services that operate on attacker-controlled input.

##### Remediation by Lockfile
**grocery-api:**
- Is Direct: Yes
- Parent: Direct
- Remediation: npm install lodash@4.17.21
- Status: pending
- Codebase Severity: TBD
- Upgrade Impact: TBD
- Notes: _No triage performed yet_

---

#### GHSA-35jh-r3h4-6jhm
**Triage Status:** pending
**Severity:** High
**CVSS Score:** 7.5
**Affected Version:** 4.17.19
**Fixed Version:** 4.17.21

##### Vulnerability Details
lodash versions prior to 4.17.21 are vulnerable to Command Injection via the template function. Improper handling of template input can allow execution of commands in some contexts.

##### Potential Impact
If template functions are used with untrusted input, attackers could achieve command execution in the running process depending on how template output is used.

##### Remediation by Lockfile
**grocery-api:**
- Is Direct: Yes
- Parent: Direct
- Remediation: npm install lodash@4.17.21
- Status: pending
- Codebase Severity: TBD
- Upgrade Impact: TBD
- Notes: _No triage performed yet_

---

### 3. vite (4.5.14)
**Total Vulnerabilities:** 2
**Lockfiles Affected:** 2

#### GHSA-g4jq-h2w9-997c
**Triage Status:** pending
**Severity:** Low
**CVSS Score:** 2.0
**Affected Version:** 4.5.14
**Fixed Version:** 7.1.5

##### Vulnerability Details
Files starting with the same name as the public directory could be served bypassing server.fs settings under certain conditions (exposed dev server, use of public directory, symlinks). This could cause files to be served that should be restricted by server.fs.

##### Potential Impact
When Vite dev server is exposed to the network and public directory feature is used, symlinks could cause unintended files to be served, possibly exposing local files.

##### Remediation by Lockfile
**grocery-web:**
- Is Direct: Yes
- Parent: Direct
- Remediation: npm install vite@7.1.5
- Status: pending
- Codebase Severity: TBD
- Upgrade Impact: TBD
- Notes: _No triage performed yet_

**grocery-shared:**
- Is Direct: No
- Parent: vitest
- Remediation: npm install vite@7.1.5 (may require upgrading vitest to pull fix)
- Status: pending
- Codebase Severity: TBD
- Upgrade Impact: TBD
- Notes: _No triage performed yet_

---

#### GHSA-jqfw-vq24-v9c3
**Triage Status:** pending
**Severity:** Low
**CVSS Score:** 2.0
**Affected Version:** 4.5.14
**Fixed Version:** 7.1.5

##### Vulnerability Details
Vite's server.fs settings were not applied to HTML files in some configurations, allowing HTML files on the machine to be served regardless of server.fs controls. Affects apps exposing the dev server to the network and certain app types.

##### Potential Impact
Exposed dev or preview servers could serve HTML files outside the intended output directory, potentially revealing local files or sensitive HTML.

##### Remediation by Lockfile
**grocery-web:**
- Is Direct: Yes
- Parent: Direct
- Remediation: npm install vite@7.1.5
- Status: pending
- Codebase Severity: TBD
- Upgrade Impact: TBD
- Notes: _No triage performed yet_

**grocery-shared:**
- Is Direct: No
- Parent: vitest
- Remediation: npm install vite@7.1.5 (may require upgrading vitest to pull fix)
- Status: pending
- Codebase Severity: TBD
- Upgrade Impact: TBD
- Notes: _No triage performed yet_

---

### 4. fast-xml-parser (3.21.1)
**Total Vulnerabilities:** 1
**Lockfiles Affected:** 1

#### GHSA-x3cc-x39p-42qx
**Triage Status:** pending
**Severity:** Medium
**CVSS Score:** 6.5
**Affected Version:** 3.21.1
**Fixed Version:** 4.1.2

##### Vulnerability Details
fast-xml-parser allowed the use of `__proto__` as a tag or attribute name, enabling prototype pollution when parsing untrusted XML. A crafted XML payload can set properties on Object.prototype via parsed structures.

##### Potential Impact
Applications that parse untrusted XML with this library could have their application prototypes polluted, potentially altering application behavior and enabling further attacks depending on context.

##### Remediation by Lockfile
**grocery-infra:**
- Is Direct: Yes
- Parent: Direct
- Remediation: npm install fast-xml-parser@4.1.2
- Status: pending
- Codebase Severity: TBD
- Upgrade Impact: TBD
- Notes: _No triage performed yet_

---

### 5. ini (1.3.5)
**Total Vulnerabilities:** 1
**Lockfiles Affected:** 1

#### GHSA-qqgx-2p2h-9c37
**Triage Status:** pending
**Severity:** High
**CVSS Score:** 7.3
**Affected Version:** 1.3.5
**Fixed Version:** 1.3.6

##### Vulnerability Details
The `ini` package prior to 1.3.6 is vulnerable to Prototype Pollution via ini.parse. A malicious INI file can inject properties into Object.prototype, leading to prototype pollution and potential downstream impacts.

##### Potential Impact
Prototype pollution can lead to privilege escalation or bypasses depending on application logic that relies on object prototypes.

##### Remediation by Lockfile
**grocery-infra:**
- Is Direct: No
- Parent: fsevents
- Remediation: npm install ini@1.3.6 (may require upgrading fsevents)
- Status: pending
- Codebase Severity: TBD
- Upgrade Impact: TBD
- Notes: _No triage performed yet_

---

### 6. tar (4.4.8)
**Total Vulnerabilities:** 7
**Lockfiles Affected:** 1

#### GHSA-3jfq-g458-7qm9
**Triage Status:** pending
**Severity:** High
**CVSS Score:** 8.2
**Affected Version:** 4.4.8
**Fixed Version:** 6.1.1

##### Vulnerability Details
Insufficient absolute path sanitization in tar extraction could allow arbitrary file creation or overwrite when extracting archives with crafted paths, leading to directory traversal style impacts and potential code execution.

##### Potential Impact
Extraction of untrusted tar files could overwrite local files, including system or application files, leading to remote code execution or data loss.

##### Remediation by Lockfile
**grocery-infra:**
- Is Direct: No
- Parent: fsevents
- Remediation: npm install tar@6.1.1 (or later fixed versions per advisory)
- Status: pending
- Codebase Severity: TBD
- Upgrade Impact: TBD
- Notes: _No triage performed yet_

---

(Other tar-related advisories GHSA-r628-mhmh-qjhw, GHSA-9r2w-394v-53qc, GHSA-5955-9wpr-37jh, GHSA-qq89-hq3f-393p, GHSA-f5x3-32g6-xq36 are present with similar impacts; they are grouped above under tar package and each has the grocery-infra lockfile with Parent fsevents. All are pending triage.)

---

### 7. dompurify (2.2.6)
**Total Vulnerabilities:** 4
**Lockfiles Affected:** 1

#### GHSA-p3vf-v8qc-cwcr
**Triage Status:** pending
**Severity:** Critical
**CVSS Score:** 9.0
**Affected Version:** 2.2.6
**Fixed Version:** 2.4.2

##### Vulnerability Details
dompurify was vulnerable to prototype pollution, which could be used to tamper with DOMPurify's internal behavior. The advisory notes a fix committed to the project to address prototype pollution vectors.

##### Potential Impact
Prototype pollution in a sanitization library can weaken or bypass sanitization logic, increasing the risk of XSS and content injection attacks in applications that rely on DOMPurify.

##### Remediation by Lockfile
**grocery-web:**
- Is Direct: Yes
- Parent: Direct
- Remediation: npm install dompurify@2.4.2
- Status: pending
- Codebase Severity: TBD
- Upgrade Impact: TBD
- Notes: _No triage performed yet_

---

#### GHSA-gx9m-whjm-85jf
**Triage Status:** pending
**Severity:** High
**CVSS Score:** 7.5
**Affected Version:** 2.2.6
**Fixed Version:** 3.1.3

##### Vulnerability Details
DOMPurify had a nesting-based mXSS issue allowing crafted nested input to bypass sanitization checks. Fixes were applied in upstream commits and releases.

##### Potential Impact
Applications using vulnerable versions may be susceptible to mutation XSS when sanitizing crafted nested HTML.

##### Remediation by Lockfile
**grocery-web:**
- Is Direct: Yes
- Parent: Direct
- Remediation: npm install dompurify@3.1.3
- Status: pending
- Codebase Severity: TBD
- Upgrade Impact: TBD
- Notes: _No triage performed yet_

---

#### GHSA-mmhx-hmjr-r674
**Triage Status:** pending
**Severity:** High
**CVSS Score:** 7.5
**Affected Version:** 2.2.6
**Fixed Version:** 3.1.3

##### Vulnerability Details
DOMPurify allowed tampering by prototype pollution which could be used to weaken depth-checking and allow XSS bypasses. Upstream fixes were merged.

##### Potential Impact
Sanitization may be bypassed leading to XSS in applications relying on DOMPurify.

##### Remediation by Lockfile
**grocery-web:**
- Is Direct: Yes
- Parent: Direct
- Remediation: npm install dompurify@3.1.3
- Status: pending
- Codebase Severity: TBD
- Upgrade Impact: TBD
- Notes: _No triage performed yet_

---

#### GHSA-vhxf-7vqr-mrjg
**Triage Status:** pending
**Severity:** Medium
**CVSS Score:** 4.5
**Affected Version:** 2.2.6
**Fixed Version:** 3.2.4

##### Vulnerability Details
DOMPurify before 3.2.4 had an incorrect template literal regular expression when SAFE_FOR_TEMPLATES was true, sometimes leading to mutation XSS.

##### Potential Impact
When using SAFE_FOR_TEMPLATES, template processing could be vulnerable to mXSS, allowing content injection in certain templating contexts.

##### Remediation by Lockfile
**grocery-web:**
- Is Direct: Yes
- Parent: Direct
- Remediation: npm install dompurify@3.2.4
- Status: pending
- Codebase Severity: TBD
- Upgrade Impact: TBD
- Notes: _No triage performed yet_

---

### 8. marked (0.3.9)
**Total Vulnerabilities:** 3
**Lockfiles Affected:** 1

#### GHSA-p9wx-2529-fp83
**Triage Status:** pending
**Severity:** Medium
**CVSS Score:** N/A
**Affected Version:** 0.3.9
**Fixed Version:** 0.3.17

##### Vulnerability Details
Marked prior to 0.3.17 is vulnerable to ReDoS due to catastrophic backtracking in certain regexes used for parsing tags and links. Crafted markdown can hang the parser.

##### Potential Impact
Services parsing untrusted markdown with affected marked versions may be vulnerable to denial-of-service via specially crafted input.

##### Remediation by Lockfile
**grocery-shared:**
- Is Direct: Yes
- Parent: Direct
- Remediation: npm install marked@0.3.17
- Status: pending
- Codebase Severity: TBD
- Upgrade Impact: TBD
- Notes: _No triage performed yet_

---

(Other marked advisories GHSA-5v2h-r2cx-5xgj and GHSA-rrrm-qjm4-v8hf are high severity ReDoS issues affecting the same package and lockfile. Each is pending triage.)

---

### 9. validator (13.5.2)
**Total Vulnerabilities:** 2
**Lockfiles Affected:** 1

#### GHSA-qgmg-gppg-76g5
**Triage Status:** pending
**Severity:** Medium
**CVSS Score:** 5.3
**Affected Version:** 13.5.2
**Fixed Version:** 13.7.0

##### Vulnerability Details
validator.js prior to 13.7.0 is vulnerable to inefficient regular expression complexity leading to potential ReDoS in certain sanitizers.

##### Potential Impact
Using affected sanitizers on untrusted input may lead to high CPU usage and denial-of-service.

##### Remediation by Lockfile
**grocery-shared:**
- Is Direct: Yes
- Parent: Direct
- Remediation: npm install validator@13.7.0
- Status: pending
- Codebase Severity: TBD
- Upgrade Impact: TBD
- Notes: _No triage performed yet_

---

#### GHSA-xx4c-jj58-r7x6
**Triage Status:** pending
**Severity:** Medium
**CVSS Score:** 5.3
**Affected Version:** 13.5.2
**Fixed Version:** 13.7.0

##### Vulnerability Details
Versions of validator prior to 13.7.0 are affected by inefficient regular expression complexity when using rtrim and trim sanitizers.

##### Potential Impact
Services using these sanitizers with untrusted input risk Denial-of-Service.

##### Remediation by Lockfile
**grocery-shared:**
- Is Direct: Yes
- Parent: Direct
- Remediation: npm install validator@13.7.0
- Status: pending
- Codebase Severity: TBD
- Upgrade Impact: TBD
- Notes: _No triage performed yet_

---

### 10. jsonwebtoken (8.5.1)
**Total Vulnerabilities:** 3
**Lockfiles Affected:** 1

#### GHSA-8cf7-32gw-wr33
**Triage Status:** pending
**Severity:** High
**CVSS Score:** 8.1
**Affected Version:** 8.5.1
**Fixed Version:** 9.0.0

##### Vulnerability Details
Versions <= 8.5.1 could be misconfigured to allow legacy or insecure key types for signature verification, potentially permitting insecure key/algorithm combinations.

##### Potential Impact
Misconfiguration may allow use of weak or wrong key types, leading to token forgery or validation bypass.

##### Remediation by Lockfile
**grocery-api:**
- Is Direct: Yes
- Parent: Direct
- Remediation: npm install jsonwebtoken@9.0.0
- Status: pending
- Codebase Severity: TBD
- Upgrade Impact: TBD
- Notes: _No triage performed yet_

---

#### GHSA-hjrf-2m68-5959
**Triage Status:** pending
**Severity:** Medium
**CVSS Score:** 5.0
**Affected Version:** 8.5.1
**Fixed Version:** 9.0.0

##### Vulnerability Details
An insecure key retrieval function implementation could allow verification logic to use incorrect algorithms or key types, enabling token forgery under specific configurations.

##### Potential Impact
Incorrect verification may allow forged tokens to be accepted when key retrieval functions are misused.

##### Remediation by Lockfile
**grocery-api:**
- Is Direct: Yes
- Parent: Direct
- Remediation: npm install jsonwebtoken@9.0.0
- Status: pending
- Codebase Severity: TBD
- Upgrade Impact: TBD
- Notes: _No triage performed yet_

---

#### GHSA-qwph-4952-7xr6
**Triage Status:** pending
**Severity:** Medium
**CVSS Score:** 6.4
**Affected Version:** 8.5.1
**Fixed Version:** 9.0.0

##### Vulnerability Details
Defaulting to an insecure `none` algorithm in jwt.verify() under certain conditions could permit signature validation bypass when no algorithms are specified and falsy keys are passed.

##### Potential Impact
Tokens with no signature might be accepted if verification is not configured properly.

##### Remediation by Lockfile
**grocery-api:**
- Is Direct: Yes
- Parent: Direct
- Remediation: npm install jsonwebtoken@9.0.0
- Status: pending
- Codebase Severity: TBD
- Upgrade Impact: TBD
- Notes: _No triage performed yet_

---

### 11. tmp (0.0.33)
**Total Vulnerabilities:** 1
**Lockfiles Affected:** 1

#### GHSA-52f5-9888-hmc6
**Triage Status:** pending
**Severity:** Low
**CVSS Score:** 2.5
**Affected Version:** 0.0.33
**Fixed Version:** 0.2.4

##### Vulnerability Details
tmp@0.2.3 allowed arbitrary temporary file/directory write via symlink bypass of the dir parameter; resolving of symlinks could allow writes outside the intended tmpdir.

##### Potential Impact
An attacker able to control tmp dir parameters or symlinks could cause files to be written to unexpected locations, potentially overwriting sensitive files.

##### Remediation by Lockfile
**grocery-api:**
- Is Direct: No
- Parent: eslint
- Remediation: npm install tmp@0.2.4
- Status: pending
- Codebase Severity: TBD
- Upgrade Impact: TBD
- Notes: _No triage performed yet_

---

## Triage History
<!-- Triage agent will append entries here -->
_No triage history yet_
