/**
 * Embedded CSS styles and font includes for the Python Web Live Preview.
 */

export const PYTHON_PREVIEW_STYLES = `
  body {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #f1f5f9;
    background-color: #030712;
  }
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    background: #0b0f19;
  }
  ::-webkit-scrollbar-thumb {
    background: #1e293b;
    border-radius: 9999px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #334155;
  }
  .glow-border {
    box-shadow: 0 0 15px -3px rgba(16, 185, 129, 0.15);
  }
`;
