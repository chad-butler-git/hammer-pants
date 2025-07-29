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
const { parseXmlFile } = require('./xmlImport');

// Expected CVE IDs that should be detected
// Note: False-positive vulnerabilities are intentionally excluded from this list
// as they are non-exploitable patterns (eslint@6.8.0, fsevents@1.2.9, marked@0.3.9, dompurify@2.2.6)
const EXPECTED_VULNERABILITIES = [
  'CVE-2021-23337', // lodash in grocery-api
  'CVE-2022-23529', // jsonwebtoken in grocery-api
  'CVE-2021-3762',  // validator in grocery-shared
  'CVE-2024-41818', // fast-xml-parser in grocery-infra
  'CVE-2022-21680', // marked in grocery-shared
  'CVE-2022-21648'  // marked in grocery-shared
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

/**
 * Test XML parsing functionality to ensure it's part of the data flow
 * This ensures the fast-xml-parser vulnerability is actually exploitable
 */
function testXmlParsing() {
  console.log('Testing XML parsing functionality...');
  
  try {
    // Path to the XML file
    const xmlFilePath = path.join(__dirname, '..', 'sample-data', 'stores.xml');
    
    // Check if the XML file exists
    if (!fs.existsSync(xmlFilePath)) {
      console.error('❌ XML file not found:', xmlFilePath);
      return false;
    }
    
    // Parse the XML file
    const xmlData = parseXmlFile(xmlFilePath);
    
    // Verify that the XML was parsed correctly
    if (xmlData && xmlData.stores && xmlData.stores.store) {
      const storeCount = Array.isArray(xmlData.stores.store)
        ? xmlData.stores.store.length
        : 1;
      
      console.log(`✅ Successfully parsed ${storeCount} stores from XML`);
      return true;
    } else {
      console.error('❌ Failed to parse XML data correctly');
      return false;
    }
  } catch (error) {
    console.error('❌ Error testing XML parsing:', error.message);
    return false;
  }
}

// Main execution
console.log('Verifying vulnerabilities and testing functionality...');

// Test XML parsing to ensure it's part of the data flow
const xmlParsingWorks = testXmlParsing();

// Run vulnerability scanner
const scanResults = runOsvScanner();
verifyVulnerabilities(scanResults);

// Final check
if (!xmlParsingWorks) {
  console.error('\n❌ XML parsing test failed. The fast-xml-parser vulnerability may not be exploitable.');
  process.exit(1);
}