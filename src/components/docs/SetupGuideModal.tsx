import React, { useState } from 'react';
import {
  Modal
} from '../common/Modal';
import {
  BookOpen,
  Key,
  Shield,
  Database,
  Github,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Flame,
} from 'lucide-react';
import { copyTextToClipboard } from '../../utils/helpers';
import { useToast } from '../../context/ToastContext';

interface SetupGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FIREBASE_RULES_JSON = `{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth != null",
        ".write": "auth != null && (auth.uid === $uid || root.child('admins').child(auth.uid).child('role').val() === 'admin')"
      }
    },
    "admins": {
      ".read": "auth != null",
      "$uid": {
        ".write": "auth != null && root.child('admins').child(auth.uid).child('role').val() === 'admin'"
      }
    },
    "codes": {
      ".read": true,
      ".indexOn": ["status", "category", "language", "updatedAt"],
      "$codeId": {
        ".write": "auth != null && root.child('admins').child(auth.uid).child('role').val() === 'admin'",
        "views": {
          ".write": true
        }
      }
    }
  }
}`;

export const SetupGuideModal: React.FC<SetupGuideModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'admin' | 'rules' | 'database' | 'github'>('admin');
  const [copiedRules, setCopiedRules] = useState(false);

  const handleCopyRules = async () => {
    const ok = await copyTextToClipboard(FIREBASE_RULES_JSON);
    if (ok) {
      setCopiedRules(true);
      showToast('Firebase Security Rules copied!', 'success');
      setTimeout(() => setCopiedRules(false), 2000);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Firebase & GitHub Pages Documentation" maxWidth="2xl">
      <div className="space-y-5">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto border-b border-slate-200 dark:border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'admin'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Demo Admin Setup</span>
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'rules'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Security Rules</span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'database'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Database Schema</span>
          </button>

          <button
            onClick={() => setActiveTab('github')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'github'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub Pages Hosting</span>
          </button>
        </div>

        {/* Tab 1: Demo Admin Account Instructions */}
        {activeTab === 'admin' && (
          <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
            <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 space-y-2">
              <h4 className="font-bold text-sm text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-indigo-500" />
                Demo Admin Account Configuration
              </h4>
              <p className="leading-relaxed">
                To access the Admin Panel, create the admin user in Firebase Auth and register their UID in Realtime Database.
              </p>
            </div>

            <div className="space-y-3">
              <h5 className="font-bold text-slate-900 dark:text-white">Step-by-Step Instructions:</h5>
              <ol className="list-decimal list-inside space-y-2 pl-1 leading-relaxed">
                <li>
                  Go to <strong>Firebase Console</strong> &gt; <strong>Authentication</strong> &gt; <strong>Users</strong>.
                </li>
                <li>
                  Click <strong>Add User</strong> with:
                  <div className="mt-1 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 font-mono text-[11px] space-y-1">
                    <div><strong>Email:</strong> admin@codetoolkit.demo</div>
                    <div><strong>Password:</strong> Admin@123456</div>
                  </div>
                </li>
                <li>
                  Copy the generated <strong>User UID</strong> from Firebase Console.
                </li>
                <li>
                  Navigate to <strong>Realtime Database</strong> &gt; <strong>Data</strong> tab.
                </li>
                <li>
                  Create node <code className="text-indigo-500 font-mono">admins/&#123;UID&#125;</code> and set value:
                  <pre className="mt-1 p-2.5 rounded-xl bg-slate-950 text-slate-100 font-mono text-[11px]">
{`{
  "email": "admin@codetoolkit.demo",
  "role": "admin",
  "status": "active"
}`}
                  </pre>
                </li>
                <li>
                  Sign in with this account on the CodeToolkit login page to unlock the Admin Panel!
                </li>
              </ol>
            </div>
          </div>
        )}

        {/* Tab 2: Security Rules */}
        {activeTab === 'rules' && (
          <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-slate-900 dark:text-white">
                Firebase Realtime Database Rules:
              </p>
              <button
                onClick={handleCopyRules}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold hover:bg-indigo-100 transition-colors"
              >
                {copiedRules ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedRules ? 'Copied!' : 'Copy Rules'}</span>
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 text-slate-100 font-mono text-[11px] overflow-x-auto max-h-64 custom-scrollbar">
              <pre>{FIREBASE_RULES_JSON}</pre>
            </div>

            <p className="text-[11px] text-slate-400">
              * Paste these rules in <strong>Firebase Console &gt; Realtime Database &gt; Rules tab</strong> and click <strong>Publish</strong>.
            </p>
          </div>
        )}

        {/* Tab 3: Database Schema */}
        {activeTab === 'database' && (
          <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
            <h4 className="font-bold text-slate-900 dark:text-white">Database Hierarchy:</h4>
            <div className="p-3.5 rounded-2xl bg-slate-950 text-slate-100 font-mono text-[11px] overflow-x-auto max-h-72 custom-scrollbar">
              <pre>{`users/
  {userId}/
    name: string
    email: string
    role: "user" | "admin"
    createdAt: timestamp
    status: "active"

admins/
  {userId}/
    email: string
    role: "admin"
    status: "active"

codes/
  {codeId}/
    title: string
    description: string
    code: string
    language: string
    category: string
    version: string
    tags: string[]
    status: "published" | "draft"
    createdAt: timestamp
    updatedAt: timestamp
    createdBy: string
    creatorEmail: string
    views: number`}</pre>
            </div>
          </div>
        )}

        {/* Tab 4: GitHub Pages */}
        {activeTab === 'github' && (
          <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <h4 className="font-bold text-slate-900 dark:text-white">Deploying to GitHub Pages:</h4>
            <ol className="list-decimal list-inside space-y-2 pl-1">
              <li>
                Push your code repository to GitHub (e.g. <code className="font-mono">https://github.com/your-username/codetoolkit</code>).
              </li>
              <li>
                In GitHub Repository Settings, navigate to <strong>Pages</strong>, set source branch to <code className="font-mono">main</code> or <code className="font-mono">gh-pages</code>.
              </li>
              <li>
                <strong>Authorized Domains</strong> in Firebase:
                <div className="mt-1 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-[11px]">
                  Go to <strong>Firebase Console &gt; Authentication &gt; Settings &gt; Authorized domains</strong>, and add:
                  <div className="font-mono text-indigo-600 dark:text-indigo-400 mt-1">
                    your-username.github.io
                  </div>
                </div>
              </li>
              <li>
                CodeToolkit utilizes <strong>Hash Routing</strong> (<code className="font-mono">#/</code>, <code className="font-mono">#/admin</code>, <code className="font-mono">#/code/:id</code>), preventing 404 errors on page refresh on static GitHub Pages.
              </li>
            </ol>
          </div>
        )}

        {/* Modal Close Button */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition-all"
          >
            Got it, close guide
          </button>
        </div>
      </div>
    </Modal>
  );
};
