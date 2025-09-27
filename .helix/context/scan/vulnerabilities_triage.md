# Vulnerability Triage Reference

Generated: 2025-09-27T04:03:29Z
Tools Used: osv-scanner, npm-audit
Total Vulnerabilities: 25
Total Packages with Vulnerabilities: 10

## Triage Status Overview

| CVE/GHSA ID | Package | Scanned CVSS | Scanned Severity | Triage Status | Codebase Severity | Upgrade Impact |
|-------------|---------|--------------|------------------|---------------|-------------------|----------------|
| GHSA-p3vf-v8qc-cwcr | dompurify | 9.0 | Critical | pending | TBD | TBD |
| GHSA-gx9m-whjm-85jf | dompurify | 7.5 | High | pending | TBD | TBD |
| GHSA-mmhx-hmjr-r674 | dompurify | 7.5 | High | pending | TBD | TBD |
| GHSA-vhxf-7vqr-mrjg | dompurify | N/A | Medium | pending | TBD | TBD |
| GHSA-3jfq-g458-7qm9 | tar | 7.5 | High | pending | TBD | TBD |
| GHSA-r628-mhmh-qjhw | tar | 7.5 | High | pending | TBD | TBD |
| GHSA-9r2w-394v-53qc | tar | 7.5 | High | pending | TBD | TBD |
| GHSA-5955-9wpr-37jh | tar | 7.5 | High | pending | TBD | TBD |
| GHSA-qq89-hq3f-393p | tar | 7.5 | High | pending | TBD | TBD |
| GHSA-f5x3-32g6-xq36 | tar | N/A | Medium | pending | TBD | TBD |
| GHSA-5v2h-r2cx-5xgj | marked | 7.5 | High | pending | TBD | TBD |
| GHSA-rrrm-qjm4-v8hf | marked | 7.5 | High | pending | TBD | TBD |
| GHSA-p9wx-2529-fp83 | marked | N/A | Medium | pending | TBD | TBD |
| GHSA-qgmg-gppg-76g5 | validator | N/A | Medium | pending | TBD | TBD |
| GHSA-xx4c-jj58-r7x6 | validator | N/A | Medium | pending | TBD | TBD |
| GHSA-4hjh-wcwx-xvwj | axios | 7.5 | High | pending | TBD | TBD |
| GHSA-29mw-wpgm-hmr9 | lodash | N/A | Medium | pending | TBD | TBD |
| GHSA-35jh-r3h4-6jhm | lodash | 7.5 | High | pending | TBD | TBD |
| GHSA-g4jq-h2w9-997c | vite | 2.0 | Low | completed | Medium | safe_upgrade |
| GHSA-jqfw-vq24-v9c3 | vite | 2.0 | Low | completed | Medium | safe_upgrade |
| GHSA-qqgx-2p2h-9c37 | ini | 7.5 | High | pending | TBD | TBD |
| GHSA-8cf7-32gw-wr33 | jsonwebtoken | 7.5 | High | pending | TBD | TBD |
| GHSA-hjrf-2m68-5959 | jsonwebtoken | N/A | Medium | pending | TBD | TBD |
| GHSA-qwph-4952-7xr6 | jsonwebtoken | N/A | Medium | pending | TBD | TBD |
| GHSA-52f5-9888-hmc6 | tmp | 2.0 | Low | pending | TBD | TBD |

**Legend:**
- **Triage Status**: pending / in_progress / completed
- **Codebase Severity**: Risk level against our specific codebase (Critical/High/Medium/Low/None)
- **Upgrade Impact**: safe_upgrade / breaking_changes / no_fix

## Vulnerabilities by Package

### 1. dompurify (2.2.6)
**Package Type:** transitive
**Total Vulnerabilities:** 4

#### GHSA-p3vf-v8qc-cwcr
**Triage Status:** pending
**Severity:** critical
**CVSS Score:** 9.0
**Affected Version:** 2.2.6
**Fixed Version:** 2.4.2
**Dependency Type:** transitive
**Dependency Chain:** <2.4.2

