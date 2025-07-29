/**
 * Markdown processing utility
 * 
 * VULNERABILITY: CVE-2022-21680 / CVE-2022-21648 (marked@0.3.9)
 * This file uses the vulnerable marked@0.3.9 package for markdown rendering.
 * The vulnerability is a Regular Expression Denial of Service (ReDoS) issue.
 * 
 * When upgrading to marked@4.0.10+, the API changes significantly:
 * - marked() function becomes marked.parse()
 * - Option handling changes
 * - Renderer hooks change
 * - ESM build becomes the default
 */

const marked = require('marked');

/**
 * Converts markdown text to HTML
 * @param {string} markdownText - The markdown text to convert
 * @returns {string} The HTML representation of the markdown
 */
function renderMarkdown(markdownText) {
  if (!markdownText) {
    return '';
  }
  
  // Using the vulnerable marked@0.3.9 API
  return marked(markdownText);
}

/**
 * Sanitizes markdown before converting to HTML
 * @param {string} markdownText - The markdown text to sanitize and convert
 * @returns {string} The sanitized HTML
 */
function sanitizeAndRenderMarkdown(markdownText) {
  if (!markdownText) {
    return '';
  }
  
  // Basic sanitization (this is insufficient for real XSS protection)
  const sanitized = markdownText
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  return renderMarkdown(sanitized);
}

module.exports = {
  renderMarkdown,
  sanitizeAndRenderMarkdown
};