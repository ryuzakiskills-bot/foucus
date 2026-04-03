import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, UserPlus, Shield, ShieldAlert, Trash2, 
  CheckCircle, XCircle, Mail, Calendar, Key,
  TrendingUp, Activity, UserCheck, Clock
} from 'lucide-react';
import { cn } from '../lib/utils';
import { UserProfile, Invitation } from '../types';

interface AdminDashboardProps {
  currentUser: UserProfile;
}

export default function AdminDashboard({ currentUser }: AdminDashboardProps) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'invitations'>('users');
  const [newInviteEmail, setNewInviteEmail] = useState('');
  const [newInviteRole, setNewInviteRole] = useState<'user' | 'admin'>('user');

  const fetchAdminData = async () => {
    try {
      const headers = { 'x-user-id': currentUser.uid };
      const [usersRes, invitesRes, statsRes] = await Promise.all([
        fetch('/api/admin/users', { headers }),
        fetch('/api/admin/invitations', { headers }),
        fetch('/api/admin/stats', { headers })
      ]);

      if (usersRes.ok && invitesRes.ok && statsRes.ok) {
        setUsers(await usersRes.json());
        setInvitations(await invitesRes.json());
        setStats(await statsRes.json());
      }
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleApprove = async (userId: string, is_approved: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/approve`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': currentUser.uid 
        },
        body: JSON.stringify({ is_approved })
      });
      if (res.ok) fetchAdminData();
    } catch (err) {
      console.error('Failed to update approval status', err);
    }
  };

  const handleChangeRole = async (userId: string, role: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': currentUser.uid 
        },
        body: JSON.stringify({ role })
      });
      if (res.ok) fetchAdminData();
    } catch (err) {
      console.error('Failed to update role', err);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'x-user-id': currentUser.uid }
      });
      if (res.ok) fetchAdminData();
    } catch (err) {
      console.error('Failed to delete user', err);
    }
  };

  const handleCreateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/invitations', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': currentUser.uid 
        },
        body: JSON.stringify({ email: newInviteEmail, role: newInviteRole })
      });
      if (res.ok) {
        setNewInviteEmail('');
        fetchAdminData();
      }
    } catch (err) {
      console.error('Failed to create invitation', err);
    }
  };

  const handleRevokeInvite = async (inviteId: string) => {
    try {
      const res = await fetch(`/api/admin/invitations/${inviteId}`, {
        method: 'DELETE',
        headers: { 'x-user-id': currentUser.uid }
      });
      if (res.ok) fetchAdminData();
    } catch (err) {
      console.error('Failed to revoke invitation', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-blue-400' },
          { label: 'Active Users', value: stats?.activeUsers || 0, icon: UserCheck, color: 'text-emerald-400' },
          { label: 'Total Invites', value: stats?.totalInvitations || 0, icon: Mail, color: 'text-amber-400' },
          { label: 'Used Invites', value: stats?.usedInvitations || 0, icon: CheckCircle, color: 'text-indigo-400' }
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 flex items-center gap-4">
            <div className={cn("w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center", stat.color)}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-white/5 rounded-2xl border border-white/10 w-fit">
        <button 
          onClick={() => setActiveTab('users')}
          className={cn(
            "px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
            activeTab === 'users' ? "bg-brand-500 text-white shadow-lg" : "text-slate-400 hover:text-white"
          )}
        >
          <Users className="w-4 h-4" />
          User Management
        </button>
        <button 
          onClick={() => setActiveTab('invitations')}
          className={cn(
            "px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
            activeTab === 'invitations' ? "bg-brand-500 text-white shadow-lg" : "text-slate-400 hover:text-white"
          )}
        >
          <Mail className="w-4 h-4" />
          Invitations
        </button>
      </div>

      {activeTab === 'users' ? (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">User</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Role</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Joined</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((user) => (
                  <tr key={user.uid} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-400 font-bold">
                          {user.displayName[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold">{user.displayName}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={user.role}
                        onChange={(e) => handleChangeRole(user.uid, e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs font-bold outline-none focus:border-brand-500/50"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleApprove(user.uid, !user.is_approved)}
                        className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5",
                          user.is_approved ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                        )}
                      >
                        {user.is_approved ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {user.is_approved ? 'Approved' : 'Disabled'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDeleteUser(user.uid)}
                        className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Create Invitation Form */}
          <div className="glass-card p-8">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-brand-400" />
              Create New Invitation
            </h3>
            <form onSubmit={handleCreateInvite} className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[240px] space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Recipient Email</label>
                <input 
                  required
                  type="email"
                  placeholder="user@example.com"
                  value={newInviteEmail}
                  onChange={(e) => setNewInviteEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 transition-all"
                />
              </div>
              <div className="w-40 space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Assigned Role</label>
                <select 
                  value={newInviteRole}
                  onChange={(e) => setNewInviteRole(e.target.value as any)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 transition-all"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button 
                type="submit"
                className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-brand-500/20"
              >
                Send Invite
              </button>
            </form>
          </div>

          {/* Invitations List */}
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/5">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Email</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Token</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Role</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Expires</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {invitations.map((invite) => (
                    <tr key={invite.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold">{invite.email}</td>
                      <td className="px-6 py-4">
                        <code className="bg-white/5 px-2 py-1 rounded text-brand-400 font-mono text-xs">
                          {invite.token}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          {invite.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400">
                        {new Date(invite.expires_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                          invite.used ? "bg-slate-500/10 text-slate-500" : "bg-emerald-500/10 text-emerald-400"
                        )}>
                          {invite.used ? 'Used' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {!invite.used && (
                          <button 
                            onClick={() => handleRevokeInvite(invite.id)}
                            className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
