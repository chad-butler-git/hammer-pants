# fast-xml-parser - Vulnerability Details
**Package to Upgrade:** `fast-xml-parser`
**Total Vulnerabilities:** 1
**Severity Breakdown:** 0 Critical, 0 High, 1 Medium, 0 Low

## Affected Lockfiles
- `grocery-infra/package-lock.json`

## Summary
This is a direct dependency. Upgrade `fast-xml-parser` directly in package.json.

## Vulnerabilities

### fast-xml-parser
**Vulnerable Package:** `fast-xml-parser`
**CVE Count:** 1

#### GHSA-x3cc-x39p-42qx
**Severity:** MODERATE
**CVSS Score:** 6.5

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

**References:**
- https://github.com/NaturalIntelligence/fast-xml-parser/security/advisories/GHSA-x3cc-x39p-42qx
- https://nvd.nist.gov/vuln/detail/CVE-2023-26920
- https://github.com/NaturalIntelligence/fast-xml-parser/commit/2b032a4f799c63d83991e4f992f1c68e4dd05804
- https://gist.github.com/Sudistark/a5a45bd0804d522a1392cb5023aa7ef7
- https://github.com/NaturalIntelligence/fast-xml-parser
- ... and 1 more

---

## Remediation Plan for fast-xml-parser

**Upgrade Decision:** Upgrade now

**Analysis:**
- Current version: 3.21.1 (direct dependency in grocery-infra/package.json)
- Target version: >=4.1.2 (fix introduced), recommend 4.4.1+
- Breaking changes: Yes — v4 switches to a class-based API (XMLParser), option names and method signatures change, and parse/validate usage differs
- Affected code:
  - /home/ubuntu/helix/hammerpants/grocery-infra/scripts/xmlImport.js uses parser.validate(...) and parser.parse(...) on XML input from a file path provided via CLI (--file), which may be untrusted
  - /home/ubuntu/helix/hammerpants/grocery-infra/test/xmlImport.test.js imports fast-xml-parser and exercises parser.parse/validate

**Recommendation:**
- Update dependency in grocery-infra/package.json to fast-xml-parser@^4.4.1 (minimum fixed is 4.1.2)
- Refactor code to v4 API, e.g.:
  - Before (v3):
    - const parser = require('fast-xml-parser');
    - if (parser.validate(xml) === true) { const obj = parser.parse(xml, options); }
  - After (v4):
    - const { XMLParser } = require('fast-xml-parser');
    - const parser = new XMLParser(options);
    - const obj = parser.parse(xml);
- Add a guard to reject XML containing "__proto__" tag/attribute if any legacy paths remain.

**Testing Checklist:**
- [ ] Run existing test suite in grocery-infra
- [ ] Re-run xmlImport flow with sample data and a large/edge-case XML to validate performance and correctness
- [ ] Verify importStoreToApi still posts expected payloads (ids, aisles, categories)
- [ ] Verify no regressions in option handling (attributeNamePrefix, ignoreAttributes, parseAttributeValue)
- [ ] Add a negative test for "__proto__" tag/attribute to ensure it’s not exploitable