##### Vulnerability Details
dompurify was vulnerable to prototype pollution

Fixed by https://github.com/cure53/DOMPurify/commit/d1dd0374caef2b4c56c3bd09fe1988c3479166dc

aliases: ["CVE-2024-48910"]

(database entries: severity CRITICAL, CWE-1321)

##### Potential Impact
Prototype pollution can enable tampering with internal object properties which may lead to security bypasses and XSS or logic manipulation. The advisory lists high impact to confidentiality and integrity where prototype pollution is exploited to subvert DOMPurify sanitization.

##### Triage Notes
_No triage performed yet_

---

#### GHSA-gx9m-whjm-85jf
**Triage Status:** pending
**Severity:** high
**CVSS Score:** 7.5
**Affected Version:** 2.2.6
**Fixed Version:** 3.1.3 (also 2.5.0 for 2.x branch)
**Dependency Type:** transitive
**Dependency Chain:** <2.5.0 (or <3.1.3 for 3.x)

##### Vulnerability Details
DOMpurify has a nesting-based mXSS. DOMpurify was vulnerable to nesting-based mXSS 

fixed by commits in repository (0ef5e537 ...) and related PRs. POC available in test-suite.

aliases: ["CVE-2024-47875"]

##### Potential Impact
Nesting-based mutation XSS (mXSS) may allow crafted HTML to bypass sanitization and result in persistent or reflected XSS depending on usage context. Impact includes possible arbitrary script execution in affected contexts and data exposure.

##### Triage Notes
_No triage performed yet_

---

#### GHSA-mmhx-hmjr-r674
**Triage Status:** pending
**Severity:** high
**CVSS Score:** 7.5
**Affected Version:** 2.2.6
**Fixed Version:** 3.1.3 (2.5.4 for 2.x branch)
**Dependency Type:** transitive
**Dependency Chain:** <2.5.4 (or <3.1.3 for 3.x)

##### Vulnerability Details
It has been discovered that malicious HTML using special nesting techniques can bypass the depth checking added to DOMPurify in recent releases. It was also possible to use Prototype Pollution to weaken the depth check.

This renders dompurify unable to avoid XSS attack.

Fixed by commits in 3.x and 2.x branches.

aliases: ["CVE-2024-45801"]

##### Potential Impact
Bypassing depth checks and prototype pollution can lead to DOMPurify failing to sanitize input, enabling XSS vulnerabilities in applications that rely on it, possibly leading to session theft, account takeover, or data exfiltration.

##### Triage Notes
_No triage performed yet_

---

#### GHSA-vhxf-7vqr-mrjg
**Triage Status:** pending
**Severity:** medium
**CVSS Score:** N/A
**Affected Version:** 2.2.6
**Fixed Version:** 3.2.4
**Dependency Type:** transitive
**Dependency Chain:** <3.2.4

##### Vulnerability Details
DOMPurify before 3.2.4 has an incorrect template literal regular expression when SAFE_FOR_TEMPLATES is set to true, sometimes leading to mutation cross-site scripting (mXSS).

aliases: ["CVE-2025-26791"]

##### Potential Impact
Incorrect template handling may permit mXSS where sanitized template literals are later evaluated or inserted into the DOM unsafely. This can result in script execution in the user's browser.

##### Triage Notes
_No triage performed yet_

---

### 2. tar (4.4.8)
**Package Type:** transitive
**Total Vulnerabilities:** 6

#### GHSA-3jfq-g458-7qm9
**Triage Status:** pending
**Severity:** high
**CVSS Score:** 7.5
**Affected Version:** 4.4.8
**Fixed Version:** 6.1.1 (also 4.4.14 for 4.x)
**Dependency Type:** transitive
**Dependency Chain:** >=4.0.0 <4.4.14

##### Vulnerability Details
Arbitrary File Creation/Overwrite due to insufficient absolute path sanitization. node-tar's logic for stripping absolute path roots was insufficient for repeated path roots (e.g., ////home/user/.bashrc), which could still resolve to absolute paths and allow arbitrary file creation/overwrite.

