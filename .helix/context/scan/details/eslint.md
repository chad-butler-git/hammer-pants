# eslint - Vulnerability Details
**Package to Upgrade:** `eslint`
**Total Vulnerabilities:** 2
**Severity Breakdown:** 0 Critical, 0 High, 1 Medium, 1 Low

## Affected Lockfiles
- `grocery-api/package-lock.json`

## Summary
These vulnerabilities are in transitive dependencies. Upgrade `eslint` in package.json to fix them.

## Vulnerabilities

### js-yaml
**Vulnerable Package:** `js-yaml`
**CVE Count:** 1

#### GHSA-mh29-5h37-fv8m
**Severity:** MODERATE
**CVSS Score:** 5.3

**Dependency Chain:** grocery-api → eslint → js-yaml

**Summary:** js-yaml has prototype pollution in merge (<<)

**Details:** ### Impact

In js-yaml 4.1.0, 4.0.0, and 3.14.1 and below, it's possible for an attacker to modify the prototype of the result of a parsed yaml document via prototype pollution (`__proto__`). All users who parse untrusted yaml documents may be impacted.

### Patches

Problem is patched in js-yaml 4.1.1 and 3.14.2.

### Workarounds

You can protect against this kind of attack on the server by using `node --disable-proto=delete` or `deno` (in Deno, pollution protection is on by default).

### References

https://cheatsheetseries.owasp.org/cheatsheets/Prototype_Pollution_Prevention_Cheat_Sheet.html

**Fixed In:** 4.1.1, 3.14.2

**Direct Upgrade:** `npm install js-yaml@4.1.1` (adds as direct dependency)

**Suggested Fix:** npm install eslint@latest (upgrade parent - triage will determine best version)

**References:**
- https://github.com/nodeca/js-yaml/security/advisories/GHSA-mh29-5h37-fv8m
- https://nvd.nist.gov/vuln/detail/CVE-2025-64718
- https://github.com/nodeca/js-yaml/commit/383665ff4248ec2192d1274e934462bb30426879
- https://github.com/nodeca/js-yaml/commit/5278870a17454fe8621dbd8c445c412529525266
- https://github.com/nodeca/js-yaml

---

#### Triage Assessment for js-yaml

**Status:** completed

## Remediation Plan for js-yaml

**Upgrade Decision:** Schedule (dev-only safe upgrade)

**Analysis:**
- Current version: indirect via eslint (devDependencies)
- Target version: eslint release that resolves to js-yaml >= 4.1.1, or enforce js-yaml >= 4.1.1 via overrides/resolutions
- Breaking changes: No (patch/minor)
- Affected code: No direct imports of js-yaml in our application src. Usage is within eslint internals during linting only; not reachable in production runtime.

**Recommendation:**
- Upgrade eslint within the current major or add overrides to pin js-yaml >= 4.1.1. Accept Low risk until the scheduled dependency refresh.

**Testing Checklist:**
- [ ] Run ESLint locally/CI and ensure configs load
- [ ] CI green

---


### tmp
**Vulnerable Package:** `tmp`
**CVE Count:** 1

#### GHSA-52f5-9888-hmc6
**Severity:** LOW
**CVSS Score:** 2.5

**Dependency Chain:** grocery-api → eslint → inquirer → external-editor → tmp

**Summary:** tmp allows arbitrary temporary file / directory write via symbolic link `dir` parameter

**Details:** ### Summary

`tmp@0.2.3` is vulnerable to an Arbitrary temporary file / directory write via symbolic link `dir` parameter.


### Details

According to the documentation there are some conditions that must be held:

```
// https://github.com/raszi/node-tmp/blob/v0.2.3/README.md?plain=1#L41-L50

Other breaking changes, i.e.

- template must be relative to tmpdir
- name must be relative to tmpdir
- dir option must be relative to tmpdir //<-- this assumption can be bypassed using symlinks

are still in place.

In order to override the system's tmpdir, you will have to use the newly
introduced tmpdir option.


// https://github.com/raszi/node-tmp/blob/v0.2.3/README.md?plain=1#L375
* `dir`: the optional temporary directory that must be relative to the system's default temporary directory.
     absolute paths are fine as long as they point to a location under the system's default temporary directory.
     Any directories along the so specified path must exist, otherwise a ENOENT error will be thrown upon access, 
     as tmp will not check the availability of the path, nor will it establish the requested path for you.
```

Related issue: https://github.com/raszi/node-tmp/issues/207.


The issue occurs because `_resolvePath` does not properly handle symbolic link when resolving paths:
```js
// https://github.com/raszi/node-tmp/blob/v0.2.3/lib/tmp.js#L573-L579
function _resolvePath(name, tmpDir) {
  if (name.startsWith(tmpDir)) {
    return path.resolve(name);
  } else {
    return path.resolve(path.join(tmpDir, name));
  }
}
```

