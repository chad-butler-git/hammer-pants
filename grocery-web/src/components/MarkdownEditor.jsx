import { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';

/**
 * Markdown editor component with preview
 * 
 * This component uses the vulnerable marked@0.3.9 package indirectly
 * through the API to render markdown.
 */
function MarkdownEditor({ value, onChange, placeholder }) {
  const [markdown, setMarkdown] = useState(value || '');
  const [preview, setPreview] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Update local state when prop value changes
  useEffect(() => {
    setMarkdown(value || '');
  }, [value]);

  // Fetch rendered preview from API when markdown changes
  useEffect(() => {
    const fetchPreview = async () => {
      if (!markdown) {
        setPreview('');
        return;
      }

      try {
        // Simulate API call to render markdown
        // In a real implementation, this would call the API
        const response = await fetch('/api/render-markdown', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ markdown }),
        });

        if (response.ok) {
          const data = await response.json();
          // Sanitize HTML before rendering (client-side protection)
          setPreview(DOMPurify.sanitize(data.html));
        }
      } catch (error) {
        console.error('Error rendering markdown:', error);
        // Fallback to simple rendering
        setPreview(`<p>${markdown}</p>`);
      }
    };

    // For demo purposes, we'll just set a simple HTML preview
    // This simulates what would happen with the API call
    setPreview(`<p>${markdown}</p>`);
  }, [markdown]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setMarkdown(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className="markdown-editor border border-gray-300 rounded-md overflow-hidden">
      <div className="flex justify-between bg-gray-100 px-4 py-2 border-b">
        <h3 className="text-sm font-medium">Notes (Markdown)</h3>
        <div>
          <button
            type="button"
            onClick={() => setIsPreviewMode(false)}
            className={`px-3 py-1 text-xs rounded-md mr-2 ${
              !isPreviewMode ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => setIsPreviewMode(true)}
            className={`px-3 py-1 text-xs rounded-md ${
              isPreviewMode ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Preview
          </button>
        </div>
      </div>

      {isPreviewMode ? (
        <div 
          className="preview p-4 min-h-[150px] bg-white"
          dangerouslySetInnerHTML={{ __html: preview }}
        />
      ) : (
        <textarea
          value={markdown}
          onChange={handleChange}
          placeholder={placeholder || 'Add notes in markdown format...'}
          className="w-full min-h-[150px] p-4 border-none focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      )}

      <div className="bg-gray-50 px-4 py-2 border-t text-xs text-gray-500">
        Supports **bold**, *italic*, [links](url), and more.
      </div>
    </div>
  );
}

export default MarkdownEditor;