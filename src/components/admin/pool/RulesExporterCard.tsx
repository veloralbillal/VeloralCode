import React, { useState } from 'react';
import { Copy, Check, FileCode, Download, ShieldCheck } from 'lucide-react';
import { copyTextToClipboard } from '../../../utils/helpers';
import { useToast } from '../../../context/ToastContext';

const COMPILED_RULES_JSON = `{
  "rules": {
    "users": {
      ".indexOn": ["email", "role", "createdAt", "uid"],
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
      ".indexOn": ["status", "category", "language", "updatedAt", "createdAt", "authorId", "views", "averageRating", "isFeatured", "isPopular"],
      "$codeId": {
        ".write": "auth != null && (root.child('admins').child(auth.uid).child('role').val() === 'admin' || data.child('authorId').val() === auth.uid || !data.exists())",
        "views": { ".write": true },
        "likes": { ".write": "auth != null" }
      }
    },
    "events": {
      ".read": true,
      ".indexOn": ["status", "isPopup", "createdAt", "updatedAt", "price", "downPrice"],
      "$eventId": {
        ".write": "auth != null && root.child('admins').child(auth.uid).child('role').val() === 'admin'"
      }
    },
    "banners": {
      ".read": true,
      ".indexOn": ["active", "order", "createdAt"],
      "$bannerId": {
        ".write": "auth != null && root.child('admins').child(auth.uid).child('role').val() === 'admin'"
      }
    },
    "toolReviews": {
      ".read": true,
      "$codeId": {
        ".indexOn": ["userId", "rating", "createdAt"],
        ".write": "auth != null"
      }
    },
    "withdrawals": {
      ".read": "auth != null",
      ".indexOn": ["userId", "status", "createdAt"],
      "$withdrawalId": {
        ".write": "auth != null"
      }
    },
    "creators": {
      ".read": true,
      ".indexOn": ["username", "verified", "status", "createdAt"],
      "$creatorId": {
        ".write": "auth != null"
      }
    },
    "licenses": {
      ".read": "auth != null",
      ".indexOn": ["key", "codeId", "status", "sellerId", "assignedUserId"],
      "$licenseId": {
        ".write": "auth != null"
      }
    },
    "announcements": {
      ".read": true,
      ".indexOn": ["active", "createdAt", "priority"],
      "$announcementId": {
        ".write": "auth != null && root.child('admins').child(auth.uid).child('role').val() === 'admin'"
      }
    }
  }
}`;

export const RulesExporterCard: React.FC = () => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const handleCopy = async () => {
    const ok = await copyTextToClipboard(COMPILED_RULES_JSON);
    if (ok) {
      setCopied(true);
      showToast('Firebase rules with .indexOn copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([COMPILED_RULES_JSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'database.rules.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded database.rules.json', 'info');
  };

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Compiled firebase-rules.json with Complete .indexOn Rules
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Paste in Firebase Console &gt; Realtime Database &gt; Rules or deploy with firebase deploy --only database
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition cursor-pointer shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5 text-white" />}
            <span>{copied ? 'Copied' : 'Copy JSON'}</span>
          </button>
        </div>
      </div>

      <div>
        <button
          type="button"
          onClick={() => setShowCode(!showCode)}
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
        >
          {showCode ? 'Hide Rules Code' : 'View Rules JSON Code'}
        </button>

        {showCode && (
          <pre className="mt-3 p-4 rounded-xl bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto max-h-72 border border-slate-800">
            {COMPILED_RULES_JSON}
          </pre>
        )}
      </div>
    </div>
  );
};