If the `dir` parameter points to a symlink that resolves to a folder outside the `tmpDir`, it's possible to bypass the `_assertIsRelative` check used in `_assertAndSanitizeOptions`:
```js
// https://github.com/raszi/node-tmp/blob/v0.2.3/lib/tmp.js#L590-L609
function _assertIsRelative(name, option, tmpDir) {
  if (option === 'name') {
    // assert that name is not absolute and does not contain a path
    if (path.isAbsolute(name))
      throw new Error(`${option} option must not contain an absolute path, found "${name}".`);
    // must not fail on valid .<name> or ..<name> or similar such constructs
    let basename = path.basename(name);
    if (basename === '..' || basename === '.' || basename !== name)
      throw new Error(`${option} option must not contain a path, found "${name}".`);
  }
  else { // if (option === 'dir' || option === 'template') {
    // assert that dir or template are relative to tmpDir
    if (path.isAbsolute(name) && !name.startsWith(tmpDir)) {
      throw new Error(`${option} option must be relative to "${tmpDir}", found "${name}".`);
    }
    let resolvedPath = _resolvePath(name, tmpDir); //<--- 
    if (!resolvedPath.startsWith(tmpDir))
      throw new Error(`${option} option must be relative to "${tmpDir}", found "${resolvedPath}".`);
  }
}
```


### PoC

The following PoC demonstrates how writing a tmp file on a folder outside the `tmpDir` is possible.
Tested on a Linux machine.

- Setup: create a symbolic link inside the `tmpDir` that points to a directory outside of it
```bash
mkdir $HOME/mydir1

ln -s $HOME/mydir1 ${TMPDIR:-/tmp}/evil-dir
```

- check the folder is empty:
```bash
ls -lha $HOME/mydir1 | grep "tmp-"
```

- run the poc
```bash
node main.js
File:  /tmp/evil-dir/tmp-26821-Vw87SLRaBIlf
test 1: ENOENT: no such file or directory, open '/tmp/mydir1/tmp-[random-id]'
test 2: dir option must be relative to "/tmp", found "/foo".
test 3: dir option must be relative to "/tmp", found "/home/user/mydir1".
```

- the temporary file is created under `$HOME/mydir1` (outside the `tmpDir`):
```bash
ls -lha $HOME/mydir1 | grep "tmp-"
-rw------- 1 user user    0 Apr  X XX:XX tmp-[random-id]
```


- `main.js`
```js
// npm i tmp@0.2.3

const tmp = require('tmp');

const tmpobj = tmp.fileSync({ 'dir': 'evil-dir'});
console.log('File: ', tmpobj.name);

try {
    tmp.fileSync({ 'dir': 'mydir1'});
} catch (err) {
    console.log('test 1:', err.message)
}

try {
    tmp.fileSync({ 'dir': '/foo'});
} catch (err) {
    console.log('test 2:', err.message)
}

try {
    const fs = require('node:fs');
    const resolved = fs.realpathSync('/tmp/evil-dir');
    tmp.fileSync({ 'dir': resolved});
} catch (err) {
    console.log('test 3:', err.message)
}
```


A Potential fix could be to call `fs.realpathSync` (or similar) that resolves also symbolic links.
```js
function _resolvePath(name, tmpDir) {
  let resolvedPath;
  if (name.startsWith(tmpDir)) {
    resolvedPath = path.resolve(name);
  } else {
    resolvedPath = path.resolve(path.join(tmpDir, name));
  }
  return fs.realpathSync(resolvedPath);
}
```


### Impact

Arbitrary temporary file / directory write via symlink

**Fixed In:** 0.2.4

**Direct Upgrade:** `npm install tmp@0.2.4` (adds as direct dependency)

**Suggested Fix:** npm install eslint@latest (upgrade parent - triage will determine best version)

**References:**
- https://github.com/raszi/node-tmp/security/advisories/GHSA-52f5-9888-hmc6
- https://nvd.nist.gov/vuln/detail/CVE-2025-54798
- https://github.com/raszi/node-tmp/issues/207
- https://github.com/raszi/node-tmp/commit/188b25e529496e37adaf1a1d9dccb40019a08b1b
- https://github.com/raszi/node-tmp
- ... and 1 more

---

#### Triage Assessment for tmp

**Status:** completed

## Remediation Plan for tmp

**Upgrade Decision:** Schedule (dev-only safe upgrade)

**Analysis:**
- Current version: eslint 6.8.0 (devDependencies)
- Target version: enforce tmp >= 0.2.4 via npm overrides/resolutions; optionally upgrade eslint to a maintained version that resolves tmp >= 0.2.4
- Breaking changes: No (using overrides for tmp). Note: upgrading eslint from 6.x to current is a major upgrade and may introduce breaking changes to lint config; treat that as a separate tooling refresh.
- Affected code: No application imports of eslint/inquirer/external-editor/tmp in grocery-api src; usage is limited to ESLint CLI during local linting/CI. Not reachable in production runtime.

**Recommendation:**
- Add an overrides entry to package.json (at workspace root or grocery-api) to pin tmp to ">=0.2.4" and run npm install. Example:
  "overrides": { "tmp": ">=0.2.4" }
- Schedule an eslint major version upgrade in a follow-up to remove the override and align with maintained versions.

**Testing Checklist:**
- [ ] Run ESLint locally and in CI to confirm normal operation
- [ ] Verify CI is green
- [ ] If/when upgrading ESLint later: update configs/plugins as needed and address any new lint findings

---

