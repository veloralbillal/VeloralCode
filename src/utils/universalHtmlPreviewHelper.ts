import { generateSqlPreview } from './previews/sqlPreviewHelper';
import { generateCssPreview } from './previews/cssPreviewHelper';
import { generateMarkdownPreview } from './previews/markdownPreviewHelper';
import { generateCliPreview } from './previews/cliPreviewHelper';

/**
 * Universal HTML Preview Generator.
 * Dispatches code directly to clean, banner-free preview engines.
 */
export function generateUniversalHtmlPreview(code: string, language: string, title: string = 'Tool'): string {
  // 1. If the code is already a complete HTML document, render directly
  if (code.includes('<html') || code.includes('<!DOCTYPE') || (code.includes('<body') && code.includes('</body>'))) {
    return code;
  }

  // 2. CSS Preview
  if (language === 'CSS') {
    return generateCssPreview(code, title);
  }

  // 3. SQL Studio Preview
  if (language === 'SQL') {
    return generateSqlPreview(code, title);
  }

  // 4. Markdown Preview
  if (language === 'Markdown') {
    return generateMarkdownPreview(code, title);
  }

  // 5. CLI & Execution Output (Bash, PHP, Java, C, C++, JSON, XML, etc.)
  return generateCliPreview(code, language, title);
}
