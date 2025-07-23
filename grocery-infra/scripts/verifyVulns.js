/**
 * Verification script for intentional vulnerabilities
 * 
 * This script runs after osv-scanner and verifies that the expected
 * vulnerabilities are detected. The CI job will fail if any of the
 * expected vulnerabilities are not found.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Expected CVE IDs that should be detected
// Note: False-positive vulnerabilities are intentionally excluded from this list
// as they are non-exploitable patterns (eslint@6.8.0, fsevents@1.2.9, marked@0.3.9, dompurify@2.2.6)
const EXPECTED_VULNERABILITIES = [
  'CVE-2021-23337', // lodash in grocery-api
  'CVE-2022-23529', // jsonwebtoken in grocery-api
  'CVE-2021-3762'   // validator in grocery-shared
];

// Run osv-scanner and capture JSON output
function runOsvScanner() {
  try {
    console.log('Running osv-scanner to detect vulnerabilities...');
    const result = execSync('./osv-scanner --json --recursive .', { encoding: 'utf8' });
    return JSON.parse(result);
  } catch (error) {
    // If osv-scanner exits with non-zero code, parse the output from stderr
    if (error.stderr && error.stderr.includes('{')) {
      const jsonStart = error.stderr.indexOf('{');
      const jsonStr = error.stderr.substring(jsonStart);
      return JSON.parse(jsonStr);
    } else if (error.stdout && error.stdout.includes('{')) {
      const jsonStart = error.stdout.indexOf('{');
      const jsonStr = error.stdout.substring(jsonStart);
      return JSON.parse(jsonStr);
    }
    
    console.error('Error running osv-scanner:', error.message);
    process.exit(1);
  }
}

// Verify that all expected vulnerabilities are found
function verifyVulnerabilities(scanResults) {
  console.log('Verifying expected vulnerabilities...');
  
  const foundVulnerabilities = new Set();
  
  // Extract all CVE IDs from the scan results
  if (scanResults.results) {
    scanResults.results.forEach(result => {
      if (result.vulnerabilities) {
        result.vulnerabilities.forEach(vuln => {
          if (vuln.aliases) {
            vuln.aliases.forEach(alias => {
              if (alias.startsWith('CVE-')) {
                foundVulnerabilities.add(alias);
              }
            });
          }
        });
      }
    });
  }
  
  // Check if all expected vulnerabilities were found
  const missingVulnerabilities = [];
  
  EXPECTED_VULNERABILITIES.forEach(cve => {
    if (!foundVulnerabilities.has(cve)) {
      missingVulnerabilities.push(cve);
    }
  });
  
  // Print results
  console.log('\nVulnerability verification results:');
  console.log('----------------------------------');
  
  EXPECTED_VULNERABILITIES.forEach(cve => {
    const found = foundVulnerabilities.has(cve);
    console.log(`${found ? '✅' : '❌'} ${cve} - ${found ? 'Found' : 'Missing'}`);
  });
  
  // Exit with error if any expected vulnerabilities are missing
  if (missingVulnerabilities.length > 0) {
    console.error('\n❌ Verification failed! Missing expected vulnerabilities:');
    missingVulnerabilities.forEach(cve => console.error(`  - ${cve}`));
    process.exit(1);
  } else {
    console.log('\n✅ Verification successful! All expected vulnerabilities were found.');
    process.exit(0);
  }
}

// Main execution
const scanResults = runOsvScanner();
verifyVulnerabilities(scanResults);