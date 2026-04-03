---
name: triage
aliases: triage-vulnerabilities, vuln-triage
description: Analyze and triage vulnerabilities from scan results
argument-hint: [package-name]
mode: security
context: fork
agents: triage-analyzer
---

## Your Task

Triage pending vulnerabilities by analyzing their impact on this codebase.

## Arguments

- `/triage` - Triage ALL pending vulnerabilities (batch mode)
- `/triage {package}` - Triage only vulnerabilities for a specific package

**Target package: $ARGUMENTS** (empty = all pending)

## Prerequisites

Check `.scr/context/scan/vulnerabilities_triage.md` exists. If not, run `/scan` first.

## Phase 1: Read & Filter Vulnerabilities

### Step 1: Read triage table
```
read_file(.scr/context/scan/vulnerabilities_triage.md)
```

### Step 2: Filter rows

**If $ARGUMENTS is provided (e.g., "axios"):**
- Only include rows where Upgradeable Package OR Vulnerable Package matches
- This focuses triage on one package at a time

**If $ARGUMENTS is empty:**
- Include ALL rows where Triage Status = "pending"
- Use batch mode (see Phase 2)

### Step 3: Group for efficient analysis

**CRITICAL: Group vulnerabilities intelligently, not individually!**

**For DIRECT dependencies** (Dependency Chain = "Direct"):
- Group by **Upgradeable Package** only
- Example: validator has 4 CVEs → ONE triage job for "validator"

**For TRANSITIVE dependencies** (has arrows in chain):
- Group by **(Upgradeable Package, Vulnerable Package)** pair
- Example: react-scripts → semver (2 CVEs) is separate from react-scripts → loader-utils (1 CVE)

### Step 4: Create group list
```
[ ] validator (4 CVEs) - Direct
[ ] react-scripts → semver (2 CVEs) - Transitive
[ ] react-scripts → loader-utils (1 CVE) - Transitive
[ ] axios (1 CVE) - Direct
```

## Phase 2: Spawn Triage Analyzers

**IMPORTANT: You must spawn triage-analyzer subagents to do the actual triage work.**

### Batch Mode (when triaging all)

If there are more than 5 groups:
1. Sort by severity (Critical → High → Medium → Low)
2. Process in batches of 5 groups at a time
3. Wait for batch to complete before starting next batch
4. This prevents spawning too many parallel agents

### Single Package Mode

If $ARGUMENTS specifies a package, spawn analyzer(s) for just that package's groups.

For each group, spawn a triage-analyzer agent using the task tool:

```
task(
    description="Triage {package_name}",
    prompt="Analyze and triage {upgradeable_package}'s {vulnerable_package} vulnerabilities. CVE IDs: {list_of_cve_ids}",
    agent_type="triage-analyzer",
    run_in_background=true
)
```

### Spawning Guidelines

- Spawn ALL groups in parallel using run_in_background=true
- Include the specific CVE IDs in the prompt
- For direct dependencies, upgradeable = vulnerable
- For transitive, specify both packages

### Example spawn pattern

```
// Direct dependency
task(
    description="Triage validator",
    prompt="Analyze and triage validator (direct dependency). CVE IDs: GHSA-xxx, GHSA-yyy, GHSA-zzz",
    agent_type="triage-analyzer",
    run_in_background=true
)

// Transitive dependency
task(
    description="Triage react-scripts/semver",
    prompt="Analyze and triage react-scripts → semver (transitive). CVE IDs: GHSA-abc, GHSA-def",
    agent_type="triage-analyzer",
    run_in_background=true
)
```

## Phase 3: Wait and Report

After spawning all analyzers:

1. Wait for all background tasks to complete
2. Read the updated triage table
3. Report summary:
   - Total groups triaged
   - Total CVEs covered
   - Breakdown by state (not_affected, exploitable, etc.)
   - Any CVEs requiring remediation
   - Note: Each analyzer updated vex.json with triage decisions (machine-readable VEX document)

## Analysis Reference (for understanding what analyzers do)

The triage-analyzer agents will:

### Path A: Direct Dependency Analysis
- Read vulnerability details from .scr/context/scan/details/{package}.md
- Search codebase for imports of the package
- Check if vulnerable APIs are used
- Analyze usage context (user input vs trusted data, test vs production)

### Path B: Transitive Dependency Analysis
- Parse the dependency chain
- Determine if dev-only (jest, webpack, eslint, etc.)
- Check where root package is used (src/ vs test/)

### State Options they will use
- `not_affected` - Code doesn't use vulnerable functionality
- `exploitable` - Vulnerable code is reachable in our codebase
- `false_positive` - Incorrect vulnerability report

### Codebase Severity they will assign
- **Critical**: Actively exploitable with user input, severe impact
- **High**: Exploitable with significant impact
- **Moderate**: Exploitable with limited impact
- **Low**: Dev-only, requires unlikely conditions
- **None**: Not exploitable (code not present/reachable)

## Next Steps

Run `/remediate <package>` for vulnerabilities marked `exploitable`.
