/**
 * Parses Python source code to extract metadata, HTML templates,
 * imports, print outputs, and input prompts.
 */

export interface PythonMetadata {
  extractedHtml: string | null;
  prints: string[];
  imports: string[];
  hasInputs: boolean;
  inputPrompts: string[];
}

export function extractHtmlFromPython(code: string): string | null {
  const tripleQuoteMatch = code.match(
    /(?:"""|''')([\s\S]*?(?:<!DOCTYPE|<html|<body|<div|<main)[\s\S]*?)(?:"""|''')/i
  );
  if (tripleQuoteMatch && tripleQuoteMatch[1]) {
    return tripleQuoteMatch[1].trim();
  }

  const htmlVarMatch = code.match(
    /(?:html|template|markup)\s*=\s*(?:f?["']{1,3})([\s\S]*?)(?:["']{1,3})/i
  );
  if (htmlVarMatch && htmlVarMatch[1] && htmlVarMatch[1].includes('<')) {
    return htmlVarMatch[1].trim();
  }

  return null;
}

export function extractPythonPrints(code: string): string[] {
  const lines = code.split('\n');
  const outputs: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('print(') && trimmed.endsWith(')')) {
      const inside = trimmed.slice(6, -1).trim();
      if ((inside.startsWith("'") && inside.endsWith("'")) || (inside.startsWith('"') && inside.endsWith('"'))) {
        outputs.push(inside.slice(1, -1));
      } else {
        outputs.push(inside);
      }
    }
  }

  return outputs;
}

export function extractImports(code: string): string[] {
  const lines = code.split('\n');
  const packages = new Set<string>();

  for (const line of lines) {
    const trimmed = line.trim();
    const importMatch = trimmed.match(/^import\s+([a-zA-Z0-9_, ]+)/);
    const fromMatch = trimmed.match(/^from\s+([a-zA-Z0-9_]+)\s+import/);

    if (importMatch && importMatch[1]) {
      importMatch[1].split(',').forEach((pkg) => {
        const name = pkg.trim().split(' ')[0];
        if (name) packages.add(name);
      });
    } else if (fromMatch && fromMatch[1]) {
      packages.add(fromMatch[1].trim());
    }
  }

  return Array.from(packages);
}

export function extractInputPrompts(code: string): string[] {
  const matches = code.matchAll(/input\(\s*(?:["'](.*?)["'])?\s*\)/g);
  const prompts: string[] = [];
  for (const m of matches) {
    prompts.push(m[1] || 'Enter value:');
  }
  return prompts;
}

export function parsePythonCode(code: string): PythonMetadata {
  return {
    extractedHtml: extractHtmlFromPython(code),
    prints: extractPythonPrints(code),
    imports: extractImports(code),
    hasInputs: /input\s*\(/.test(code),
    inputPrompts: extractInputPrompts(code),
  };
}
