'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MessageSquare, 
  Send, 
  Trash2, 
  AlertCircle, 
  Check, 
  Clock, 
  ShieldCheck, 
  Lock,
  RefreshCw
} from 'lucide-react';
import { validateComment } from '@/lib/validation';

interface CommentItem {
  id: number;
  comment_text: string;
  created_at: string;
  user_id: number;
  author_name: string;
  author_email: string;
  author_role: string;
}

export default function CommentsPage() {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      setUser(data.user);
    } catch {
      setUser(null);
    }
  };

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/comments');
      const data = await res.json();
      setComments(data.comments || []);
    } catch (e) {
      console.error('Error fetching comments', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchComments();
  }, []);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    const val = validateComment(commentText);
    if (!val.valid) {
      setStatusMsg({ type: 'error', text: val.error || 'Please enter a valid comment.' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment_text: commentText }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatusMsg({ type: 'error', text: data.error || 'Failed to post comment.' });
        setSubmitting(false);
        return;
      }

      setCommentText('');
      setStatusMsg({ type: 'success', text: 'Comment published to the community forum successfully!' });
      fetchComments();
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: 'Network error: ' + err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    try {
      const res = await fetch(`/api/comments/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        fetchComments();
      } else {
        alert(data.error || 'Failed to delete comment');
      }
    } catch (e: any) {
      alert('Error: ' + e.message);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
          <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
          <span>Community Discussion & Awareness Forum</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Community Discussion Board</h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
          Share preventive health tips, personal vaccination updates, and support fellow community members.
        </p>
      </div>

      {/* Post Comment Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md">
        {user ? (
          <form onSubmit={handlePostComment} className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900">{user.name}</span>
                  <span className="text-[11px] text-slate-500 ml-1.5">({user.role})</span>
                </div>
              </div>
            </div>

            {statusMsg && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  statusMsg.type === 'error'
                    ? 'bg-rose-50 border border-rose-200 text-rose-800'
                    : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                }`}
              >
                {statusMsg.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" /> : <Check className="w-4 h-4 shrink-0 text-emerald-600" />}
                <span>{statusMsg.text}</span>
              </div>
            )}

            <div>
              <textarea
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your COVID-19 awareness notes, vaccination experiences, or prevention suggestions..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
              ></textarea>
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1 px-1">
                <span>Maximum 500 characters</span>
                <span className={commentText.length > 500 ? 'text-rose-600 font-bold' : ''}>
                  {commentText.length}/500
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Moderated community board
              </span>

              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
              >
                {submitting ? 'Posting...' : <><Send className="w-3.5 h-3.5" /> Post Comment</>}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6 space-y-3">
            <Lock className="w-8 h-8 text-blue-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">Join the Community Discussion</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Please sign in with your verified account to post comments and participate in community conversations.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors shadow-xs"
              >
                Login to Post
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 transition-colors border border-slate-300"
              >
                Register Free
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>Recent Comments</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-blue-700 text-xs font-bold border border-slate-200">
              {comments.length}
            </span>
          </h2>
          <button
            onClick={fetchComments}
            className="text-xs text-slate-600 hover:text-blue-600 flex items-center gap-1 transition-colors font-medium"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading community discussions...</div>
        ) : comments.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 rounded-2xl bg-white border border-slate-200">
            No comments posted yet. Be the first to share an awareness note!
          </div>
        ) : (
          <div className="space-y-3">
            {comments.map((c) => {
              const isAuthor = user && user.id === c.user_id;
              const isAdmin = user && user.role === 'admin';
              const canDelete = isAuthor || isAdmin;

              return (
                <div
                  key={c.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs transition-all space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center font-bold text-xs text-blue-700">
                        {c.author_name ? c.author_name.charAt(0) : 'U'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{c.author_name}</span>
                          {c.author_role === 'admin' && (
                            <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[9px] font-bold px-1.5 py-0.2 rounded">
                              ADMIN
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {new Date(c.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {canDelete && (
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete comment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans whitespace-pre-wrap break-words">
                    {c.comment_text}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
