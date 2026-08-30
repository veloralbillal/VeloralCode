import { SupportedLanguage } from '../types';

export function generate8DigitUID(): string {
  // Generates an 8-digit numeric string between 10000000 and 99999999
  const min = 10000000;
  const max = 99999999;
  return Math.floor(min + Math.random() * (max - min + 1)).toString();
}

export function generateFormattedLicenseKey(prefix: string = 'PRO'): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const segment = (len: number) => {
    let res = '';
    for (let i = 0; i < len; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res;
  };
  const cleanPrefix = (prefix || 'PRO').trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6) || 'PRO';
  return `${cleanPrefix}-${segment(4)}-${segment(4)}-${segment(4)}`;
}

export function formatDate(timestamp: number): string {
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatDateTime(timestamp: number): string {
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function getFileExtension(language: SupportedLanguage | string): string {
  const map: Record<string, string> = {
    HTML: '.html',
    CSS: '.css',
    JavaScript: '.js',
    TypeScript: '.ts',
    JSON: '.json',
    XML: '.xml',
    PHP: '.php',
    Python: '.py',
    Java: '.java',
    C: '.c',
    'C++': '.cpp',
    SQL: '.sql',
    Bash: '.sh',
    Markdown: '.md',
  };
  return map[language] || '.txt';
}

export function getMimeType(language: SupportedLanguage | string): string {
  const map: Record<string, string> = {
    HTML: 'text/html',
    CSS: 'text/css',
    JavaScript: 'application/javascript',
    TypeScript: 'text/plain',
    JSON: 'application/json',
    XML: 'application/xml',
    PHP: 'text/x-php',
    Python: 'text/x-python',
    Java: 'text/x-java-source',
    C: 'text/x-c',
    'C++': 'text/x-c++',
    SQL: 'text/x-sql',
    Bash: 'text/x-sh',
    Markdown: 'text/markdown',
  };
  return map[language] || 'text/plain';
}

export function downloadCodeFile(title: string, code: string, language: SupportedLanguage | string) {
  const ext = getFileExtension(language);
  const cleanTitle = title.trim().toLowerCase().replace(/[^a-z0-9]/gi, '_') || 'code_snippet';
  const filename = `${cleanTitle}${ext}`;
  const blob = new Blob([code], { type: getMimeType(language) });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch {
    return false;
  }
}

export function getLanguagePrismClass(language: SupportedLanguage | string): string {
  const map: Record<string, string> = {
    HTML: 'language-markup',
    CSS: 'language-css',
    JavaScript: 'language-javascript',
    TypeScript: 'language-typescript',
    JSON: 'language-json',
    XML: 'language-markup',
    PHP: 'language-php',
    Python: 'language-python',
    Java: 'language-java',
    C: 'language-c',
    'C++': 'language-cpp',
    SQL: 'language-sql',
    Bash: 'language-bash',
    Markdown: 'language-markdown',
  };
  return map[language] || 'language-javascript';
}

export function getCategoryBadgeClass(category: string): string {
  if (!category) {
    return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
  }
  const colorPalettes = [
    'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800',
    'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800',
    'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
    'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/50 dark:text-violet-300 dark:border-violet-800',
    'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
    'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800',
    'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/50 dark:text-cyan-300 dark:border-cyan-800',
    'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800',
    'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-800',
  ];

  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colorPalettes.length;
  return colorPalettes[index];
}

export function parseFirebaseError(error: any): string {
  if (!error) return 'An unexpected error occurred.';
  const code = error.code || '';
  switch (code) {
    case 'auth/invalid-email':
      return 'The email address is invalid.';
    case 'auth/user-disabled':
      return 'This user account has been disabled.';
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please verify your credentials.';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email address.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters long.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    case 'auth/too-many-requests':
      return 'Too many failed login attempts. Please try again later.';
    case 'PERMISSION_DENIED':
      return 'Permission denied by Firebase Security Rules. Please check your admin privileges.';
    default:
      return error.message || 'Operation failed. Please try again.';
  }
}
