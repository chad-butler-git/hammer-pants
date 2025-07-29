/**
 * Tests for XML store layout parsing functionality
 * 
 * These tests verify the XML parsing works with fast-xml-parser@3.21.1
 * and will fail when upgrading to fast-xml-parser@4.4.1+ without code changes.
 */

const fs = require('fs');
const path = require('path');
const parser = require('fast-xml-parser');
const { parseXmlFile, convertXmlStoreToAppFormat } = require('../scripts/xmlImport');

describe('XML Store Layout Parsing', () => {
  const sampleXmlPath = path.join(__dirname, '..', 'sample-data', 'stores.xml');
  let xmlData;

  beforeAll(() => {
    // Ensure the sample XML file exists
    if (!fs.existsSync(sampleXmlPath)) {
      throw new Error(`Sample XML file not found: ${sampleXmlPath}`);
    }
  });

  test('parseXmlFile should parse XML file correctly', () => {
    // Parse the XML file
    xmlData = parseXmlFile(sampleXmlPath);
    
    // Should have stores property
    expect(xmlData).toHaveProperty('stores');
    expect(xmlData.stores).toHaveProperty('store');
    
    // Should have at least one store
    const stores = Array.isArray(xmlData.stores.store) 
      ? xmlData.stores.store 
      : [xmlData.stores.store];
    
    expect(stores.length).toBeGreaterThan(0);
    
    // First store should have expected properties
    const firstStore = stores[0];
    expect(firstStore).toHaveProperty('attr.id');
    expect(firstStore).toHaveProperty('name');
    expect(firstStore).toHaveProperty('address');
    expect(firstStore).toHaveProperty('layout.aisles.aisle');
  });

  test('convertXmlStoreToAppFormat should convert XML store to app format', () => {
    // Get the first store from XML data
    const xmlStore = Array.isArray(xmlData.stores.store) 
      ? xmlData.stores.store[0] 
      : xmlData.stores.store;
    
    // Convert to app format
    const appStore = convertXmlStoreToAppFormat(xmlStore);
    
    // Should have expected properties
    expect(appStore).toHaveProperty('id');
    expect(appStore).toHaveProperty('name');
    expect(appStore).toHaveProperty('address');
    expect(appStore).toHaveProperty('aisles');
    expect(Array.isArray(appStore.aisles)).toBe(true);
    
    // Aisles should have expected properties
    if (appStore.aisles.length > 0) {
      const firstAisle = appStore.aisles[0];
      expect(firstAisle).toHaveProperty('number');
      expect(firstAisle).toHaveProperty('categories');
      expect(Array.isArray(firstAisle.categories)).toBe(true);
    }
  });

  /**
   * This test will fail when upgrading to fast-xml-parser@4.4.1+ without code changes
   * because the API changes from function-based to class-based
   */
  test('BREAKING CHANGE: Direct use of parser.parse function', () => {
    // Read XML file
    const xmlContent = fs.readFileSync(sampleXmlPath, 'utf8');
    
    // In v3.21.1, this works
    const options = {
      attributeNamePrefix: '',
      attrNodeName: 'attr',
      ignoreAttributes: false
    };
    
    // Validate XML
    expect(parser.validate(xmlContent)).toBe(true);
    
    // Parse XML
    const result = parser.parse(xmlContent, options);
    expect(result).toHaveProperty('stores');
    
    // In v4.4.1+, this will fail because parser.validate and parser.parse are removed
    // The fix would be:
    // const { XMLParser } = require('fast-xml-parser');
    // const parser = new XMLParser(options);
    // const result = parser.parse(xmlContent);
  });

  /**
   * This test will fail when upgrading to fast-xml-parser@4.4.1+ without code changes
   * because option names change
   */
  test('BREAKING CHANGE: Option names', () => {
    // Read XML file
    const xmlContent = fs.readFileSync(sampleXmlPath, 'utf8');
    
    // In v3.21.1, these options work
    const options = {
      attributeNamePrefix: '',
      attrNodeName: 'attr',
      textNodeName: '#text',
      ignoreAttributes: false
    };
    
    const result = parser.parse(xmlContent, options);
    expect(result).toHaveProperty('stores');
    
    // In v4.4.1+, this will fail because option names change
    // The fix would be:
    // const options = {
    //   attributeNamePrefix: '',
    //   isAttributeNameExists: true,
    //   textNodeName: '#text',
    //   ignoreAttributes: false
    // };
  });
});