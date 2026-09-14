import React, { useState } from 'react';
import {
  Globe,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Trash2,
  Server,
  Sparkles,
} from 'lucide-react';
import { Profile, CustomDomainRecord } from '../types';
import { linkForgeService } from '../services/linkForgeService';

interface DomainManagerProps {
  profile: Profile;
  onUpdate: (updated: Profile) => void;
}

export const DomainManager: React.FC<DomainManagerProps> = ({ profile, onUpdate }) => {
  const [copiedSubdomain, setCopiedSubdomain] = useState(false);
  const [copiedCname, setCopiedCname] = useState(false);
  const [copiedA, setCopiedA] = useState(false);
  const [newDomainInput, setNewDomainInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<string | null>(null);

  const domains = linkForgeService.getAllDomains().filter((d) => d.targetUsername === profile.username);
  const currentCustomDomain = domains[0];

  const handleCopy = (text: string, type: 'sub' | 'cname' | 'a') => {
    navigator.clipboard?.writeText(text);
    if (type === 'sub') {
      setCopiedSubdomain(true);
      setTimeout(() => setCopiedSubdomain(false), 2000);
    } else if (type === 'cname') {
      setCopiedCname(true);
      setTimeout(() => setCopiedCname(false), 2000);
    } else if (type === 'a') {
      setCopiedA(true);
      setTimeout(() => setCopiedA(false), 2000);
    }
  };

  const handleAddDomain = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setVerificationResult(null);

    const res = linkForgeService.addCustomDomain(newDomainInput, profile.username);
    if (!res.success) {
      setErrorMessage(res.error || 'Failed to add domain');
      return;
    }

    const updated = linkForgeService.getProfileByUsername(profile.username);
    if (updated) onUpdate(updated);
    setNewDomainInput('');
  };

  const handleVerify = async (domainId: string) => {
    setIsVerifying(true);
    setVerificationResult(null);
    try {
      const res = await linkForgeService.verifyCustomDomain(domainId);
      setVerificationResult(res.message);
      const updated = linkForgeService.getProfileByUsername(profile.username);
      if (updated) onUpdate(updated);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRemove = (domainId: string) => {
    linkForgeService.removeCustomDomain(domainId);
    const updated = linkForgeService.getProfileByUsername(profile.username);
    if (updated) onUpdate(updated);
  };

  const subdomainUrl = `https://${profile.username}.linkforge.app`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Globe className="w-5 h-5 text-indigo-500" />
          <span>Multi-Tenant Domains & Routing</span>
        </h2>
        <p className="text-xs text-slate-500">
          Manage your fast subdomain and attach your own branded custom domain via Vercel Edge DNS
        </p>
      </div>

      {/* 1. Free Instant Subdomain Card */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Instant Subdomain Routing
              </h3>
              <p className="text-xs text-slate-500">Live SSL certificate and instant caching</p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
            Active & Hosted
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
            <span>{subdomainUrl}</span>
            <span className="text-[10px] text-emerald-500 font-sans font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Ready
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy(subdomainUrl, 'sub')}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              {copiedSubdomain ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSubdomain ? 'Copied' : 'Copy'}</span>
            </button>

            <a
              href={`#/@${profile.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              <span>Test Bio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* 2. Custom Domain Configuration Card */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Server className="w-4 h-4 text-indigo-500" />
              <span>Branded Custom Domain (Vercel Domains API)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Connect your domain like <code className="text-indigo-500 font-bold">bio.yourbrand.com</code>
            </p>
          </div>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
            Pro Feature
          </span>
        </div>

        {currentCustomDomain ? (
          <div className="space-y-4 pt-2">
            {/* Domain Status Bar */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-indigo-500" />
                  <span className="text-sm font-black text-slate-900 dark:text-white font-mono">
                    {currentCustomDomain.domain}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {currentCustomDomain.status === 'ACTIVE' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Active & SSL Secure</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Pending DNS Propagation</span>
                    </span>
                  )}

                  <button
                    onClick={() => handleRemove(currentCustomDomain.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                    title="Disconnect domain"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {verificationResult && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  {verificationResult}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500">
                  Last checked: {new Date(currentCustomDomain.lastCheckedAt || '').toLocaleTimeString()}
                </span>

                <button
                  onClick={() => handleVerify(currentCustomDomain.id)}
                  disabled={isVerifying}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                  <span>{isVerifying ? 'Verifying...' : 'Verify DNS Record'}</span>
                </button>
              </div>
            </div>

            {/* DNS Instructions Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                DNS Configuration Guide (Add in Cloudflare / GoDaddy / Namecheap)
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                  <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-bold">
                    <tr>
                      <th className="p-2.5">Type</th>
                      <th className="p-2.5">Name / Host</th>
                      <th className="p-2.5">Target / Value</th>
                      <th className="p-2.5">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                    <tr>
                      <td className="p-2.5 font-bold font-mono text-indigo-500">CNAME</td>
                      <td className="p-2.5 font-mono">bio</td>
                      <td className="p-2.5 font-mono">cname.vercel-dns.com</td>
                      <td className="p-2.5">
                        <button
                          onClick={() => handleCopy('cname.vercel-dns.com', 'cname')}
                          className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          {copiedCname ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold font-mono text-indigo-500">A Record</td>
                      <td className="p-2.5 font-mono">@ (Root fallback)</td>
                      <td className="p-2.5 font-mono">76.76.21.21</td>
                      <td className="p-2.5">
                        <button
                          onClick={() => handleCopy('76.76.21.21', 'a')}
                          className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          {copiedA ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleAddDomain} className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Enter your domain or subdomain
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  required
                  placeholder="e.g. bio.yourbrand.com or links.myportfolio.dev"
                  value={newDomainInput}
                  onChange={(e) => setNewDomainInput(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/25 transition cursor-pointer shrink-0"
                >
                  Connect Domain
                </button>
              </div>
              {errorMessage && (
                <p className="text-xs text-rose-500 font-semibold mt-1">{errorMessage}</p>
              )}
            </div>

            <p className="text-[11px] text-slate-500">
              Tip: You can use any custom subdomain (e.g. <code>links.yoursite.com</code>) by creating a CNAME record pointing to <code>cname.vercel-dns.com</code>.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
