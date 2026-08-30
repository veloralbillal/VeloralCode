import React, { useState, useEffect } from 'react';
import {
  Users,
  Shield,
  Mail,
  Calendar,
  RefreshCw,
  Search,
  Sparkles,
  Zap,
  CheckCircle2,
  XCircle,
  MoreVertical,
  UserCheck,
  Filter,
} from 'lucide-react';
import { UserProfile, UserPlan, UserRole } from '../../types';
import {
  fetchAllUsers,
  updateUserPlan,
  updateUserStatus,
  updateUserRole,
} from '../../services/authService';
import { formatDate } from '../../utils/helpers';
import { TableRowSkeleton } from '../common/LoadingSkeleton';
import { useToast } from '../../context/ToastContext';

export const AdminUsers: React.FC = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState<'all' | 'free' | 'premium'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchAllUsers();
      setUsers(data);
    } catch (err) {
      console.warn('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleTogglePlan = async (user: UserProfile) => {
    const newPlan: UserPlan = user.plan === 'premium' ? 'free' : 'premium';
    setUpdatingId(user.userId);
    try {
      await updateUserPlan(user.userId, newPlan);
      setUsers((prev) =>
        prev.map((u) => (u.userId === user.userId ? { ...u, plan: newPlan } : u))
      );
      showToast(`Updated ${user.name || user.email}'s plan to ${newPlan.toUpperCase()}`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update plan', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleStatus = async (user: UserProfile) => {
    const newStatus = user.status === 'suspended' ? 'active' : 'suspended';
    setUpdatingId(user.userId);
    try {
      await updateUserStatus(user.userId, newStatus);
      setUsers((prev) =>
        prev.map((u) => (u.userId === user.userId ? { ...u, status: newStatus } : u))
      );
      showToast(`User status set to ${newStatus}`, 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to update status', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleRole = async (user: UserProfile) => {
    const newRole: UserRole = user.role === 'admin' ? 'user' : 'admin';
    setUpdatingId(user.userId);
    try {
      await updateUserRole(user.userId, newRole, user.email);
      setUsers((prev) =>
        prev.map((u) => (u.userId === user.userId ? { ...u, role: newRole } : u))
      );
      showToast(`User role updated to ${newRole}`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update role', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.numericUid && u.numericUid.includes(q)) ||
      (u.userId && u.userId.toLowerCase().includes(q));

    const matchesPlan =
      planFilter === 'all' ||
      (planFilter === 'premium' && (u.plan === 'premium' || u.role === 'admin')) ||
      (planFilter === 'free' && u.plan !== 'premium' && u.role !== 'admin');

    return matchesSearch && matchesPlan;
  });

  return (
    <div className="space-y-6">
      {/* Top Controls: Search & Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users by name, email, or UID..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold focus:outline-none"
          >
            <option value="all">All Plans</option>
            <option value="premium">✨ Premium</option>
            <option value="free">⚡ Free</option>
          </select>
        </div>

        <button
          onClick={loadUsers}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-6">
            <table className="w-full">
              <tbody>
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
              </tbody>
            </table>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Users className="w-10 h-10 text-slate-400 mx-auto" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">No Users Found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No user accounts match your search and filter criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Plan (Control)</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Joined</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
                {filteredUsers.map((u) => {
                  const isUserPremium = u.plan === 'premium' || u.role === 'admin';
                  const isUpdating = updatingId === u.userId;

                  return (
                    <tr key={u.userId} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30">
                      {/* User Info */}
                      <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                            {(u.name || u.email || 'U')[0].toUpperCase()}
                          </div>
                          <div>
                            <span className="block font-bold">{u.name || 'Anonymous'}</span>
                            <div className="flex items-center gap-1">
                              <span className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                                UID: {u.numericUid || u.userId.slice(0, 8)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-4 px-4 text-slate-600 dark:text-slate-300">
                        {u.email}
                      </td>

                      {/* Plan Control */}
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleTogglePlan(u)}
                          disabled={isUpdating || u.role === 'admin'}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-bold border transition ${
                            isUserPremium
                              ? 'bg-amber-500/10 text-amber-500 dark:text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                          }`}
                          title="Click to toggle between Free & Premium plan"
                        >
                          {isUserPremium ? (
                            <>
                              <Sparkles className="w-3 h-3 fill-current" />
                              <span>Premium</span>
                            </>
                          ) : (
                            <>
                              <Zap className="w-3 h-3 text-indigo-500" />
                              <span>Free</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Role */}
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleToggleRole(u)}
                          disabled={isUpdating}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition ${
                            u.role === 'admin'
                              ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                          }`}
                          title="Click to toggle Admin / User role"
                        >
                          {u.role === 'admin' ? <Shield className="w-3 h-3" /> : null}
                          <span>{u.role === 'admin' ? 'Admin' : 'User'}</span>
                        </button>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleToggleStatus(u)}
                          disabled={isUpdating}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold transition ${
                            u.status === 'suspended'
                              ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 hover:bg-rose-100'
                              : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100'
                          }`}
                          title="Click to toggle Active / Suspended status"
                        >
                          <span>{u.status === 'suspended' ? 'Suspended' : 'Active'}</span>
                        </button>
                      </td>

                      {/* Joined Date */}
                      <td className="py-4 px-4 text-slate-400 text-[11px]">
                        {formatDate(u.createdAt)}
                      </td>

                      {/* Fast Toggle Action */}
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => handleTogglePlan(u)}
                          disabled={isUpdating || u.role === 'admin'}
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 text-[11px] font-bold transition"
                        >
                          {isUserPremium ? 'Demote to Free' : 'Grant Premium'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