##### Potential Impact
An attacker supplying a crafted tar archive could create or overwrite files outside the intended extraction directory, potentially leading to code execution or data corruption.

##### Triage Notes
_No triage performed yet_

---

#### GHSA-r628-mhmh-qjhw
**Triage Status:** pending
**Severity:** high
**CVSS Score:** 7.5
**Affected Version:** 4.4.8
**Fixed Version:** 6.1.2 (also 4.4.15 for 4.x)
**Dependency Type:** transitive
**Dependency Chain:** >=4.0.0 <4.4.15

##### Vulnerability Details
Arbitrary File Creation/Overwrite via insufficient symlink protection due to directory cache poisoning. Sequence of directory creation and symlink replacement could bypass symlink checks and allow extraction into arbitrary locations.

##### Potential Impact
Allows crafted tar archives to write files to arbitrary filesystem locations, possibly enabling privilege escalation or remote code execution depending on extraction context.

##### Triage Notes
_No triage performed yet_

---

#### GHSA-9r2w-394v-53qc
**Triage Status:** pending
**Severity:** high
**CVSS Score:** 7.5
**Affected Version:** 4.4.8
**Fixed Version:** 6.1.7 (also 4.4.16 for 4.x)
**Dependency Type:** transitive
**Dependency Chain:** >=3.0.0 <4.4.16

##### Vulnerability Details
Arbitrary File Creation/Overwrite via insufficient symlink protection using path separators/backslashes or case-insensitive filesystem confusion. This could be used to bypass symlink protections.

##### Potential Impact
Similar to other tar symlink/dir cache issues: arbitrary file overwrite/creation and potential code execution when extracting untrusted archives.

##### Triage Notes
_No triage performed yet_

---

#### GHSA-5955-9wpr-37jh
**Triage Status:** pending
**Severity:** high
**CVSS Score:** 7.5
**Affected Version:** 4.4.8
**Fixed Version:** 6.1.9 (also 4.4.18 for 4.x)
**Dependency Type:** transitive
**Dependency Chain:** <4.4.18

##### Vulnerability Details
Arbitrary File Creation/Overwrite on Windows via insufficient relative path sanitization. Paths like C:some\path or C:../foo could resolve outside extraction target, allowing write outside target on Windows.

##### Potential Impact
On Windows systems, extraction of crafted tar archives may write files to unintended locations, enabling code execution or data corruption.

##### Triage Notes
_No triage performed yet_

---

#### GHSA-qq89-hq3f-393p
**Triage Status:** pending
**Severity:** high
**CVSS Score:** 7.5
**Affected Version:** 4.4.8
**Fixed Version:** 6.1.9 (also 4.4.18)
**Dependency Type:** transitive
**Dependency Chain:** >=3.0.0 <4.4.18

##### Vulnerability Details
Arbitrary File Creation/Overwrite via symlink protection bypass using unicode normalization/Windows short paths, allowing directory cache poisoning and subsequent arbitrary extraction.

##### Potential Impact
Arbitrary file write/overwrite and potential code execution when extracting untrusted tar archives.

##### Triage Notes
_No triage performed yet_

---

#### GHSA-f5x3-32g6-xq36
**Triage Status:** pending
**Severity:** medium
**CVSS Score:** N/A
**Affected Version:** 4.4.8
**Fixed Version:** 6.2.1
**Dependency Type:** transitive
**Dependency Chain:** <6.2.1

##### Vulnerability Details
Denial of service while parsing a tar file due to lack of folders count validation. Creating extremely deep folder structures during extraction can consume CPU/memory and crash the node process.

##### Potential Impact
Resource exhaustion (CPU/memory) leading to DoS when extracting specially crafted tar archives.

##### Triage Notes
_No triage performed yet_

---

### 3. marked (0.3.9)
**Package Type:** transitive
**Total Vulnerabilities:** 3

#### GHSA-5v2h-r2cx-5xgj
**Triage Status:** pending
**Severity:** high
**CVSS Score:** 7.5
**Affected Version:** 0.3.9
**Fixed Version:** 4.0.10
**Dependency Type:** transitive
**Dependency Chain:** <4.0.10

