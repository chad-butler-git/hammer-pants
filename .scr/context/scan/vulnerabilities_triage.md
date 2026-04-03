# Vulnerability Triage Reference

Generated: 2026-04-03

Tools Used: osv-scanner, lockfile-parser

Total Vulnerabilities: 100

Total Packages with Vulnerabilities: 23

## Triage Status Overview

| CVE/GHSA ID | Package | Lockfile | Dependency Chain | Upgradeable Package | Scanned CVSS | Scanned Severity | Triage Status | Codebase Severity | Upgrade Impact | Remediation Status |
|-------------|---------|----------|------------------|---------------------|--------------|------------------|---------------|-------------------|----------------|-------------------|
| GHSA-2g4f-4pwh-qvx6 | ajv | grocery-api/package-lock.json | eslint → ajv | eslint | 5.0 | MEDIUM | pending | TBD | TBD | pending |
| GHSA-f886-m6hf-6m8v | brace-expansion | grocery-api/package-lock.json | eslint → minimatch → brace-expansion | eslint | 7.5 | MEDIUM | completed | None | safe_upgrade | pending |
| GHSA-25h7-pfq9-p65f | flatted | grocery-api/package-lock.json | eslint → file-entry-cache → flat-cache → flatted | eslint | 7.5 | HIGH | pending | TBD | TBD | pending |
| GHSA-rf6f-7fwh-wjgh | flatted | grocery-api/package-lock.json | eslint → file-entry-cache → flat-cache → flatted | eslint | 9.0 | HIGH | pending | TBD | TBD | pending |
| GHSA-mh29-5h37-fv8m | js-yaml | grocery-api/package-lock.json | eslint → js-yaml | eslint | 5.0 | MEDIUM | pending | TBD | TBD | pending |
| GHSA-8cf7-32gw-wr33 | jsonwebtoken | grocery-api/package-lock.json | Direct | jsonwebtoken | 9.0 | HIGH | pending | TBD | TBD | pending |
| GHSA-hjrf-2m68-5959 | jsonwebtoken | grocery-api/package-lock.json | Direct | jsonwebtoken | 7.5 | MEDIUM | pending | TBD | TBD | pending |
| GHSA-qwph-4952-7xr6 | jsonwebtoken | grocery-api/package-lock.json | Direct | jsonwebtoken | 9.0 | MEDIUM | pending | TBD | TBD | pending |
| GHSA-869p-cjfg-cm3x | jws | grocery-api/package-lock.json | jsonwebtoken → jws | jsonwebtoken | 7.5 | HIGH | pending | TBD | TBD | pending |
| GHSA-29mw-wpgm-hmr9 | lodash | grocery-api/package-lock.json | Direct | lodash | 5.0 | MEDIUM | completed | None | safe_upgrade | pending |
| GHSA-35jh-r3h4-6jhm | lodash | grocery-api/package-lock.json | Direct | lodash | 9.0 | HIGH | completed | None | safe_upgrade | pending |
| GHSA-f23m-r3pf-42rh | lodash | grocery-api/package-lock.json | Direct | lodash | 5.0 | MEDIUM | completed | Low | safe_upgrade | pending |
| GHSA-r5fr-rjxr-66jc | lodash | grocery-api/package-lock.json | Direct | lodash | 9.0 | HIGH | completed | Low | safe_upgrade | pending |
| GHSA-xxjr-mmjv-4gpg | lodash | grocery-api/package-lock.json | Direct | lodash | 5.0 | MEDIUM | completed | Low | safe_upgrade | pending |
| GHSA-23c5-xmqv-rm74 | minimatch | grocery-api/package-lock.json | eslint → minimatch | eslint | 7.5 | HIGH | completed | Low | safe_upgrade | pending |
| GHSA-3ppc-4f35-3m26 | minimatch | grocery-api/package-lock.json | eslint → minimatch | eslint | 7.5 | HIGH | completed | Low | safe_upgrade | pending |
| GHSA-7r86-cg39-jmmj | minimatch | grocery-api/package-lock.json | eslint → minimatch | eslint | 7.5 | HIGH | completed | Low | safe_upgrade | pending |
| GHSA-37ch-88jc-xwx2 | path-to-regexp | grocery-api/package-lock.json | express → path-to-regexp | express | 7.5 | HIGH | pending | TBD | TBD | pending |
| GHSA-3v7f-55p6-f55p | picomatch | grocery-api/package-lock.json | jest → @jest/core → micromatch → picomatch | jest | 5.0 | MEDIUM | pending | TBD | TBD | pending |
| GHSA-c2c7-rcm5-vvqj | picomatch | grocery-api/package-lock.json | jest → @jest/core → micromatch → picomatch | jest | 7.5 | HIGH | pending | TBD | TBD | pending |
| GHSA-6rw7-vpxm-498p | qs | grocery-api/package-lock.json | express → qs | express | 7.5 | MEDIUM | pending | TBD | TBD | pending |
| GHSA-w7fw-mjwx-w883 | qs | grocery-api/package-lock.json | express → qs | express | 7.5 | LOW | pending | TBD | TBD | pending |
| GHSA-52f5-9888-hmc6 | tmp | grocery-api/package-lock.json | eslint → inquirer → external-editor → tmp | eslint | 7.5 | LOW | pending | TBD | TBD | pending |
| GHSA-43fc-jf86-j433 | axios | grocery-infra/package-lock.json | Direct | axios | 7.5 | HIGH | pending | TBD | TBD | pending |
| GHSA-f886-m6hf-6m8v | brace-expansion | grocery-infra/package-lock.json | jest → @jest/core → jest-runtime → glob → minimatch → brace-expansion | jest | 7.5 | MEDIUM | completed | None | safe_upgrade | pending |
| GHSA-v6h2-p8h4-qcjw | brace-expansion | grocery-infra/package-lock.json | jest → @jest/core → jest-runtime → glob → minimatch → brace-expansion | jest | 7.5 | LOW | completed | None | safe_upgrade | pending |
| GHSA-f886-m6hf-6m8v | brace-expansion | grocery-infra/package-lock.json | jest → @jest/core → jest-runtime → glob → minimatch → brace-expansion | jest | 7.5 | MEDIUM | completed | None | safe_upgrade | pending |
| GHSA-gxpj-cx7g-858c | debug | grocery-infra/package-lock.json | nock → debug | nock | 7.5 | LOW | pending | TBD | TBD | pending |
| GHSA-x3cc-x39p-42qx | fast-xml-parser | grocery-infra/package-lock.json | Direct | fast-xml-parser | 7.5 | MEDIUM | pending | TBD | TBD | pending |
| MAL-2023-462 | fsevents | grocery-infra/package-lock.json | fsevents | fsevents | 5.0 | UNKNOWN | pending | TBD | TBD | pending |
| GHSA-8r6j-v8pm-fqw3 | fsevents | grocery-infra/package-lock.json | fsevents | fsevents | 9.0 | CRITICAL | pending | TBD | TBD | pending |
| GHSA-qqgx-2p2h-9c37 | ini | grocery-infra/package-lock.json | ini | ini | 5.0 | HIGH | pending | TBD | TBD | pending |
| GHSA-mh29-5h37-fv8m | js-yaml | grocery-infra/package-lock.json | jest → @jest/core → @jest/transform → babel-plugin-istanbul → @istanbuljs/load-nyc-config → js-yaml | jest | 5.0 | MEDIUM | pending | TBD | TBD | pending |
| GHSA-23c5-xmqv-rm74 | minimatch | grocery-infra/package-lock.json | jest → @jest/core → jest-runtime → glob → minimatch | jest | 7.5 | HIGH | completed | Low | safe_upgrade | pending |
| GHSA-3ppc-4f35-3m26 | minimatch | grocery-infra/package-lock.json | jest → @jest/core → jest-runtime → glob → minimatch | jest | 7.5 | HIGH | completed | Low | safe_upgrade | pending |
| GHSA-7r86-cg39-jmmj | minimatch | grocery-infra/package-lock.json | jest → @jest/core → jest-runtime → glob → minimatch | jest | 7.5 | HIGH | completed | Low | safe_upgrade | pending |
| GHSA-f8q6-p94x-37v3 | minimatch | grocery-infra/package-lock.json | jest → @jest/core → jest-runtime → glob → minimatch | jest | 7.5 | HIGH | completed | Low | safe_upgrade | pending |
| GHSA-23c5-xmqv-rm74 | minimatch | grocery-infra/package-lock.json | jest → @jest/core → jest-runtime → glob → minimatch | jest | 7.5 | HIGH | completed | Low | safe_upgrade | pending |
| GHSA-3ppc-4f35-3m26 | minimatch | grocery-infra/package-lock.json | jest → @jest/core → jest-runtime → glob → minimatch | jest | 7.5 | HIGH | completed | Low | safe_upgrade | pending |
| GHSA-7r86-cg39-jmmj | minimatch | grocery-infra/package-lock.json | jest → @jest/core → jest-runtime → glob → minimatch | jest | 7.5 | HIGH | completed | Low | safe_upgrade | pending |
| GHSA-vh95-rmgr-6w4m | minimist | grocery-infra/package-lock.json | minimist | minimist | 7.5 | MEDIUM | pending | TBD | TBD | pending |
| GHSA-xvch-5gv4-984h | minimist | grocery-infra/package-lock.json | minimist | minimist | 9.0 | CRITICAL | pending | TBD | TBD | pending |
| GHSA-vh95-rmgr-6w4m | minimist | grocery-infra/package-lock.json | minimist | minimist | 7.5 | MEDIUM | pending | TBD | TBD | pending |
| GHSA-xvch-5gv4-984h | minimist | grocery-infra/package-lock.json | minimist | minimist | 9.0 | CRITICAL | pending | TBD | TBD | pending |
| GHSA-3v7f-55p6-f55p | picomatch | grocery-infra/package-lock.json | jest → @jest/core → jest-util → picomatch | jest | 5.0 | MEDIUM | pending | TBD | TBD | pending |
| GHSA-c2c7-rcm5-vvqj | picomatch | grocery-infra/package-lock.json | jest → @jest/core → jest-util → picomatch | jest | 7.5 | HIGH | pending | TBD | TBD | pending |
| GHSA-c2qf-rxjj-qqgw | semver | grocery-infra/package-lock.json | jest → @jest/core → jest-snapshot → semver | jest | 7.5 | HIGH | pending | TBD | TBD | pending |
| GHSA-34x7-hfp2-rc4v | tar | grocery-infra/package-lock.json | tar | tar | 7.5 | HIGH | pending | TBD | TBD | pending |
| GHSA-3jfq-g458-7qm9 | tar | grocery-infra/package-lock.json | tar | tar | 9.0 | HIGH | pending | TBD | TBD | pending |
| GHSA-5955-9wpr-37jh | tar | grocery-infra/package-lock.json | tar | tar | 9.0 | HIGH | pending | TBD | TBD | pending |
| GHSA-83g3-92jg-28cx | tar | grocery-infra/package-lock.json | tar | tar | 9.0 | HIGH | pending | TBD | TBD | pending |
| GHSA-8qq5-rm4j-mr97 | tar | grocery-infra/package-lock.json | tar | tar | 7.5 | HIGH | pending | TBD | TBD | pending |
| GHSA-9ppj-qmqm-q256 | tar | grocery-infra/package-lock.json | tar | tar | 7.5 | HIGH | pending | TBD | TBD | pending |
| GHSA-9r2w-394v-53qc | tar | grocery-infra/package-lock.json | tar | tar | 9.0 | HIGH | pending | TBD | TBD | pending |
| GHSA-f5x3-32g6-xq36 | tar | grocery-infra/package-lock.json | tar | tar | 7.5 | MEDIUM | pending | TBD | TBD | pending |
| GHSA-qffp-2rhf-9h96 | tar | grocery-infra/package-lock.json | tar | tar | 7.5 | HIGH | pending | TBD | TBD | pending |
| GHSA-qq89-hq3f-393p | tar | grocery-infra/package-lock.json | tar | tar | 9.0 | HIGH | pending | TBD | TBD | pending |
| GHSA-r628-mhmh-qjhw | tar | grocery-infra/package-lock.json | tar | tar | 9.0 | HIGH | pending | TBD | TBD | pending |
| GHSA-r6q2-hw4h-h46w | tar | grocery-infra/package-lock.json | tar | tar | 7.5 | HIGH | pending | TBD | TBD | pending |
| GHSA-f886-m6hf-6m8v | brace-expansion | grocery-shared/package-lock.json | jest → @jest/core → jest-runtime → glob → minimatch → brace-expansion | jest | 7.5 | MEDIUM | completed | None | safe_upgrade | pending |
| GHSA-mh29-5h37-fv8m | js-yaml | grocery-shared/package-lock.json | jest → @jest/core → @jest/transform → babel-plugin-istanbul → @istanbuljs/load-nyc-config → js-yaml | jest | 5.0 | MEDIUM | pending | TBD | TBD | pending |
| GHSA-23c5-xmqv-rm74 | minimatch | grocery-shared/package-lock.json | jest → @jest/core → jest-runtime → glob → minimatch | jest | 7.5 | HIGH | completed | Low | safe_upgrade | pending |
| GHSA-3ppc-4f35-3m26 | minimatch | grocery-shared/package-lock.json | jest → @jest/core → jest-runtime → glob → minimatch | jest | 7.5 | HIGH | completed | Low | safe_upgrade | pending |
| GHSA-7r86-cg39-jmmj | minimatch | grocery-shared/package-lock.json | jest → @jest/core → jest-runtime → glob → minimatch | jest | 7.5 | HIGH | completed | Low | safe_upgrade | pending |
| GHSA-3v7f-55p6-f55p | picomatch | grocery-shared/package-lock.json | jest → @jest/core → jest-util → picomatch | jest | 5.0 | MEDIUM | pending | TBD | TBD | pending |
| GHSA-c2c7-rcm5-vvqj | picomatch | grocery-shared/package-lock.json | jest → @jest/core → jest-util → picomatch | jest | 7.5 | HIGH | pending | TBD | TBD | pending |
| GHSA-2w69-qvjg-hvjx | @remix-run/router | grocery-web/package-lock.json | react-router-dom → @remix-run/router | react-router-dom | 9.0 | HIGH | pending | TBD | TBD | pending |
| GHSA-2g4f-4pwh-qvx6 | ajv | grocery-web/package-lock.json | ajv | ajv | 5.0 | MEDIUM | pending | TBD | TBD | pending |
| GHSA-43fc-jf86-j433 | axios | grocery-web/package-lock.json | Direct | axios | 7.5 | HIGH | pending | TBD | TBD | pending |
| GHSA-f886-m6hf-6m8v | brace-expansion | grocery-web/package-lock.json | brace-expansion | brace-expansion | 7.5 | MEDIUM | completed | None | safe_upgrade | pending |
| GHSA-25h7-pfq9-p65f | flatted | grocery-web/package-lock.json | flatted | flatted | 7.5 | HIGH | pending | TBD | TBD | pending |
| GHSA-rf6f-7fwh-wjgh | flatted | grocery-web/package-lock.json | flatted | flatted | 9.0 | HIGH | pending | TBD | TBD | pending |
| GHSA-mh29-5h37-fv8m | js-yaml | grocery-web/package-lock.json | js-yaml | js-yaml | 5.0 | MEDIUM | pending | TBD | TBD | pending |
| GHSA-f23m-r3pf-42rh | lodash | grocery-web/package-lock.json | @testing-library/jest-dom → lodash | @testing-library/jest-dom | 5.0 | MEDIUM | completed | Low | safe_upgrade | pending |
| GHSA-r5fr-rjxr-66jc | lodash | grocery-web/package-lock.json | @testing-library/jest-dom → lodash | @testing-library/jest-dom | 9.0 | HIGH | completed | Low | safe_upgrade | pending |
| GHSA-xxjr-mmjv-4gpg | lodash | grocery-web/package-lock.json | @testing-library/jest-dom → lodash | @testing-library/jest-dom | 5.0 | MEDIUM | completed | Low | safe_upgrade | pending |
| GHSA-23c5-xmqv-rm74 | minimatch | grocery-web/package-lock.json | minimatch | minimatch | 7.5 | HIGH | completed | Low | safe_upgrade | pending |
| GHSA-3ppc-4f35-3m26 | minimatch | grocery-web/package-lock.json | minimatch | minimatch | 7.5 | HIGH | completed | Low | safe_upgrade | pending |
| GHSA-7r86-cg39-jmmj | minimatch | grocery-web/package-lock.json | minimatch | minimatch | 7.5 | HIGH | completed | Low | safe_upgrade | pending |
| GHSA-3v7f-55p6-f55p | picomatch | grocery-web/package-lock.json | vitest → picomatch | vitest | 5.0 | MEDIUM | pending | TBD | TBD | pending |
| GHSA-c2c7-rcm5-vvqj | picomatch | grocery-web/package-lock.json | vitest → picomatch | vitest | 7.5 | HIGH | pending | TBD | TBD | pending |
| GHSA-9jcx-v3wj-wh4m | react-router | grocery-web/package-lock.json | react-router-dom → react-router | react-router-dom | 7.5 | MEDIUM | pending | TBD | TBD | pending |
| GHSA-mw96-cpmx-2vgc | rollup | grocery-web/package-lock.json | vite → rollup | vite | 9.0 | HIGH | pending | TBD | TBD | pending |

**Legend:**
- Triage Status: Analysis progress (pending → in_progress → completed)
- Codebase Severity: Risk level against our specific codebase (Critical/High/Moderate/Low/None)
- Upgrade Impact: Impact of upgrading (safe_upgrade / breaking_changes / no_fix)
- Remediation Status: Has the fix been applied? (pending / in_progress / completed / accepted_risk / no_fix_available)
- Dependency Chain: Shows the full dependency path (Direct or parent → ... → vulnerable-package)
- Upgradeable Package: The package that needs to be upgraded (direct dep or parent for transitive deps)

**Note:** Detailed vulnerability information is available in the details/ directory, organized by upgradeable package.
