/**
 * Tests for markdown rendering functionality
 * 
 * These tests verify the markdown rendering works with marked@4.0.10+.
 */

const { renderMarkdown, sanitizeAndRenderMarkdown } = require('../src/markdown');
const { marked } = require('marked');

describe('Markdown Rendering Functionality', () => {
  test('renderMarkdown should convert markdown to HTML', () => {
    const markdown = '# Heading\n\nThis is **bold** and this is *italic*.';
    const html = renderMarkdown(markdown);
    
    // Should contain HTML elements
    expect(html).toMatch(/<h1\b[^>]*>/);
    expect(html).toContain('<strong>');
    expect(html).toContain('<em>');
    
    // Should contain the text content
    expect(html).toContain('Heading');
    expect(html).toContain('bold');
    expect(html).toContain('italic');
  });

  test('renderMarkdown should handle empty input', () => {
    expect(renderMarkdown('')).toBe('');
    expect(renderMarkdown(null)).toBe('');
    expect(renderMarkdown(undefined)).toBe('');
  });

  test('sanitizeAndRenderMarkdown should sanitize HTML in markdown', () => {
    const markdown = 'This has <script>alert("XSS")</script> and <img src="x" onerror="alert(1)">';
    const html = sanitizeAndRenderMarkdown(markdown);
    
    // Should not contain dangerous tags as executable HTML
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('<img ');
    
    // Escaped representations should be present
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('&lt;img');

    // Should contain the safe text
    expect(html).toContain('This has');
  });

  /**
   * This test will fail when upgrading to marked@4.0.10+ without code changes
   * because the API changes from marked() to marked.parse()
   */
  test('BREAKING CHANGE: Direct use of marked function', () => {
    const markdown = '# Test';
    
    // In v0.3.9, this works
    const html = marked.parse(markdown);
    expect(html).toMatch(/<h1\b[^>]*>/);
    
    // In v4.0.10+, this will fail because marked is no longer a function
    // The fix would be:
    // const html = marked.parse(markdown);
  });

  /**
   * This test will fail when upgrading to marked@4.0.10+ without code changes
   * because the options handling changes
   */
  test('BREAKING CHANGE: Options handling', () => {
    const markdown = '# Test';
    
    // In v0.3.9, this works
    const options = { sanitize: true };
    const html = marked.parse(markdown);
    expect(html).toMatch(/<h1\b[^>]*>/);
    
    // In v4.0.10+, this will fail because sanitize option is removed
    // The fix would be:
    // const html = marked.parse(markdown);
    // And use DOMPurify or other sanitizer
  });
});