##### Vulnerability Details
Inefficient Regular Expression Complexity in marked. The `inline.reflinkSearch` regex may cause catastrophic backtracking leading to ReDoS. PoC provided in advisory.

aliases: ["CVE-2022-21681"]

##### Potential Impact
Denial of Service when parsing untrusted markdown that triggers catastrophic regex backtracking.

##### Triage Notes
_No triage performed yet_

---

#### GHSA-rrrm-qjm4-v8hf
**Triage Status:** pending
**Severity:** high
**CVSS Score:** 7.5
**Affected Version:** 0.3.9
**Fixed Version:** 4.0.10
**Dependency Type:** transitive
**Dependency Chain:** <4.0.10

##### Vulnerability Details
Inefficient Regular Expression Complexity in marked. The `block.def` regex may cause catastrophic backtracking for crafted inputs. PoC included.

aliases: ["CVE-2022-21680"]

##### Potential Impact
Denial of Service for services parsing untrusted markdown.

##### Triage Notes
_No triage performed yet_

---

#### GHSA-p9wx-2529-fp83
**Triage Status:** pending
**Severity:** medium
**CVSS Score:** N/A
**Affected Version:** 0.3.9
**Fixed Version:** 0.3.17
**Dependency Type:** transitive
**Dependency Chain:** <0.3.17

##### Vulnerability Details
Marked allows Regular Expression Denial of Service (ReDoS) due to catastrophic backtracking in several regular expressions used for parsing HTML tags and markdown links. Attacker can craft markdown input with deeply nested/repetitive brackets or tag attributes to hang the parser.

aliases: ["CVE-2018-25110"]

##### Potential Impact
Denial of Service when parsing malicious markdown input.

##### Triage Notes
_No triage performed yet_

---

### 4. validator (13.5.2)
**Package Type:** transitive
**Total Vulnerabilities:** 2

#### GHSA-qgmg-gppg-76g5
**Triage Status:** pending
**Severity:** medium
**CVSS Score:** N/A
**Affected Version:** 13.5.2
**Fixed Version:** 13.7.0
**Dependency Type:** transitive
**Dependency Chain:** <13.7.0

##### Vulnerability Details
Inefficient Regular Expression Complexity in validator.js — versions prior to 13.7.0 are vulnerable to inefficient regex complexity (ReDoS) in certain sanitizers.

aliases: ["CVE-2021-3765"]

##### Potential Impact
Potential Denial of Service when validating untrusted input using affected validators.

##### Triage Notes
_No triage performed yet_

---

#### GHSA-xx4c-jj58-r7x6
**Triage Status:** pending
**Severity:** medium
**CVSS Score:** N/A
**Affected Version:** 13.5.2
**Fixed Version:** 13.7.0
**Dependency Type:** transitive
**Dependency Chain:** >=11.1.0 <13.7.0

##### Vulnerability Details
Inefficient Regular Expression Complexity in Validator.js affecting `rtrim` and `trim` sanitizers prior to 13.7.0. Problem patched in 13.7.0.

##### Potential Impact
Denial of Service by supplying crafted inputs that trigger catastrophic regex backtracking.

##### Triage Notes
_No triage performed yet_

---

### 5. axios (1.10.0)
**Package Type:** transitive
**Total Vulnerabilities:** 1

#### GHSA-4hjh-wcwx-xvwj
**Triage Status:** pending
**Severity:** high
**CVSS Score:** 7.5
**Affected Version:** 1.10.0
**Fixed Version:** 1.12.0
**Dependency Type:** transitive
**Dependency Chain:** <1.12.0

##### Vulnerability Details
Axios is vulnerable to DoS when given a `data:` URL scheme: the Node adapter decodes the entire payload into memory and returns a synthetic 200 response, ignoring maxContentLength/maxBodyLength protections. An attacker can supply a very large data: URI to cause unbounded memory allocation.

aliases: ["CVE-2025-58754"]

