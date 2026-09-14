import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  Globe,
  Search,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  UserX,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  FileCode2,
  Lock,
} from 'lucide-react';
import { UserAccount, CustomDomainRecord } from '../types';
import { linkForgeService } from '../services/linkForgeService';

interface AdminTabProps {
  onImpersonate: (username: string) => void;
}

export const AdminTab: React.FC<AdminTabProps> = ({ onImpersonate }) => {
  const [users, setUsers] = useState<UserAccount[]>(linkForgeService.getAllUsers());
  const [domains, setDomains] = useState<CustomDomainRecord[]>(linkForgeService.getAllDomains());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<'users' | 'domains' | 'seo'>('users');

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleUserSuspend = (user: UserAccount) => {
    const updated = linkForgeService.updateUserStatus(user.id, {
      isSuspended: !user.isSuspended,
    });
    if (updated) {
      setUsers(linkForgeService.getAllUsers());
    }
  };

  const toggleUserTier = (user: UserAccount) => {
    const newTier = user.tier === 'pro' ? 'free' : 'pro';
    const updated = linkForgeService.updateUserStatus(user.id, {
      tier: newTier,
    });
    if (updated) {
      setUsers(linkForgeService.getAllUsers());
    }
  };

  const handleVerifyDomain = async (domainId: string) => {
    await linkForgeService.verifyCustomDomain(domainId);
    setDomains(linkForgeService.getAllDomains());
  };

  return (
    <div className="space-y-6">
      {/* Super Admin Notice */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-500/30 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-600/30 text-indigo-300 border border-indigo-500/40">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black tracking-tight">Super Admin Control Hub</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-500 text-white uppercase">
                Root Access
              </span>
            </div>
            <p className="text-xs text-indigo-200/80">
              Manage multi-tenant accounts, custom DNS SSL certs, and platform quotas
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <div className="text-right">
            <p className="text-[10px] text-slate-400 uppercase font-bold">Total Platform Views</p>
            <p className="text-sm font-black text-emerald-400">11,510 views</p>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveSection('users')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSection === 'users'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Users & Tenants ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveSection('domains')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSection === 'domains'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Domain Verifications ({domains.length})</span>
        </button>

        <button
          onClick={() => setActiveSection('seo')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSection === 'seo'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileCode2 className="w-3.5 h-3.5" />
          <span>Global SEO & Sitemap</span>
        </button>
      </div>

      {/* Section 1: Users */}
      {activeSection === 'users' && (
        <div className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search user by name, handle, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3.5">User</th>
                    <th className="p-3.5">Handle / Subdomain</th>
                    <th className="p-3.5">Tier</th>
                    <th className="p-3.5">Metrics</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 dark:text-white">{user.name}</div>
                        <div className="text-[11px] text-slate-400">{user.email}</div>
                      </td>
                      <td className="p-3.5 font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                        @{user.username}
                      </td>
                      <td className="p-3.5">
                        <span
                          onClick={() => toggleUserTier(user)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition ${
                            user.tier === 'pro'
                              ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                          title="Click to toggle tier"
                        >
                          {user.tier.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3.5 text-[11px] text-slate-600 dark:text-slate-400 font-mono">
                        {user.totalViews} views • {user.totalClicks} clicks
                      </td>
                      <td className="p-3.5">
                        {user.isSuspended ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400">
                            Suspended
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-right space-x-1">
                        <button
                          onClick={() => onImpersonate(user.username)}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition cursor-pointer"
                          title="View and edit this profile in studio"
                        >
                          Studio
                        </button>
                        <button
                          onClick={() => toggleUserSuspend(user)}
                          className={`p-1 rounded-lg transition cursor-pointer ${
                            user.isSuspended
                              ? 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950'
                              : 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950'
                          }`}
                          title={user.isSuspended ? 'Reactivate account' : 'Suspend account'}
                        >
                          {user.isSuspended ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Section 2: Domains */}
      {activeSection === 'domains' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">Custom Domain</th>
                  <th className="p-3.5">Target Username</th>
                  <th className="p-3.5">DNS Status</th>
                  <th className="p-3.5">SSL Certificate</th>
                  <th className="p-3.5 text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {domains.map((dom) => (
                  <tr key={dom.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                    <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-white">
                      {dom.domain}
                    </td>
                    <td className="p-3.5 font-mono text-indigo-600 dark:text-indigo-400">
                      @{dom.targetUsername}
                    </td>
                    <td className="p-3.5">
                      {dom.status === 'ACTIVE' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                          Active (Vercel Edge)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
                          Pending Verification
                        </span>
                      )}
                    </td>
                    <td className="p-3.5">
                      {dom.sslConfigured ? (
                        <span className="text-emerald-500 font-bold flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> Auto Let's Encrypt
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium">Pending DNS</span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      {dom.status !== 'ACTIVE' ? (
                        <button
                          onClick={() => handleVerifyDomain(dom.id)}
                          className="px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] shadow-xs cursor-pointer"
                        >
                          Verify Now
                        </button>
                      ) : (
                        <span className="text-emerald-500 font-bold text-xs">Verified</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Section 3: Global SEO */}
      {activeSection === 'seo' && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Dynamic robots.txt & Multi-Tenant Sitemap Generator
            </h3>
            <p className="text-xs text-slate-500">
              Live crawler definitions for subdomains and portfolio discovery
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto border border-slate-800 space-y-1">
            <p className="text-slate-400"># LinkForge Edge Multi-Tenant robots.txt</p>
            <p>User-agent: *</p>
            <p>Allow: /</p>
            <p>Disallow: /admin/</p>
            <p>Disallow: /api/private/</p>
            <p className="pt-2 text-indigo-400"># Dynamic Sitemap Index</p>
            <p>Sitemap: https://linkforge.app/sitemap.xml</p>
            <p>Sitemap: https://linkforge.app/sitemap-profiles.xml</p>
          </div>
        </div>
      )}
    </div>
  );
};
