---
name: remediate
aliases: fix, patch, remediation
description: Create remediation plan for a vulnerable package
argument-hint: <package>
mode: security
context: fork
agents: remediation-planner
allowed-tools: bash, glob, grep, read_file, write, task
---

## Task

Create a remediation plan for package: **$0**

## Steps

### 1. Find package in triage table

Read `.scr/context/scan/vulnerabilities_triage.md`

Find rows where Upgradeable Package = "$0" and Remediation Status = "pending".

If not found: Output "Package $0 not found or already remediated." and **STOP**.

### 2. Spawn planner

```
task(
    description="Create remediation plan for $0",
    prompt="Create remediation plan for $0",
    agent_type="remediation-planner"
)
```

### 3. Create state file

After planner completes, create `.scr/context/remediation/$0/state.json`:
```json
{"package": "$0", "phase": "awaiting_approval"}
```

### 4. Output summary

```
## Remediation Plan Created

**Package:** $0

### Next Steps

1. Review: cat .scr/context/remediation/$0/plan.md
2. Execute: /approve $0
3. Cancel: rm -rf .scr/context/remediation/$0/
```
