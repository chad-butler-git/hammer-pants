---
name: approve
description: Execute an approved remediation plan
argument-hint: <package>
mode: security
context: fork
agents: remediation-executor, remediation-finalizer
allowed-tools: bash, glob, grep, read_file, write, edit, task, update_vulnerability_status, regenerate_sbom
---

## Task

Execute the approved remediation plan for package: **$0**

## Steps

### 1. Verify plan exists

Read `.scr/context/remediation/$0/state.json`

If not found: Output "No plan found for $0. Run /remediate $0 first." and **STOP**.

### 2. Execute upgrade

```
task(
    description="Execute remediation for $0",
    prompt="Execute remediation for $0",
    agent_type="remediation-executor"
)
```

### 3. Validate fix

Run: `osv-scanner --lockfile {lockfile} --format json` to verify CVEs are fixed.

### 4. Update tracking

- Call `regenerate_sbom({})`
- Call `update_vulnerability_status()` for each resolved CVE with state="resolved"

### 5. Finalize

```
task(
    description="Finalize remediation for $0",
    prompt="Finalize remediation for $0",
    agent_type="remediation-finalizer"
)
```

### 6. Report completion

Output summary with PR link and list of resolved CVEs.
