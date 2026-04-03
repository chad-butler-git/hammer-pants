# Project Context - SCR

## Project Overview
- **Type**: Node.js
- **Languages**: JavaScript/TypeScript
- **Package Managers**: npm/yarn

## Security Context
- Uses SQLite-based relationship tracking for code dependencies

## Common Security Concerns
- npm dependency vulnerabilities
- package-lock.json integrity
- Environment variable exposure

## Security Workflow

### Vulnerability Scanning
Run vulnerability scanner to scan all lockfiles and create triage document:
1. Switch to SECURITY mode (Shift+Tab)
2. Ask: "Scan this project for vulnerabilities"

### Vulnerability Triage
After scanning, triage individual packages:
1. Ask: "Triage [package] vulnerabilities"

### Remediation
After triage, apply fixes:
1. Ask: "Create remediation plan for [package]"
2. Review the plan
3. Ask: "Execute remediation for [package]"

## Output Locations
- Scan results: .scr/context/scan/
- Triage table: .scr/context/scan/vulnerabilities_triage.md
- VEX document: .scr/context/scan/vex.json
- Remediation state: .scr/context/remediation/
