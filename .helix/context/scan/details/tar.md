# tar - Vulnerability Details
**Package to Upgrade:** `tar`
**Total Vulnerabilities:** 6
**Severity Breakdown:** 0 Critical, 5 High, 1 Medium, 0 Low

## Affected Lockfiles
- `grocery-infra/package-lock.json`

## Summary
These vulnerabilities are in transitive dependencies. Upgrade `tar` in package.json to fix them.

## Vulnerabilities

### tar
**Vulnerable Package:** `tar`
**CVE Count:** 6

#### GHSA-3jfq-g458-7qm9
**Severity:** HIGH
**CVSS Score:** 8.2

**Dependency Chain:** tar

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

**Fixed In:** 3.2.2, 4.4.14, 5.0.6 (and 1 more)

**Direct Upgrade:** `npm install tar@3.2.2` (adds as direct dependency)

**References:**
- https://github.com/npm/node-tar/security/advisories/GHSA-3jfq-g458-7qm9
- https://nvd.nist.gov/vuln/detail/CVE-2021-32804
- https://github.com/npm/node-tar/commit/1f036ca23f64a547bdd6c79c1a44bc62e8115da4
- https://cert-portal.siemens.com/productcert/pdf/ssa-389290.pdf
- https://github.com/npm/node-tar
- ... and 3 more

---

#### GHSA-5955-9wpr-37jh
**Severity:** HIGH
**CVSS Score:** 8.2

**Dependency Chain:** tar

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

**References:**
- https://github.com/npm/node-tar/security/advisories/GHSA-5955-9wpr-37jh
- https://nvd.nist.gov/vuln/detail/CVE-2021-37713
- https://github.com/isaacs/node-tar/commit/52b09e309bcae0c741a7eb79a17ef36e7828b946
- https://github.com/isaacs/node-tar/commit/82eac952f7c10765969ed464e549375854b26edc
- https://github.com/isaacs/node-tar/commit/875a37e3ec031186fc6599f6807341f56c584598
- ... and 4 more

---

#### GHSA-9r2w-394v-53qc
**Severity:** HIGH
**CVSS Score:** 8.2

**Dependency Chain:** tar

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

**References:**
- https://github.com/npm/node-tar/security/advisories/GHSA-9r2w-394v-53qc
- https://nvd.nist.gov/vuln/detail/CVE-2021-37701
- https://cert-portal.siemens.com/productcert/pdf/ssa-389290.pdf
- https://github.com/npm/node-tar
- https://lists.debian.org/debian-lts-announce/2022/12/msg00023.html
- ... and 3 more

---

#### GHSA-qq89-hq3f-393p
**Severity:** HIGH
**CVSS Score:** 8.2

**Dependency Chain:** tar

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

**References:**
- https://github.com/npm/node-tar/security/advisories/GHSA-qq89-hq3f-393p
- https://nvd.nist.gov/vuln/detail/CVE-2021-37712
- https://github.com/isaacs/node-tar/commit/1739408d3122af897caefd09662bce2ea477533b
- https://github.com/isaacs/node-tar/commit/2f1bca027286c23e110b8dfc7efc10756fa3db5a
- https://github.com/isaacs/node-tar/commit/3aaf19b2501bbddb145d92b3322c80dcaed3c35f
- ... and 9 more

---

#### GHSA-r628-mhmh-qjhw
**Severity:** HIGH
**CVSS Score:** 8.2

**Dependency Chain:** tar

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

**Fixed In:** 3.2.3, 4.4.15, 5.0.7 (and 1 more)

**Direct Upgrade:** `npm install tar@3.2.3` (adds as direct dependency)

**References:**
- https://github.com/npm/node-tar/security/advisories/GHSA-r628-mhmh-qjhw
- https://nvd.nist.gov/vuln/detail/CVE-2021-32803
- https://github.com/isaacs/node-tar/commit/46fe35083e2676e31c4e0a81639dce6da7aaa356
- https://github.com/isaacs/node-tar/commit/5987d9a41f6bfbf1ddab1098e1fdcf1a5618f571
- https://github.com/isaacs/node-tar/commit/85d3a942b4064e4ff171f91696fced7975167349
- ... and 7 more

---

#### GHSA-f5x3-32g6-xq36
**Severity:** MODERATE
**CVSS Score:** 6.5

**Dependency Chain:** tar

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

**References:**
- https://github.com/isaacs/node-tar/security/advisories/GHSA-f5x3-32g6-xq36
- https://nvd.nist.gov/vuln/detail/CVE-2024-28863
- https://github.com/isaacs/node-tar/commit/fe8cd57da5686f8695415414bda49206a545f7f7
- https://github.com/isaacs/node-tar
- https://security.netapp.com/advisory/ntap-20240524-0005

---

#### Triage Assessment for tar

## Remediation Plan for tar

**Upgrade Decision:** Schedule

**Analysis:**
- Current version: tar 4.4.8 (observed nested under fsevents in grocery-infra/package-lock.json)
- Target version: >= 4.4.18 (fixes GHSA-5955-9wpr-37jh and GHSA-qq89-hq3f-393p) and ideally >= 6.2.1 (fixes GHSA-f5x3-32g6-xq36 DoS) to cover all advisories
- Breaking changes: No for patch-level updates within the current major; overriding transitive tar to patched versions is low risk
- Affected code: None found. No imports or requires of 'tar' in application source. tar is present only as a transitive dependency (e.g., under fsevents used by Jest/Vite/chokidar) and is used in dev tooling contexts, not production paths.

**Recommendation:**
- Accept low risk and schedule during routine dependency maintenance. Execute `npm update` in grocery-infra to refresh transitive deps and pull patched tar. If necessary, use npm "overrides" in grocery-infra/package.json to pin tar to ">=6.2.1" to address all CVEs without code changes.
- Do not add tar as a direct dependency; rely on transitive updates or overrides.

**Testing Checklist:**
- [ ] Run existing test suite (Jest/Vite)
- [ ] Verify file watching/build tooling (chokidar/fsevents) still works on developer machines
- [ ] Smoke test any scripts under grocery-infra/scripts that might interact with archives (none currently)

---

