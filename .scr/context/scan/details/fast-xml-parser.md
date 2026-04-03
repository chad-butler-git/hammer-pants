# fast-xml-parser - Vulnerability Details

**Package to Upgrade:** `fast-xml-parser`

**Total Vulnerabilities:** 1

**Severity Breakdown:** 0 Critical, 0 High, 1 Medium, 0 Low

## Affected Lockfiles

- `./grocery-infra/package-lock.json`

## Summary

This is a direct dependency. Upgrade `fast-xml-parser` directly in package.json.

## Vulnerabilities

### fast-xml-parser

**Vulnerable Package:** `fast-xml-parser`

**CVE Count:** 1

#### GHSA-x3cc-x39p-42qx

**Severity:** MEDIUM

**CVSS Score:** 7.5

**Dependency Chain:** grocery-infra → fast-xml-parser

**Summary:** fast-xml-parser vulnerable to Prototype Pollution through tag or attribute name

**Details:** ### Impact
As a part of this vulnerability, user was able to se code using `__proto__` as a tag or attribute name.

```js
const { XMLParser, XMLBuilder, XMLValidator} = require("fast-xml-parser");

let XMLdata = "<__proto__><polluted>hacked</polluted></__proto__>"

const parser = new XMLParser();
let jObj = parser.parse(XMLdata);

console.log(jObj.polluted) // should return hacked
``` 

### Patches
The problem has been patched in v4.1.2

### Workarounds
User can check for "__proto__" in the XML string before parsing it to the parser.

### References
https://gist.github.com/Sudistark/a5a45bd0804d522a1392cb5023aa7ef7


**Fixed In:** 4.1.2

**Recommended Fix:** `npm install fast-xml-parser@4.1.2`

---

## Remediation Plan

**Triage Status:** Pending

**Upgrade Decision:** _To be determined by triage agent_

### Analysis

- **Current Version:** _To be determined_
- **Target Version:** _To be determined_
- **Breaking Changes:** _To be determined_
- **Affected Code:** _To be determined by codebase analysis_
- **Exposure Analysis:** _To be determined_

### Recommendation

_To be filled in by triage agent after codebase analysis_

### Testing Checklist

- [ ] Run existing test suite
- [ ] Verify no breaking changes in affected code paths
- [ ] Smoke test affected functionality

---

