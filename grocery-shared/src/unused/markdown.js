/**
 * Markdown processing utility (UNUSED)
 * 
 * This file is intentionally not imported or used anywhere in the application.
 * It exists as an example of a false-positive security vulnerability pattern.
 * The vulnerable marked@0.3.9 package is imported but never actually used in
 * production code.
 */

const marked = require('marked');

/**
 * Converts markdown text to HTML
 * @param {string} markdownText - The markdown text to convert
 * @returns {string} The HTML representation of the markdown
 */
function convertMarkdownToHtml(markdownText) {
  // This function is never called from anywhere in the application
  return marked(markdownText);
}

/**
 * Sanitizes markdown before converting to HTML
 * @param {string} markdownText - The markdown text to sanitize and convert
 * @returns {string} The sanitized HTML
 */
function sanitizeAndConvertMarkdown(markdownText) {
  // Basic sanitization (this is insufficient for real XSS protection)
  const sanitized = markdownText
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  return convertMarkdownToHtml(sanitized);
}

// These functions are never exported or used