##### Potential Impact
Process memory exhaustion leading to crash/DoS when Axios handles untrusted data: URIs in Node environments.

##### Triage Notes
_No triage performed yet_

---

### 6. lodash (4.17.19)
**Package Type:** transitive
**Total Vulnerabilities:** 2

#### GHSA-29mw-wpgm-hmr9
**Triage Status:** pending
**Severity:** medium
**CVSS Score:** N/A
**Affected Version:** 4.17.19
**Fixed Version:** 4.17.21
**Dependency Type:** transitive
**Dependency Chain:** <4.17.21

##### Vulnerability Details
Regular Expression Denial of Service (ReDoS) in lodash prior to 4.17.21 via `toNumber`, `trim`, and `trimEnd` functions. PoC provided.

aliases: ["CVE-2020-28500"]

##### Potential Impact
Denial of Service when processing crafted inputs through affected lodash functions.

##### Triage Notes
_No triage performed yet_

---

#### GHSA-35jh-r3h4-6jhm
**Triage Status:** pending
**Severity:** high
**CVSS Score:** 7.5
**Affected Version:** 4.17.19
**Fixed Version:** 4.17.21
**Dependency Type:** transitive
**Dependency Chain:** <4.17.21

##### Vulnerability Details
Command Injection in lodash's `template` function prior to 4.17.21. Templates could allow command injection via untrusted input in certain configurations.

aliases: ["CVE-2021-23337"]

##### Potential Impact
Potential command injection leading to arbitrary code execution if untrusted templates are executed in vulnerable contexts.

##### Triage Notes
_No triage performed yet_

---

### 7. vite (7.0.5)
**Package Type:** transitive
**Total Vulnerabilities:** 2

#### GHSA-g4jq-h2w9-997c
**Triage Status:** in_progress
**Severity:** low
**CVSS Score:** 2.0
**Affected Version:** 7.0.5
**Fixed Version:** 7.1.5
**Dependency Type:** transitive
**Dependency Chain:** >=7.0.0 <=7.0.6

##### Vulnerability Details
Vite middleware may serve files starting with the same name with the public directory, bypassing server.fs settings when symlinks exist in public directory. Affects apps exposing dev server to network and using public directory.

aliases: ["CVE-2025-58751"]

##### Potential Impact
Possible information disclosure or serving unintended files in development/preview server scenarios when conditions are met.

##### Triage Notes
_Codebase Severity: Medium — vite is used as a devDependency and the dev server in grocery-web is configured to bind to 0.0.0.0, making dev-server file-serving issues exploitable when dev/preview servers are accessible. Affected version: 7.0.5; fixed in 7.1.5. Recommendation: restrict dev server binding to localhost and upgrade to 7.1.5 where 7.x is used. Verify resolved versions across workspaces before upgrading._

##### Triage History
- 2025-09-27T12:00:00Z — triage_analyzer (execution node) started triage
- 2025-09-27T12:12:00Z — human review completed: Codebase Severity set to Medium, Upgrade Impact set to safe_upgrade, recommendations added
---

#### GHSA-jqfw-vq24-v9c3
**Triage Status:** in_progress
**Severity:** low
**CVSS Score:** 2.0
**Affected Version:** 7.0.5
**Fixed Version:** 7.1.5
**Dependency Type:** transitive
**Dependency Chain:** >=7.0.0 <=7.0.6

##### Vulnerability Details
Vite's `server.fs` settings were not applied to HTML files, allowing HTML files on the machine to be served regardless of `server.fs` when dev server is exposed.

aliases: ["CVE-2025-58752"]

##### Potential Impact
Serving of unintended HTML files in dev/preview server contexts leading to information disclosure or exposure of local files.

##### Triage Notes
_Codebase Severity: Medium — vite is used as a devDependency and the dev server in grocery-web is configured to bind to 0.0.0.0, increasing exploitability for dev-server HTML serving issues. Affected version: 7.0.5; fixed in 7.1.5. Recommendation: restrict dev server binding to localhost and upgrade to 7.1.5 where applicable. Verify workspace installations before changing lockfiles._

