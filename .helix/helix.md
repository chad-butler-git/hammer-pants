# Project Context - Helix

## Project Overview
- **Type**: Unknown
- **Languages**: 
- **Package Managers**: 

## Security Context
- Project focuses on unknown development
- Uses SQLite-based relationship tracking for code dependencies

## Common Security Concerns
- Dependency vulnerabilities in  packages
- Code security patterns and best practices
- Configuration security and secret management

## Template Plans for Common Security Tasks

### Vulnerability Scanning Template
When user requests: "run a vulnerability scan" or "scan for vulnerabilities"
**Plan should be:**
1. Delegate to vulnerability_scanner agent to scan all lockfiles and create triage document

**Scope:** Simple delegation to scanner agent - agent handles finding lockfiles, scanning, and creating vulnerabilities_triage.md

### Vulnerability Triage Template
When user requests: "triage [package] vulnerabilities"
**Plan should be:**
1. Update package status to "in_progress" in vulnerabilities_triage.md for specific CVE + lockfile rows
2. Delegate to triage_analyzer agent for package analysis
3. Update package status to "completed" in vulnerabilities_triage.md for each CVE + lockfile combination

**Scope:** Execution node handles status updates per CVE + lockfile row, triage_analyzer handles analysis and updating triage notes

**Note:** vulnerabilities_triage.md uses one row per CVE + lockfile combination to enable independent triage tracking when the same vulnerability affects multiple lockfiles

### Package Remediation Template
When user requests: "apply remediation for [package]" or "fix [package] vulnerabilities"
**Plan should be:**
1. Read vulnerabilities_triage.md to extract completed triage analysis for the specific package
2. Delegate to remediation_agent with the specific package name and remediation recommendations
3. Update vulnerabilities_triage.md to mark package vulnerabilities as "remediated"

**Scope:** Planning reads existing triage analysis, remediation_agent applies the specific recommendations from triage notes (version updates, configuration changes, etc.), then updates status to track completion
