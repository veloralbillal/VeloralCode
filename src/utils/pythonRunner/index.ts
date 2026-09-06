import { parsePythonCode } from './pythonExtractor';
import { buildPythonHtmlDocument } from './pythonTemplateGenerator';

/**
 * Generates an interactive, responsive Web Live Preview UI for any Python script.
 */
export function generatePythonHtmlPreview(code: string, title: string): string {
  const metadata = parsePythonCode(code);
  return buildPythonHtmlDocument(code, title, metadata);
}

export * from './pythonExtractor';
export * from './pythonTemplateGenerator';
export * from './pythonUiStyles';
export * from './pythonClientScript';
