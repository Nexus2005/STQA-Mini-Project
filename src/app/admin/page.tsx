'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Lock, 
  Users, 
  MessageSquare, 
  HeartHandshake, 
  Trash2, 
  Database, 
  RefreshCw
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [commentsList, setCommentsList] = useState<any[]>([]);
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'comments' | 'feedback'>('overview');
  const [loading, setLoading] = useState(true);
  const [loginEmail, setLoginEmail] = useState('admin@covidportal.org');
  const [loginPass, setLoginPass] = useState('Admin@12345');
  const [loginError, setLoginError] = useState<string | null>(null);

  const checkAuthAndLoad = async () => {
    setLoading(true);
    try {
      const authRes = await fetch('/api/auth/me');
      const authData = await authRes.json();

      if (!authData.user || authData.user.role !== 'admin') {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      setAuthorized(true);
      setAdminUser(authData.user);

      // Fetch stats, users, comments, feedback in parallel
      const [statsRes, usersRes, commentsRes, feedbackRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/users'),
        fetch('/api/comments'),
        fetch('/api/feedback'),
      ]);

      const statsData = await statsRes.json();
      const usersData = await usersRes.json();
      const commentsData = await commentsRes.json();
      const feedbackData = await feedbackRes.json();

      setStats(statsData);
      setUsersList(usersData.users || []);
      setCommentsList(commentsData.comments || []);
      setFeedbackList(feedbackData.feedback || []);
    } catch (err) {
      console.error(err);
      setAuthorized(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthAndLoad();
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPass }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || 'Authentication rejected');
        return;
      }
      if (data.user.role !== 'admin') {
        setLoginError('This account does not have administrator privileges.');
        return;
      }
      checkAuthAndLoad();
    } catch (err: any) {
      setLoginError('Error: ' + err.message);
    }
  };

  const handleDeleteComment = async (id: number) => {
    if (!confirm(`Delete comment #${id}? This will remove it from the database.`)) return;
    try {
      const res = await fetch(`/api/comments/${id}`, { method: 'DELETE' });
      if (res.ok) {
        checkAuthAndLoad();
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to delete');
      }
    } catch (e: any) {
      alert('Error: ' + e.message);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-600 text-sm">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
        Loading administrative console...
      </div>
    );
  }

  // Not authorized screen
  if (!authorized) {
    return (
      <div className="py-16 px-4 max-w-md mx-auto space-y-6">
        <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mx-auto">
            <Lock className="w-7 h-7" />
          </div>

          <h2 className="text-xl font-bold text-slate-900">Administrator Access Required</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            This administration portal is restricted to authorized health moderators and administrators. Please log in with admin credentials.
          </p>

          {loginError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs text-left">
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-3 text-left pt-2">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Admin Email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Admin Password</label>
              <input
                type="password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors mt-2"
            >
              Sign In as Admin
            </button>
          </form>

          <div className="pt-2 text-[11px] text-slate-500">
            Default credentials: <code className="text-blue-600 font-bold">admin@covidportal.org</code> / <code className="text-blue-600 font-bold">Admin@12345</code>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Administrator Command Center</h1>
            <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-300 text-[11px] font-bold">
              SUPERUSER
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Logged in as <strong>{adminUser.name}</strong> ({adminUser.email})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={checkAuthAndLoad}
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-300 shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
            Refresh Data
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-semibold">Registered Users</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{stats?.counts?.users ?? usersList.length}</div>
          <div className="text-[11px] text-blue-600 font-semibold mt-1">Active verified accounts</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-semibold">Community Comments</span>
            <MessageSquare className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{stats?.counts?.comments ?? commentsList.length}</div>
          <div className="text-[11px] text-blue-600 font-semibold mt-1">Discussions posted</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-semibold">Feedback Inquiries</span>
            <HeartHandshake className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{stats?.counts?.feedback ?? feedbackList.length}</div>
          <div className="text-[11px] text-blue-600 font-semibold mt-1">Recorded submissions</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-semibold">Database Status</span>
            <Database className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-base font-extrabold text-emerald-700 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            Operational (Online)
          </div>
          <div className="text-[11px] text-slate-500 mt-1">PostgreSQL Connection Active</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'overview'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Overview & Activity
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'users'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Registered Users ({usersList.length})
        </button>
        <button
          onClick={() => setActiveTab('comments')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'comments'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Comment Moderation ({commentsList.length})
        </button>
        <button
          onClick={() => setActiveTab('feedback')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'feedback'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          User Feedback ({feedbackList.length})
        </button>
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center justify-between">
              <span>Recently Registered Users</span>
              <button onClick={() => setActiveTab('users')} className="text-xs text-blue-600 font-semibold hover:underline">
                View all
              </button>
            </h3>
            <div className="space-y-2">
              {usersList.slice(0, 4).map((u) => (
                <div key={u.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{u.name}</div>
                    <div className="text-slate-500">{u.email} • {u.mobile}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-slate-200 text-[10px] font-bold text-slate-800">
                    {u.role.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Comments */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center justify-between">
              <span>Latest Discussion Comments</span>
              <button onClick={() => setActiveTab('comments')} className="text-xs text-blue-600 font-semibold hover:underline">
                Moderate
              </button>
            </h3>
            <div className="space-y-2">
              {commentsList.slice(0, 4).map((c) => (
                <div key={c.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-900">{c.author_name}</span>
                    <span className="text-slate-400">{new Date(c.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-700 truncate">{c.comment_text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Users Table */}
      {activeTab === 'users' && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-800 uppercase tracking-wider font-extrabold border-b border-slate-200">
              <tr>
                <th className="p-4">User ID</th>
                <th className="p-4">Full Name</th>
                <th className="p-4">Email Address</th>
                <th className="p-4">Mobile Number</th>
                <th className="p-4">Role</th>
                <th className="p-4">Registered Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {usersList.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-mono font-bold text-blue-600">#{u.id}</td>
                  <td className="p-4 font-bold text-slate-900">{u.name}</td>
                  <td className="p-4">{u.email}</td>
                  <td className="p-4 font-mono">{u.mobile}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      u.role === 'admin'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500">{new Date(u.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Comments Moderation */}
      {activeTab === 'comments' && (
        <div className="space-y-3">
          <div className="text-xs text-slate-600">
            Administrators can delete inappropriate, spam, or misleading comments.
          </div>
          <div className="space-y-2">
            {commentsList.map((c) => (
              <div key={c.id} className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-start justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{c.author_name}</span>
                    <span className="text-[10px] text-slate-500">({c.author_email})</span>
                    <span className="text-[10px] text-slate-400">• {new Date(c.created_at).toLocaleString()}</span>
                  </div>
                  <p className="text-slate-800">{c.comment_text}</p>
                </div>
                <button
                  onClick={() => handleDeleteComment(c.id)}
                  className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs flex items-center gap-1 transition-colors shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Feedback */}
      {activeTab === 'feedback' && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-800 uppercase tracking-wider font-extrabold border-b border-slate-200">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">User Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Feedback Message</th>
                <th className="p-4">Submitted At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {feedbackList.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-mono font-bold text-blue-600">#{f.id}</td>
                  <td className="p-4 font-bold text-slate-900">{f.name}</td>
                  <td className="p-4">{f.email}</td>
                  <td className="p-4 text-amber-500 font-bold">{f.rating} ★</td>
                  <td className="p-4 text-slate-800 max-w-xs">{f.message}</td>
                  <td className="p-4 text-slate-500">{new Date(f.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
