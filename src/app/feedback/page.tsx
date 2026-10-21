'use client';

import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Send, 
  Star, 
  Check, 
  AlertCircle, 
  User, 
  Mail, 
  MessageSquare
} from 'lucide-react';
import { validateName, validateEmail, validateFeedback } from '@/lib/validation';

export default function FeedbackPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    const nameCheck = validateName(formData.name);
    if (!nameCheck.valid) {
      setStatus({ type: 'error', text: nameCheck.error || 'Please enter a valid full name.' });
      return;
    }

    const emailCheck = validateEmail(formData.email);
    if (!emailCheck.valid) {
      setStatus({ type: 'error', text: emailCheck.error || 'Please enter a valid email address.' });
      return;
    }

    const msgCheck = validateFeedback(formData.message);
    if (!msgCheck.valid) {
      setStatus({ type: 'error', text: msgCheck.error || 'Please enter your message (at least 5 characters).' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatus({ type: 'error', text: data.error || 'Failed to submit feedback' });
        setLoading(false);
        return;
      }

      setStatus({ type: 'success', text: 'Thank you! Your feedback has been recorded successfully.' });
      setFormData({ name: '', email: '', rating: 5, message: '' });
    } catch (err: any) {
      setStatus({ type: 'error', text: 'Connection error: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
          <HeartHandshake className="w-3.5 h-3.5 text-blue-600" />
          <span>User Feedback & Reporting</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Portal Feedback & Suggestions</h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          Help us improve health awareness communication and portal features. Your feedback is actively reviewed by our support team.
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-lg">
        {status && (
          <div
            className={`mb-6 p-4 rounded-xl text-xs flex items-start gap-2.5 ${
              status.type === 'error'
                ? 'bg-rose-50 border border-rose-200 text-rose-800'
                : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
            }`}
          >
            {status.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" /> : <Check className="w-4 h-4 shrink-0 text-emerald-600" />}
            <div>
              <strong className="block font-bold">
                {status.type === 'error' ? 'Notice:' : 'Thank you!'}
              </strong>
              {status.text}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-600" />
              Your Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Omkar Ahirrao"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-600" />
              Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. omkar@gmail.com"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1.5">
              Portal Experience Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= formData.rating
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs text-slate-600 ml-2 font-semibold">
                {formData.rating} of 5 Stars
              </span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1.5 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
              Feedback Message
            </label>
            <textarea
              rows={4}
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Describe your feedback, suggestion, or query..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
            ></textarea>
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>5 to 1000 characters</span>
              <span>{formData.message.length}/1000</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
          >
            {loading ? 'Submitting...' : <><Send className="w-4 h-4" /> Send Feedback</>}
          </button>
        </form>
      </div>
    </div>
  );
}
