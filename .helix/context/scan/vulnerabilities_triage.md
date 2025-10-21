# Vulnerability Triage Reference

Generated: 2025-10-20
Tools Used: osv-scanner, npm-audit
Total Vulnerabilities: 26
Total Packages with Vulnerabilities: 10

## Triage Status Overview

| CVE/GHSA ID | Package | Lockfile | Dependency Chain | Upgradeable Package | Scanned CVSS | Scanned Severity | Triage Status | Codebase Severity | Upgrade Impact | Remediation Status |
|-------------|---------|----------|------------------|---------------------|--------------|------------------|---------------|-------------------|----------------|-------------------|
| GHSA-p3vf-v8qc-cwcr | dompurify | grocery-web | Direct | dompurify | 9.1 | Critical | completed | Low | breaking_changes | pending |
| GHSA-gx9m-whjm-85jf | dompurify | grocery-web | Direct | dompurify | 10.0 | High | completed | Low | breaking_changes | pending |
| GHSA-mmhx-hmjr-r674 | dompurify | grocery-web | Direct | dompurify | 7.0 | High | completed | Low | breaking_changes | pending |
| GHSA-vhxf-7vqr-mrjg | dompurify | grocery-web | Direct | dompurify | 4.5 | Medium | completed | Low | breaking_changes | pending |
| GHSA-g4jq-h2w9-997c | vite | grocery-web | Direct | vite | 2.0 | Low | completed | Low | breaking_changes | pending |
| GHSA-jqfw-vq24-v9c3 | vite | grocery-web | Direct | vite | 2.0 | Low | completed | Low | breaking_changes | pending |
| GHSA-g4jq-h2w9-997c | vite | grocery-shared/grocery-web | vitest → vite | vitest | 2.0 | Low | completed | Low | safe_upgrade | pending |
| GHSA-jqfw-vq24-v9c3 | vite | grocery-shared/grocery-web | vitest → vite | vitest | 2.0 | Low | completed | Low | safe_upgrade | pending |
| GHSA-3jfq-g458-7qm9 | tar | grocery-infra | fsevents → tar | fsevents | 8.2 | High | completed | Low | safe_upgrade | pending |
| GHSA-5955-9wpr-37jh | tar | grocery-infra | fsevents → tar | fsevents | 8.2 | High | completed | Low | safe_upgrade | pending |
| GHSA-9r2w-394v-53qc | tar | grocery-infra | fsevents → tar | fsevents | 8.2 | High | completed | Low | safe_upgrade | pending |
| GHSA-qq89-hq3f-393p | tar | grocery-infra | fsevents → tar | fsevents | 8.2 | High | completed | Low | safe_upgrade | pending |
| GHSA-r628-mhmh-qjhw | tar | grocery-infra | fsevents → tar | fsevents | 8.2 | High | completed | Low | safe_upgrade | pending |
| GHSA-f5x3-32g6-xq36 | tar | grocery-infra | fsevents → tar | fsevents | 6.5 | Medium | completed | Low | safe_upgrade | pending |
| GHSA-qqgx-2p2h-9c37 | ini | grocery-infra | fsevents → ini | fsevents | 7.3 | High | completed | Low | safe_upgrade | pending |
| GHSA-4hjh-wcwx-xvwj | axios | grocery-web | Direct | axios | 7.5 | High | completed | Low | safe_upgrade | pending |
| GHSA-4hjh-wcwx-xvwj | axios | grocery-shared/grocery-web | Direct | axios | 7.5 | High | completed | None | safe_upgrade | pending |
| GHSA-4hjh-wcwx-xvwj | axios | grocery-infra | Direct | axios | 7.5 | High | completed | Low | safe_upgrade | pending |
| GHSA-5v2h-r2cx-5xgj | marked | grocery-shared | Direct | marked | 7.5 | High | completed | High | breaking_changes | pending |
| GHSA-rrrm-qjm4-v8hf | marked | grocery-shared | Direct | marked | 7.5 | High | completed | High | breaking_changes | pending |
| GHSA-p9wx-2529-fp83 | marked | grocery-shared | Direct | marked | N/A | Medium | completed | High | breaking_changes | pending |
| GHSA-9965-vmph-33xx | validator | grocery-shared | Direct | validator | 6.1 | Medium | completed | Low | no_fix | pending |
| GHSA-qgmg-gppg-76g5 | validator | grocery-shared | Direct | validator | 5.3 | Medium | completed | Low | safe_upgrade | pending |
| GHSA-xx4c-jj58-r7x6 | validator | grocery-shared | Direct | validator | 5.3 | Medium | completed | Low | safe_upgrade | pending |
| GHSA-35jh-r3h4-6jhm | lodash | grocery-api | Direct | lodash | 7.2 | High | completed | Low | safe_upgrade | pending |
| GHSA-29mw-wpgm-hmr9 | lodash | grocery-api | Direct | lodash | 5.3 | Medium | completed | Low | safe_upgrade | pending |
| GHSA-8cf7-32gw-wr33 | jsonwebtoken | grocery-api | Direct | jsonwebtoken | 8.1 | High | completed | Low | breaking_changes | pending |
| GHSA-hjrf-2m68-5959 | jsonwebtoken | grocery-api | Direct | jsonwebtoken | 5.0 | Medium | completed | Low | breaking_changes | pending |
| GHSA-qwph-4952-7xr6 | jsonwebtoken | grocery-api | Direct | jsonwebtoken | 6.4 | Medium | completed | Low | breaking_changes | pending |
| GHSA-52f5-9888-hmc6 | tmp | grocery-api | eslint → external-editor → tmp | eslint | 2.5 | Low | completed | Low | breaking_changes | pending |

**Legend:**
- **Triage Status**: Has this CVE been analyzed? (pending / in_progress / completed)
- **Codebase Severity**: Risk level against our specific codebase (Critical/High/Medium/Low/None)
- **Upgrade Impact**: Impact of upgrading (safe_upgrade / breaking_changes / no_fix)
- **Remediation Status**: Has the fix been applied? (pending / in_progress / completed / accepted_risk / no_fix_available)
- **Dependency Chain**: Shows the full dependency path (Direct or parent → ... → vulnerable-package)
- **Upgradeable Package**: The package that needs to be upgraded (direct dep or parent for transitive deps)

**Note:** Detailed vulnerability information is available in the details/ directory, organized by upgradeable package.
