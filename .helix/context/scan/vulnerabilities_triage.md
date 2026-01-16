# Vulnerability Triage Reference

Generated: 2026-01-11
Tools Used: osv-scanner, lockfile-parser
Total Vulnerabilities: 39
Total Packages with Vulnerabilities: 18

## Triage Status Overview

| CVE/GHSA ID | Package | Lockfile | Dependency Chain | Upgradeable Package | Scanned CVSS | Scanned Severity | Triage Status | Codebase Severity | Upgrade Impact | Remediation Status |
|-------------|---------|----------|------------------|---------------------|--------------|------------------|---------------|-------------------|----------------|-------------------|
| GHSA-mh29-5h37-fv8m | js-yaml | grocery-shared/package-lock.json | jest → @jest/core → @jest/transform → babel-plugin-istanbul → @istanbuljs/load-nyc-config → js-yaml | jest | 5.3 | MODERATE | completed | Low | safe_upgrade | pending |
| GHSA-9965-vmph-33xx | validator | grocery-shared/package-lock.json | Direct | validator | 6.1 | MODERATE | completed | Low | safe_upgrade | pending |
| GHSA-qgmg-gppg-76g5 | validator | grocery-shared/package-lock.json | Direct | validator | 5.3 | MODERATE | completed | Low | safe_upgrade | pending |
| GHSA-vghf-hv5q-vc2g | validator | grocery-shared/package-lock.json | Direct | validator | 7.7 | HIGH | completed | Low | safe_upgrade | pending |
| GHSA-xx4c-jj58-r7x6 | validator | grocery-shared/package-lock.json | Direct | validator | 5.3 | MODERATE | completed | Low | safe_upgrade | pending |
| GHSA-v6h2-p8h4-qcjw | brace-expansion | grocery-infra/package-lock.json | jest → @jest/core → @jest/reporters → glob → minimatch → brace-expansion | jest | 3.1 | LOW | completed | Low | safe_upgrade | pending |
| GHSA-gxpj-cx7g-858c | debug | grocery-infra/package-lock.json | nock → debug | nock | 3.7 | LOW | completed | Low | safe_upgrade | pending |
| GHSA-x3cc-x39p-42qx | fast-xml-parser | grocery-infra/package-lock.json | Direct | fast-xml-parser | 6.5 | MODERATE | completed | Moderate | breaking_changes | pending |
| MAL-2023-462 | fsevents | grocery-infra/package-lock.json |  | fsevents | 0.0 | UNKNOWN | completed | None | safe_upgrade | pending |
| GHSA-8r6j-v8pm-fqw3 | fsevents | grocery-infra/package-lock.json |  | fsevents | 9.8 | CRITICAL | completed | None | safe_upgrade | pending |
| GHSA-qqgx-2p2h-9c37 | ini | grocery-infra/package-lock.json | fsevents → node-pre-gyp → rc → ini | fsevents | 7.3 | HIGH | completed | None | safe_upgrade | pending |
| GHSA-mh29-5h37-fv8m | js-yaml | grocery-infra/package-lock.json | jest → @jest/core → @jest/transform → babel-plugin-istanbul → @istanbuljs/load-nyc-config → js-yaml | jest | 5.3 | MODERATE | completed | Low | safe_upgrade | pending |
| GHSA-f8q6-p94x-37v3 | minimatch | grocery-infra/package-lock.json | jest → @jest/core → @jest/reporters → glob → minimatch | jest | 7.5 | HIGH | completed | Low | safe_upgrade | pending |
| GHSA-vh95-rmgr-6w4m | minimist | grocery-infra/package-lock.json |  | minimist | 5.6 | MODERATE | completed | None | safe_upgrade | pending |
| GHSA-xvch-5gv4-984h | minimist | grocery-infra/package-lock.json |  | minimist | 9.8 | CRITICAL | completed | None | safe_upgrade | pending |
| GHSA-vh95-rmgr-6w4m | minimist | grocery-infra/package-lock.json |  | minimist | 5.6 | MODERATE | completed | None | safe_upgrade | pending |
| GHSA-xvch-5gv4-984h | minimist | grocery-infra/package-lock.json |  | minimist | 9.8 | CRITICAL | completed | None | safe_upgrade | pending |
| GHSA-c2qf-rxjj-qqgw | semver | grocery-infra/package-lock.json | jest → @jest/core → jest-snapshot → semver | jest | 7.5 | HIGH | completed | Low | safe_upgrade | pending |
| GHSA-3jfq-g458-7qm9 | tar | grocery-infra/package-lock.json |  | tar | 8.2 | HIGH | completed | None | safe_upgrade | pending |
| GHSA-5955-9wpr-37jh | tar | grocery-infra/package-lock.json |  | tar | 8.2 | HIGH | completed | None | safe_upgrade | pending |
| GHSA-9r2w-394v-53qc | tar | grocery-infra/package-lock.json |  | tar | 8.2 | HIGH | completed | None | safe_upgrade | pending |
| GHSA-f5x3-32g6-xq36 | tar | grocery-infra/package-lock.json |  | tar | 6.5 | MODERATE | completed | None | safe_upgrade | pending |
| GHSA-qq89-hq3f-393p | tar | grocery-infra/package-lock.json |  | tar | 8.2 | HIGH | completed | None | safe_upgrade | pending |
| GHSA-r628-mhmh-qjhw | tar | grocery-infra/package-lock.json |  | tar | 8.2 | HIGH | completed | None | safe_upgrade | pending |
| GHSA-2w69-qvjg-hvjx | @remix-run/router | grocery-shared/grocery-web/package-lock.json | react-router-dom → @remix-run/router | react-router-dom | 8.0 | HIGH | completed | Low | safe_upgrade | pending |
| GHSA-mh29-5h37-fv8m | js-yaml | grocery-shared/grocery-web/package-lock.json |  | js-yaml | 5.3 | MODERATE | completed | Low | safe_upgrade | pending |
| GHSA-9jcx-v3wj-wh4m | react-router | grocery-shared/grocery-web/package-lock.json | react-router-dom → react-router | react-router-dom | 6.5 | MODERATE | completed | Low | safe_upgrade | pending |
| GHSA-2w69-qvjg-hvjx | @remix-run/router | grocery-web/package-lock.json | react-router-dom → @remix-run/router | react-router-dom | 8.0 | HIGH | completed | Low | safe_upgrade | pending |
| GHSA-mh29-5h37-fv8m | js-yaml | grocery-web/package-lock.json |  | js-yaml | 5.3 | MODERATE | completed | Low | safe_upgrade | pending |
| GHSA-9jcx-v3wj-wh4m | react-router | grocery-web/package-lock.json | react-router-dom → react-router | react-router-dom | 6.5 | MODERATE | completed | Low | safe_upgrade | pending |
| GHSA-mh29-5h37-fv8m | js-yaml | grocery-api/package-lock.json | eslint → js-yaml | eslint | 5.3 | MODERATE | completed | Low | safe_upgrade | pending |
| GHSA-8cf7-32gw-wr33 | jsonwebtoken | grocery-api/package-lock.json | Direct | jsonwebtoken | 8.1 | HIGH | completed | Low | breaking_changes | pending |
| GHSA-hjrf-2m68-5959 | jsonwebtoken | grocery-api/package-lock.json | Direct | jsonwebtoken | 5.0 | MODERATE | completed | Low | breaking_changes | pending |
| GHSA-qwph-4952-7xr6 | jsonwebtoken | grocery-api/package-lock.json | Direct | jsonwebtoken | 6.4 | MODERATE | completed | Low | breaking_changes | pending |
| GHSA-869p-cjfg-cm3x | jws | grocery-api/package-lock.json | jsonwebtoken → jws | jsonwebtoken | 7.5 | HIGH | completed | None | safe_upgrade | pending |
| GHSA-29mw-wpgm-hmr9 | lodash | grocery-api/package-lock.json | Direct | lodash | 5.3 | MODERATE | completed | Low | safe_upgrade | pending |
| GHSA-35jh-r3h4-6jhm | lodash | grocery-api/package-lock.json | Direct | lodash | 7.2 | HIGH | completed | High | safe_upgrade | pending |
| GHSA-6rw7-vpxm-498p | qs | grocery-api/package-lock.json | express → qs | express | 8.7 | HIGH | completed | High | safe_upgrade | pending |
| GHSA-52f5-9888-hmc6 | tmp | grocery-api/package-lock.json | eslint → inquirer → external-editor → tmp | eslint | 2.5 | LOW | completed | Low | safe_upgrade | pending |

**Legend:**
- Triage Status: Has this CVE been analyzed? (pending / in_progress / completed)
- Codebase Severity: Risk level against our specific codebase (Critical/High/Moderate/Low/None)
- Upgrade Impact: Impact of upgrading (safe_upgrade / breaking_changes / no_fix)
- Remediation Status: Has the fix been applied? (pending / in_progress / completed / accepted_risk / no_fix_available)
- Dependency Chain: Shows the full dependency path (Direct or parent → ... → vulnerable-package)
- Upgradeable Package: The package that needs to be upgraded (direct dep or parent for transitive deps)

**Note:** Detailed vulnerability information is available in the details/ directory, organized by upgradeable package.
