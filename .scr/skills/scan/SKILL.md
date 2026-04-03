---
name: scan
aliases: vulnerability-scan, vulns-scan, osv-scan
description: Run a full vulnerability scan on the project
mode: security
context: fork
agents: vulnerability-scanner
---

## Your Task

Run a comprehensive vulnerability scan on this project.

## Checkpoints & Recovery

This workflow has checkpoints. If interrupted, check existing files to resume:

| Checkpoint | File/Dir | Recovery Action |
|------------|----------|-----------------|
| CP1: SBOM generated | .scr/context/scan/sbom.json | Skip to lockfile discovery |
| CP2: Lockfiles found | .scr/context/scan/scan_config.json | Skip to scanning |
| CP3: Scan complete | .scr/context/scan/osv_results/*.json | Skip to parsing |
| CP4: Results parsed | .scr/context/scan/scan_results/*.json | Skip to triage table |
| CP5: Complete | .scr/context/scan/vulnerabilities_triage.md | Report summary only |

To force a full rescan, pass `force_rescan=true`.

## Phase 1: Check Prerequisites

1. Check if .scr/context/scan/ exists with recent results
2. If results exist and not force_rescan, skip to reporting
3. Otherwise proceed with full scan

## Phase 2: Discover Lockfiles

Find all lockfiles in the project:
```bash
find . -name "package-lock.json" -o -name "yarn.lock" -o -name "pnpm-lock.yaml" | grep -v node_modules
```

**Handle Conflicts:** If both package-lock.json AND yarn.lock exist in same directory:
- Check .scr/context/scan_config.json for saved preference
- If no preference, ask user: "Found both package-lock.json and yarn.lock in {dir}. Which package manager does your team use?"
- Save choice to scan_config.json for future runs

## Phase 3: Run vulnerability_scanner Tool

Call the vulnerability_scanner tool with discovered lockfiles:
```
vulnerability_scanner(lockfile_paths=[...], force_rescan=false)
```

The tool runs a 5-stage automated pipeline:
- Stage 0: Generate SBOM using Syft → sbom.json
- Stage 1: Scan lockfiles with OSV-Scanner → osv_results/*.json
- Stage 2: Parse results, calculate dependency chains → scan_results/*.json
- Stage 3: Generate per-package detail files → details/*.md
- Stage 4: Create triage table and VEX document → vulnerabilities_triage.md, vex.json

**DO NOT** manually read or create these files - the tool handles everything.

## Phase 4: Report Summary

After the tool completes, report:
1. Total vulnerabilities by severity (Critical, High, Medium, Low)
2. Affected packages grouped by upgradeable dependency
3. Location of generated files for user review:
   - .scr/context/scan/vulnerabilities_triage.md (main overview)
   - .scr/context/scan/details/ (per-package analysis)

## Output Files

| File | Purpose |
|------|---------|
| sbom.json | CycloneDX SBOM of all dependencies |
| osv_results/ | Raw OSV-Scanner JSON output |
| scan_results/ | Parsed results with dependency chains |
| details/*.md | Per-package vulnerability details |
| vulnerabilities_triage.md | Master tracking table |
| vex.json | Machine-readable VEX document |

## Next Steps

Run `/triage` to analyze codebase impact of found vulnerabilities.
