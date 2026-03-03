# Vulnerability Triage Reference

Generated: 2026-02-26

Tools Used: osv-scanner, lockfile-parser

Total Vulnerabilities: 72

Total Packages with Vulnerabilities: 22

## Triage Status Overview

| CVE/GHSA ID | Package | Lockfile | Dependency Chain | Upgradeable Package | Scanned CVSS | Scanned Severity | Triage Status | Codebase Severity | Upgrade Impact | Remediation Status |
|-------------|---------|----------|------------------|---------------------|--------------|------------------|---------------|-------------------|----------------|-------------------|
| GHSA-2g4f-4pwh-qvx6 | ajv | grocery-api/package-lock.json | eslint → ajv | eslint | 5.0 | MEDIUM | completed | Low | breaking_changes | pending |
| GHSA-mh29-5h37-fv8m | js-yaml | grocery-api/package-lock.json | eslint → js-yaml | eslint | 5.0 | MEDIUM | completed | Low | safe_upgrade | pending |
| GHSA-8cf7-32gw-wr33 | jsonwebtoken | grocery-api/package-lock.json | Direct | jsonwebtoken | 9.0 | HIGH | completed | None | breaking_changes | pending |
| GHSA-hjrf-2m68-5959 | jsonwebtoken | grocery-api/package-lock.json | Direct | jsonwebtoken | 7.5 | MEDIUM | completed | None | breaking_changes | pending |
| GHSA-qwph-4952-7xr6 | jsonwebtoken | grocery-api/package-lock.json | Direct | jsonwebtoken | 9.0 | MEDIUM | completed | None | breaking_changes | pending |
| GHSA-869p-cjfg-cm3x | jws | grocery-api/package-lock.json | jsonwebtoken → jws | jsonwebtoken | 7.5 | HIGH | completed | None | breaking_changes | pending |
| GHSA-29mw-wpgm-hmr9 | lodash | grocery-api/package-lock.json | Direct | lodash | 5.0 | MEDIUM | completed | None | safe_upgrade | completed |
| GHSA-35jh-r3h4-6jhm | lodash | grocery-api/package-lock.json | Direct | lodash | 9.0 | HIGH | completed | None | safe_upgrade | completed |
| GHSA-xxjr-mmjv-4gpg | lodash | grocery-api/package-lock.json | Direct | lodash | 5.0 | MEDIUM | completed | None | safe_upgrade | completed |
| GHSA-3ppc-4f35-3m26 | minimatch | grocery-api/package-lock.json | eslint → minimatch | eslint | 7.5 | HIGH | completed | Low | safe_upgrade | pending |
| GHSA-6rw7-vpxm-498p | qs | grocery-api/package-lock.json | express → qs | express | 7.5 | HIGH | completed | Moderate | safe_upgrade | pending |
| GHSA-w7fw-mjwx-w883 | qs | grocery-api/package-lock.json | express → qs | express | 7.5 | LOW | completed | Low | safe_upgrade | pending |
| GHSA-52f5-9888-hmc6 | tmp | grocery-api/package-lock.json | eslint → inquirer → external-editor → tmp | eslint | 7.5 | LOW | completed | Low | breaking_changes | pending |
| GHSA-43fc-jf86-j433 | axios | grocery-infra/package-lock.json | Direct | axios | 7.5 | HIGH | completed | None | safe_upgrade | pending |
| GHSA-4hjh-wcwx-xvwj | axios | grocery-infra/package-lock.json | Direct | axios | 7.5 | HIGH | completed | None | safe_upgrade | pending |
| GHSA-v6h2-p8h4-qcjw | brace-expansion | grocery-infra/package-lock.json | jest → @jest/core → jest-config → glob → minimatch → brace-expansion | jest | 7.5 | LOW | completed | Low | safe_upgrade | pending |
| GHSA-gxpj-cx7g-858c | debug | grocery-infra/package-lock.json | nock → debug | nock | 7.5 | LOW | completed | Low | safe_upgrade | pending |
| MAL-2023-462 | fsevents | grocery-infra/package-lock.json | fsevents | fsevents | 5.0 | UNKNOWN | completed | Low | safe_upgrade | pending |
| GHSA-8r6j-v8pm-fqw3 | fsevents | grocery-infra/package-lock.json | fsevents | fsevents | 9.0 | CRITICAL | completed | Low | safe_upgrade | pending |
| GHSA-qqgx-2p2h-9c37 | ini | grocery-infra/package-lock.json | ini | ini | 5.0 | HIGH | completed | Low | safe_upgrade | pending |
| GHSA-mh29-5h37-fv8m | js-yaml | grocery-infra/package-lock.json | jest → @jest/core → @jest/transform → babel-plugin-istanbul → @istanbuljs/load-nyc-config → js-yaml | jest | 5.0 | MEDIUM | completed | Low | safe_upgrade | pending |
| GHSA-3ppc-4f35-3m26 | minimatch | grocery-infra/package-lock.json | jest → @jest/core → jest-config → glob → minimatch | jest | 7.5 | HIGH | completed | Low | safe_upgrade | pending |
| GHSA-f8q6-p94x-37v3 | minimatch | grocery-infra/package-lock.json | jest → @jest/core → jest-config → glob → minimatch | jest | 7.5 | HIGH | completed | Low | safe_upgrade | pending |
| GHSA-3ppc-4f35-3m26 | minimatch | grocery-infra/package-lock.json | jest → @jest/core → jest-config → glob → minimatch | jest | 7.5 | HIGH | completed | Low | safe_upgrade | pending |
| GHSA-vh95-rmgr-6w4m | minimist | grocery-infra/package-lock.json | minimist | minimist | 7.5 | MEDIUM | completed | Low | safe_upgrade | pending |
| GHSA-xvch-5gv4-984h | minimist | grocery-infra/package-lock.json | minimist | minimist | 9.0 | CRITICAL | completed | Low | safe_upgrade | pending |
| GHSA-vh95-rmgr-6w4m | minimist | grocery-infra/package-lock.json | minimist | minimist | 7.5 | MEDIUM | completed | Low | safe_upgrade | pending |
| GHSA-xvch-5gv4-984h | minimist | grocery-infra/package-lock.json | minimist | minimist | 9.0 | CRITICAL | completed | Low | safe_upgrade | pending |
| GHSA-c2qf-rxjj-qqgw | semver | grocery-infra/package-lock.json | jest → @jest/core → jest-snapshot → semver | jest | 7.5 | HIGH | completed | Low | safe_upgrade | pending |
| GHSA-34x7-hfp2-rc4v | tar | grocery-infra/package-lock.json | tar | tar | 7.5 | HIGH | completed | Low | safe_upgrade | pending |
| GHSA-3jfq-g458-7qm9 | tar | grocery-infra/package-lock.json | tar | tar | 9.0 | HIGH | completed | Low | safe_upgrade | pending |
| GHSA-5955-9wpr-37jh | tar | grocery-infra/package-lock.json | tar | tar | 9.0 | HIGH | completed | Low | safe_upgrade | pending |
| GHSA-83g3-92jg-28cx | tar | grocery-infra/package-lock.json | tar | tar | 9.0 | HIGH | completed | Low | safe_upgrade | pending |
| GHSA-8qq5-rm4j-mr97 | tar | grocery-infra/package-lock.json | tar | tar | 7.5 | HIGH | completed | Low | safe_upgrade | pending |
| GHSA-9r2w-394v-53qc | tar | grocery-infra/package-lock.json | tar | tar | 9.0 | HIGH | completed | Low | safe_upgrade | pending |
| GHSA-f5x3-32g6-xq36 | tar | grocery-infra/package-lock.json | tar | tar | 7.5 | MEDIUM | completed | Low | safe_upgrade | pending |
| GHSA-qq89-hq3f-393p | tar | grocery-infra/package-lock.json | tar | tar | 9.0 | HIGH | completed | Low | safe_upgrade | pending |
| GHSA-r628-mhmh-qjhw | tar | grocery-infra/package-lock.json | tar | tar | 9.0 | HIGH | completed | Low | safe_upgrade | pending |
| GHSA-r6q2-hw4h-h46w | tar | grocery-infra/package-lock.json | tar | tar | 7.5 | HIGH | completed | Low | safe_upgrade | pending |
| GHSA-2w69-qvjg-hvjx | @remix-run/router | grocery-web/package-lock.json | react-router-dom → @remix-run/router | react-router-dom | 9.0 | HIGH | completed | None | safe_upgrade | pending |
| GHSA-2g4f-4pwh-qvx6 | ajv | grocery-web/package-lock.json | ajv | ajv | 5.0 | MEDIUM | completed | Low | breaking_changes | pending |
| GHSA-43fc-jf86-j433 | axios | grocery-web/package-lock.json | Direct | axios | 7.5 | HIGH | completed | None | safe_upgrade | pending |
| GHSA-4hjh-wcwx-xvwj | axios | grocery-web/package-lock.json | Direct | axios | 7.5 | HIGH | completed | None | safe_upgrade | pending |
| GHSA-mh29-5h37-fv8m | js-yaml | grocery-web/package-lock.json | js-yaml | js-yaml | 5.0 | MEDIUM | completed | Low | safe_upgrade | pending |
| GHSA-xxjr-mmjv-4gpg | lodash | grocery-web/package-lock.json | @testing-library/jest-dom → lodash | @testing-library/jest-dom | 5.0 | MEDIUM | completed | None | safe_upgrade | completed |
| GHSA-3ppc-4f35-3m26 | minimatch | grocery-web/package-lock.json | minimatch | minimatch | 7.5 | HIGH | completed | Low | safe_upgrade | pending |
| GHSA-9jcx-v3wj-wh4m | react-router | grocery-web/package-lock.json | react-router-dom → react-router | react-router-dom | 7.5 | MEDIUM | completed | None | safe_upgrade | pending |
| GHSA-mw96-cpmx-2vgc | rollup | grocery-web/package-lock.json | vitest → vite → rollup | vitest | 9.0 | HIGH | completed | Low | breaking_changes | pending |
| GHSA-93m4-6634-74q7 | vite | grocery-web/package-lock.json | vitest → vite | vitest | 7.5 | MEDIUM | completed | Moderate | breaking_changes | pending |
| GHSA-g4jq-h2w9-997c | vite | grocery-web/package-lock.json | vitest → vite | vitest | 5.0 | LOW | completed | Moderate | breaking_changes | pending |
| GHSA-jqfw-vq24-v9c3 | vite | grocery-web/package-lock.json | vitest → vite | vitest | 5.0 | LOW | completed | Moderate | breaking_changes | pending |
| GHSA-mh29-5h37-fv8m | js-yaml | grocery-shared/package-lock.json | jest → @jest/core → @jest/transform → babel-plugin-istanbul → @istanbuljs/load-nyc-config → js-yaml | jest | 5.0 | MEDIUM | completed | Low | safe_upgrade | pending |
| GHSA-5v2h-r2cx-5xgj | marked | grocery-shared/package-lock.json | Direct | marked | 7.5 | HIGH | completed | High | breaking_changes | pending |
| GHSA-p9wx-2529-fp83 | marked | grocery-shared/package-lock.json | Direct | marked | 5.0 | MEDIUM | completed | High | safe_upgrade | pending |
| GHSA-rrrm-qjm4-v8hf | marked | grocery-shared/package-lock.json | Direct | marked | 7.5 | HIGH | completed | High | breaking_changes | pending |
| GHSA-3ppc-4f35-3m26 | minimatch | grocery-shared/package-lock.json | jest → @jest/core → jest-runtime → glob → minimatch | jest | 7.5 | HIGH | completed | Low | safe_upgrade | pending |
| GHSA-9965-vmph-33xx | validator | grocery-shared/package-lock.json | Direct | validator | 5.0 | MEDIUM | completed | None | safe_upgrade | pending |
| GHSA-qgmg-gppg-76g5 | validator | grocery-shared/package-lock.json | Direct | validator | 5.0 | MEDIUM | completed | None | safe_upgrade | pending |
| GHSA-vghf-hv5q-vc2g | validator | grocery-shared/package-lock.json | Direct | validator | 7.5 | HIGH | completed | None | safe_upgrade | pending |
| GHSA-xx4c-jj58-r7x6 | validator | grocery-shared/package-lock.json | Direct | validator | 5.0 | MEDIUM | completed | None | safe_upgrade | pending |

**Legend:**
- Triage Status: Analysis progress (pending → in_progress → completed)
- Codebase Severity: Risk level against our specific codebase (Critical/High/Moderate/Low/None)
- Upgrade Impact: Impact of upgrading (safe_upgrade / breaking_changes / no_fix)
- Remediation Status: Has the fix been applied? (pending / in_progress / completed / accepted_risk / no_fix_available)
- Dependency Chain: Shows the full dependency path (Direct or parent → ... → vulnerable-package)
- Upgradeable Package: The package that needs to be upgraded (direct dep or parent for transitive deps)

**Note:** Detailed vulnerability information is available in the details/ directory, organized by upgradeable package.
