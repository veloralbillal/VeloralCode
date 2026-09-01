import React, { useState } from 'react';
import {
  Database,
  Flame,
  Shield,
  Copy,
  Check,
  Download,
  Sparkles,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';
import { SiteBrandingSettings } from './SiteBrandingSettings';
import { AdminContactSettings } from './AdminContactSettings';
import { firebaseConfig } from '../../services/firebase';
import { createNewCode } from '../../services/codeService';
import { copyTextToClipboard } from '../../utils/helpers';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { CodeItem } from '../../types';

const STARTER_SNIPPETS: Omit<CodeItem, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'createdBy' | 'creatorEmail'>[] = [
  {
    title: 'Modern Responsive Navbar with Dark Mode Toggle',
    description: 'Accessible responsive navbar with mobile hamburger menu and Tailwind CSS styling.',
    code: `import React, { useState } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dark, setDark] = useState(false);

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="font-bold text-lg text-indigo-600">DevBrand</div>
        <div className="hidden md:flex items-center gap-4 text-sm font-medium">
          <a href="#" className="text-slate-600 hover:text-indigo-600">Home</a>
          <a href="#" className="text-slate-600 hover:text-indigo-600">Components</a>
          <a href="#" className="text-slate-600 hover:text-indigo-600">Documentation</a>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setDark(!dark)} 
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {dark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden p-2 rounded-lg hover:bg-slate-100"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </nav>
  );
};`,
    language: 'JavaScript',
    category: 'Frontend Components',
    version: '1.2.0',
    tags: ['react', 'tailwind', 'navbar', 'responsive'],
    status: 'published' as const,
  },
  {
    title: 'Python Async Web Scraper & JSON Exporter',
    description: 'High-speed asynchronous HTTP web scraper using aiohttp and beautifulsoup4 with robust error handling.',
    code: `import asyncio
import aiohttp
from bs4 import BeautifulSoup
import json

async def fetch_page(session, url):
    try:
        async with session.get(url, timeout=10) as response:
            if response.status == 200:
                html = await response.text()
                soup = BeautifulSoup(html, 'html.parser')
                title = soup.title.string if soup.title else 'No Title'
                return {'url': url, 'title': title.strip()}
    except Exception as e:
        return {'url': url, 'error': str(e)}

async def main():
    urls = [
        'https://news.ycombinator.com',
        'https://github.com/trending',
        'https://dev.to'
    ]
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_page(session, url) for url in urls]
        results = await asyncio.gather(*tasks)
        
    print(json.dumps(results, indent=2))

if __name__ == '__main__':
    asyncio.run(main())`,
    language: 'Python',
    category: 'Backend Utilities',
    version: '2.0.0',
    tags: ['python', 'asyncio', 'web-scraping', 'json'],
    status: 'published' as const,
  },
  {
    title: 'Interactive Live Glassmorphism Card (HTML/CSS)',
    description: 'Clean glassmorphic glowing card styling with subtle hover animation and backdrop blur.',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  body {
    margin: 0;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #4f46e5, #06b6d4);
    font-family: system-ui, -apple-system, sans-serif;
  }
  .glass-card {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 24px;
    padding: 32px;
    color: white;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    max-width: 340px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .glass-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 28px 50px rgba(0, 0, 0, 0.28);
  }
  .tag {
    display: inline-block;
    background: rgba(255, 255, 255, 0.25);
    padding: 4px 12px;
    border-radius: 9999px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  h2 { margin: 12px 0 8px; font-size: 22px; font-weight: 800; }
  p { font-size: 14px; opacity: 0.9; line-height: 1.6; }
  .btn {
    display: inline-block;
    margin-top: 16px;
    padding: 10px 20px;
    background: white;
    color: #4f46e5;
    font-weight: bold;
    border-radius: 12px;
    text-decoration: none;
    transition: opacity 0.2s;
  }
  .btn:hover { opacity: 0.9; }
</style>
</head>
<body>
  <div class="glass-card">
    <span class="tag">Design Component</span>
    <h2>Glassmorphism UI</h2>
    <p>Frosted glass effect with CSS backdrop-filter and dynamic gradient lighting.</p>
    <a href="#" class="btn">Explore Design</a>
  </div>
</body>
</html>`,
    language: 'HTML',
    category: 'CSS Animations',
    version: '1.0.0',
    tags: ['html', 'css', 'glassmorphism', 'card'],
    status: 'published' as const,
  },
  {
    title: 'Optimized PostgreSQL Full-Text Search with Indexing',
    description: 'PostgreSQL GIN index setup and tsvector ranking query for fast substring and full-text searches.',
    code: `-- Create full text search index on articles table
ALTER TABLE articles ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Update vector with weighted title (A) and body (B)
UPDATE articles SET search_vector = 
  setweight(to_tsvector('english', COALESCE(title, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(content, '')), 'B');

-- Create GIN index for rapid query retrieval
CREATE INDEX IF NOT EXISTS idx_articles_search ON articles USING GIN(search_vector);

-- Perform ranked search query
SELECT id, title, ts_rank(search_vector, query) AS relevance
FROM articles, to_tsquery('english', 'database & performance') query
WHERE search_vector @@ query
ORDER BY relevance DESC
LIMIT 20;`,
    language: 'SQL',
    category: 'Database & SQL',
    version: '1.1.0',
    tags: ['postgresql', 'sql', 'indexing', 'full-text-search'],
    status: 'published' as const,
  },
];

export const AdminSettings: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [seeding, setSeeding] = useState(false);
  const [copiedConfig, setCopiedConfig] = useState(false);

  const handleCopyConfig = async () => {
    const ok = await copyTextToClipboard(JSON.stringify(firebaseConfig, null, 2));
    if (ok) {
      setCopiedConfig(true);
      showToast('Firebase config copied to clipboard!', 'info');
      setTimeout(() => setCopiedConfig(false), 2000);
    }
  };

  const handleSeedSnippets = async () => {
    setSeeding(true);
    try {
      let count = 0;
      for (const snippet of STARTER_SNIPPETS) {
        await createNewCode(
          snippet,
          currentUser?.uid || 'admin',
          currentUser?.email || 'admin@codetoolkit.demo'
        );
        count++;
      }
      showToast(`Seeded ${count} starter snippets to Realtime Database!`, 'success');
    } catch (err: any) {
      showToast('Seeding failed: ' + (err.message || 'Check database permissions'), 'error');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Telegram & WhatsApp Support Contact Settings */}
      <AdminContactSettings />

      {/* Site Branding & Text Controls */}
      <SiteBrandingSettings />

      {/* Firebase Database Config Overview */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Firebase Realtime Database Configuration
              </h3>
              <p className="text-xs text-slate-500">Connected database environment</p>
            </div>
          </div>

          <button
            onClick={handleCopyConfig}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            {copiedConfig ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedConfig ? 'Copied!' : 'Copy Config'}</span>
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto">
          <pre>{JSON.stringify(firebaseConfig, null, 2)}</pre>
        </div>
      </div>

      {/* Quick Seed Starter Snippets */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-1 max-w-lg">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              Seed Production Starter Snippets
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Populate the Firebase Realtime Database with 4 curated starter snippets (React Navbar, Python Scraper, HTML Glassmorphism, and PostgreSQL Search) with one click.
            </p>
          </div>

          <button
            onClick={handleSeedSnippets}
            disabled={seeding}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
          >
            {seeding ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Seeding Database...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Seed Starter Snippets</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