---

### 8. ini (1.3.5)
**Package Type:** transitive
**Total Vulnerabilities:** 1

#### GHSA-qqgx-2p2h-9c37
**Triage Status:** pending
**Severity:** high
**CVSS Score:** 7.5
**Affected Version:** 1.3.5
**Fixed Version:** 1.3.6
**Dependency Type:** transitive
**Dependency Chain:** <1.3.6

##### Vulnerability Details
ini before 1.3.6 vulnerable to Prototype Pollution via ini.parse. Malicious INI content can set __proto__ properties leading to prototype pollution.

aliases: ["CVE-2020-7788"]

##### Potential Impact
Prototype pollution may enable downstream attacks depending on application context, including privilege escalation or logic bypass.

##### Triage Notes
_No triage performed yet_

---

### 9. jsonwebtoken (8.5.1)
**Package Type:** transitive
**Total Vulnerabilities:** 3

#### GHSA-8cf7-32gw-wr33
**Triage Status:** pending
**Severity:** high
**CVSS Score:** 7.5
**Affected Version:** 8.5.1
**Fixed Version:** 9.0.0
**Dependency Type:** transitive
**Dependency Chain:** <=8.5.1

##### Vulnerability Details
jsonwebtoken could allow unrestricted key types leading to legacy/insecure key types being used for signature verification (e.g., DSA used with RS256). Fixed in 9.0.0 which validates asymmetric key type and algorithm combinations.

aliases: ["CVE-2022-23539"]

##### Potential Impact
If misconfigured, attackers could use incompatible key types to forge or bypass JWT signature verification leading to authentication bypass or privilege escalation.

##### Triage Notes
_No triage performed yet_

---

#### GHSA-hjrf-2m68-5959
**Triage Status:** pending
**Severity:** medium
**CVSS Score:** N/A
**Affected Version:** 8.5.1
**Fixed Version:** 9.0.0
**Dependency Type:** transitive
**Dependency Chain:** <=8.5.1

##### Vulnerability Details
Insecure implementation of key retrieval function could allow verification of tokens with a different algorithm/key combination than used to sign them (e.g., RSA to HMAC), enabling forgery in some usage patterns.

aliases: ["CVE-2022-23541"]

##### Potential Impact
Forgeable tokens and authentication bypass in systems that use a shared key retrieval function for multiple algorithms or misconfigured verification.

##### Triage Notes
_No triage performed yet_

---

#### GHSA-qwph-4952-7xr6
**Triage Status:** pending
**Severity:** medium
**CVSS Score:** N/A
**Affected Version:** 8.5.1
**Fixed Version:** 9.0.0
**Dependency Type:** transitive
**Dependency Chain:** <9.0.0

##### Vulnerability Details
Signature validation bypass due to insecure default algorithm in jwt.verify() when algorithms are not specified and a falsy secret/key is passed — could default to `none` algorithm.

aliases: ["CVE-2022-23540"]

##### Potential Impact
Potential bypass of signature verification enabling forged tokens to be accepted when conditions are met.

##### Triage Notes
_No triage performed yet_

---

### 10. tmp (0.0.33)
**Package Type:** transitive
**Total Vulnerabilities:** 1

#### GHSA-52f5-9888-hmc6
**Triage Status:** pending
**Severity:** low
**CVSS Score:** 2.0
**Affected Version:** 0.0.33
**Fixed Version:** 0.2.4
**Dependency Type:** transitive
**Dependency Chain:** <=0.2.3

##### Vulnerability Details
tmp@0.2.3 vulnerable to arbitrary temporary file/directory write via symbolic link `dir` parameter. `_resolvePath` does not properly handle symlinks, enabling bypass of relative-path checks.

aliases: ["CVE-2025-54798"]

##### Potential Impact
An attacker controlling the `dir` parameter or symlink targets may cause temporary files/directories to be created outside intended tmp directory, possibly enabling local file write attacks.

##### Triage Notes
_No triage performed yet_

---

## Triage History
<!-- Triage agent will append entries here -->
_No triage history yet_
