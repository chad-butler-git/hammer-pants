# Task Masterplan

## Session Metadata
| Field | Value |
|-------|-------|
| Objective | Scan all package-lock.json files in the repository and generate a vulnerabilities_triage.md document with findings and severity classifications. |
| Context | Repository contains multiple package-lock.json files. Scans will be performed by a dedicated vulnerability_scanner agent. Raw scan results will be stored under .helix/context/scan/. The masterplan defines discovery, scanning, reporting, and review tasks. |
| Created | 2025-10-02T12:00:00Z |
| Status | PLANNING_COMPLETE |

## Task Execution Table (Standard Format)

| ID | Title | Status | Dependencies | Priority | Type | Agent/Tool | Description | Test Strategy |
|----|-------|--------|--------------|----------|------|------------|-------------|---------------|
| 1 | Discover package-lock.json paths | completed | [] | high | COMPLEX_ANALYSIS | file_discovery_agent | Discover all package-lock.json files in the repository and record their full repo-relative paths to .helix/context/scan/lockfile_paths.json | Verify .helix/context/scan/lockfile_paths.json exists, is valid JSON array, and each path points to an existing file in the repo. |
| 2 | Spawn vulnerability_scanner to scan lockfiles | completed | [1] | high | COMPLEX_ANALYSIS | vulnerability_scanner | Trigger vulnerability_scanner agent with the discovered lockfile paths. Persist raw scan output to .helix/context/scan/scan_results.json (structured JSON). | Verify .helix/context/scan/scan_results.json exists, is valid JSON with per-file scan sections, and contains vulnerability entries with at least fields: id, package, version, severity, description, location (file). |
| 3 | Generate vulnerabilities_triage.md summary report | completed | [2] | high | FEATURE_DEVELOPMENT | report_generator | Consume .helix/context/scan/scan_results.json and produce .helix/context/scan/vulnerabilities_triage.md summarizing findings, grouping by severity (critical/high/medium/low), and including per-file notes and recommended triage actions. | Verify .helix/context/scan/vulnerabilities_triage.md exists, contains an executive summary, severity summary counts, per-file sections linking to raw scan entries, and clear recommended actions for top severity items. |
| 4 | Review and finalize the report | completed | [3] | medium | COMPLEX_ANALYSIS | human_reviewer | Review the generated vulnerabilities_triage.md for clarity, completeness, and accuracy. Make minor edits if needed and mark final status. Optionally approve to publish in repository or attach to issue tracking. | Verify a finalized vulnerabilities_triage.md with reviewer sign-off (a review section with reviewer name and timestamp) and no TODO placeholders remain. |

## Task Queue (Execution-Ordered Table — Required Fields)

| id | content (imperative) | active_form | status | assignee |
|----|----------------------|-------------|--------|----------|
| 1 | Discover all package-lock.json files in the repository and record their full repo-relative paths to .helix/context/scan/lockfile_paths.json | continuous | completed | file_discovery_agent |
| 2 | Spawn the vulnerability_scanner agent to scan the discovered lockfiles and write raw results to .helix/context/scan/scan_results.json | continuous | completed | vulnerability_scanner |
| 3 | Generate .helix/context/scan/vulnerabilities_triage.md summarizing scan findings with severity classifications and per-file notes (consume scan_results.json) | continuous | completed | report_generator |
| 4 | Review and finalize .helix/context/scan/vulnerabilities_triage.md; add reviewer sign-off and ensure report is publication-ready | continuous | completed | human_reviewer |


## Individual Task Sections (Actions, Inputs, Outputs, Verification)

### Task 1 — Discover package-lock.json paths
- ID: 1
- Assignee: file_discovery_agent
- Status: completed
- Goal: Produce a canonical list of all package-lock.json files under repo root and save to .helix/context/scan/lockfile_paths.json
- Expected actions:
  1. Recursively search the repository from the repo root for filenames exactly named package-lock.json.
  2. Record each discovered path as a repo-relative path (e.g., "services/api/package-lock.json").
  3. Write the list as a JSON array to .helix/context/scan/lockfile_paths.json. Create parent directories if they do not exist.
- Files to read:
  - none required (repository filesystem scan)
- Files to write:
  - .helix/context/scan/lockfile_paths.json (JSON array of strings)
- Verification / Test Strategy:
  - Confirm file .helix/context/scan/lockfile_paths.json exists.
  - Validate JSON syntax and that it is an array of non-empty strings.
  - For each entry, confirm the referenced file exists in the repository filesystem.
  - If zero files are found, create an empty JSON array and include a note in scan_results.json (task 2 should handle zero-files case gracefully).

### Task 2 — Spawn vulnerability_scanner agent to scan lockfiles
- ID: 2
- Assignee: vulnerability_scanner
- Status: completed
- Dependency: Task 1 must complete and .helix/context/scan/lockfile_paths.json must be present.
- Goal: Run automated vulnerability scanning for each discovered package-lock.json and save raw structured results to .helix/context/scan/scan_results.json
- Expected actions:
  1. Read .helix/context/scan/lockfile_paths.json to obtain lockfile paths.
  2. For each lockfile, invoke the scanner to analyze dependencies and collect vulnerability findings.
  3. Normalize the scanner output into a repository-wide JSON structure with per-file sections. Each vulnerability entry should contain at minimum: id, package, version, severity (one of: critical/high/medium/low/unknown), description, and file path.
  4. Write the aggregate results to .helix/context/scan/scan_results.json. Create parent directories if needed.
  5. If no lockfiles were discovered, write an explicit note in scan_results.json indicating no files scanned.
- Files to read:
  - .helix/context/scan/lockfile_paths.json
  - the package-lock.json files referenced in that list (scanner agent will open them)
- Files to write:
  - .helix/context/scan/scan_results.json (structured JSON)
- Verification / Test Strategy:
  - Confirm .helix/context/scan/scan_results.json exists.
  - Validate JSON structure: top-level object with keys such as "scans" (array) or a mapping from file path to findings.
  - Each finding should include required fields (id, package, version, severity, description, location/file).
  - Confirm severity values normalize to the predefined buckets. If scanner provides other severities, map them to these buckets and document mapping in scan_results.json metadata.

### Task 3 — Generate vulnerabilities_triage.md summary report
- ID: 3
- Assignee: report_generator
- Status: completed
- Dependency: Task 2 must complete and .helix/context/scan/scan_results.json must be present.
- Goal: Produce a human-readable triage report at .helix/context/scan/vulnerabilities_triage.md that summarizes the findings, classifies severity, and provides per-file notes and recommended triage actions.
- Expected actions:
  1. Read .helix/context/scan/scan_results.json.
  2. Produce an executive summary with total number of files scanned, total vulnerabilities found, and counts per severity bucket (critical/high/medium/low/unknown).
  3. For each file (or grouped by package where appropriate), include a section listing vulnerabilities with: vulnerability id, package and version, severity, short description, and link/reference to the raw scan entry location in scan_results.json.
  4. Highlight Critical and High items at top with recommended immediate actions (e.g., upgrade to fixed version, apply patch, accept risk with justification), and include suggested next steps and owner recommendations.
  5. Include a methodology section describing scanner used, timestamp, and any severity mapping rules applied.
  6. Save the report to .helix/context/scan/vulnerabilities_triage.md
- Files to read:
  - .helix/context/scan/scan_results.json
- Files to write:
  - .helix/context/scan/vulnerabilities_triage.md
- Verification / Test Strategy:
  - Confirm .helix/context/scan/vulnerabilities_triage.md exists.
  - Ensure the report contains: executive summary, severity counts, per-file sections, top critical/high remediation recommendations, and a methodology section.
  - Confirm that each top-severity finding in the report corresponds to an entry in scan_results.json.

### Task 4 — Review and finalize the report
- ID: 4
- Assignee: human_reviewer
- Status: completed
- Dependency: Task 3 must complete and vulnerabilities_triage.md must be present.
- Goal: Human review for accuracy, clarity, and completeness. Finalize the report with reviewer sign-off and publish or mark ready.
- Expected actions:
  1. Open .helix/context/scan/vulnerabilities_triage.md and read its contents.
  2. Validate that critical/high items are actionable and correctly described. Spot-check a sample of medium/low entries for false positives.
  3. Edit the report to fix wording, add missing context (owners, suggested timelines), and remove any TODO placeholders.
  4. Add a Review section at the end with reviewer name, role, and timestamp of approval.
  5. Optionally, if repository workflow requires, create or link to issues/PRs for top items (this is optional and outside scope of automatic tasks unless an executing agent is instructed to do so).
- Files to read:
  - .helix/context/scan/vulnerabilities_triage.md
  - .helix/context/scan/scan_results.json (for cross-checking)
- Files to write:
  - Updated .helix/context/scan/vulnerabilities_triage.md (with reviewer sign-off)
- Verification / Test Strategy:
  - Confirm the report contains a Review section with name and timestamp.
  - Confirm no TODO placeholders remain.
  - Confirm that the reviewer has either accepted the report or documented outstanding concerns and next steps.


## File References

| Purpose | File Path | Action Required |
|---------|-----------|-----------------|
| Discovered lockfile list | .helix/context/scan/lockfile_paths.json | Write by Task 1: JSON array of repo-relative paths to package-lock.json files. |
| Raw scan results | .helix/context/scan/scan_results.json | Write by Task 2: Structured JSON containing per-file vulnerability findings and metadata (scanner, timestamp, severity mapping). |
| Human triage report | .helix/context/scan/vulnerabilities_triage.md | Write by Task 3: Markdown report summarizing findings, classifications, and recommended actions. Updated by Task 4 for reviewer sign-off. |


## Notes and Operational Constraints
- This masterplan defines planning only. Do NOT perform scanning or modify repository files now. The EXECUTION NODE will execute tasks sequentially following this plan.
- All tasks start with status: pending. The execution system should update statuses as tasks are performed.
- Agents/tools named in the assignee column are suggestions; the executor may map them to actual runtime agents (e.g., vulnerability_scanner could be an external service or in-repo scanner). Ensure scanner output adheres to the required JSON schema for downstream report generation.
- If any task encounters an unexpected state (e.g., scanner fails, output invalid), the executor should record an error note in .helix/context/scan/ and pause for human intervention.


