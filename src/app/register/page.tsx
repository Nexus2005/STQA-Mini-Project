'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Check, 
  X, 
  AlertCircle, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff
} from 'lucide-react';
import { 
  validateName, 
  validateEmail, 
  validateMobile, 
  validatePassword, 
  getPasswordStrength 
} from '@/lib/validation';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    mobile: false,
    password: false,
    confirmPassword: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Client-side validations
  const nameVal = validateName(formData.name);
  const emailVal = validateEmail(formData.email);
  const mobileVal = validateMobile(formData.mobile);
  const passVal = validatePassword(formData.password);
  const passMatch = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0;
  const strength = getPasswordStrength(formData.password);

  const isFormValid =
    nameVal.valid &&
    emailVal.valid &&
    mobileVal.valid &&
    passVal.valid &&
    passMatch;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setServerError(null);
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, mobile: true, password: true, confirmPassword: true });

    if (!isFormValid) {
      setServerError('Please resolve the highlighted field errors below.');
      return;
    }

    setLoading(true);
    setServerError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || 'Registration failed.');
        setLoading(false);
        return;
      }

      setSuccessMessage('Account registered successfully! Redirecting to Community Forum...');
      setTimeout(() => {
        router.push('/comments');
        router.refresh();
      }, 1500);
    } catch (err: any) {
      setServerError('Network error connecting to database: ' + (err.message || 'Unknown'));
      setLoading(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
      {/* Page Title */}
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>User Registration & Profile Verification</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Create Your Account</h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          Register to participate in community awareness discussions and submit verified feedback.
        </p>
      </div>

      {/* Registration Card */}
      <div className="p-6 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-lg relative">
        {serverError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <div>
              <strong className="block font-bold">Registration Notice:</strong>
              {serverError}
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-3">
            <Check className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <div>
              <strong className="block font-bold">Success!</strong>
              {successMessage}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Full Name */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-600" />
                Full Name
              </label>
              <span className="text-[11px] text-slate-500">2 to 50 characters, letters only</span>
            </div>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={() => handleBlur('name')}
                placeholder="e.g. Omkar Ahirrao"
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none transition-colors ${
                  touched.name
                    ? nameVal.valid
                      ? 'border-emerald-500 focus:border-emerald-600'
                      : 'border-rose-500 focus:border-rose-600'
                    : 'border-slate-300 focus:border-blue-500'
                }`}
              />
              <div className="absolute right-3 top-3">
                {touched.name && (
                  nameVal.valid ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <X className="w-4 h-4 text-rose-600" />
                  )
                )}
              </div>
            </div>
            {touched.name && !nameVal.valid && (
              <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {nameVal.error}
              </p>
            )}
          </div>

          {/* 2. Email Address */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-600" />
                Email Address
              </label>
              <span className="text-[11px] text-slate-500">Valid email format</span>
            </div>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur('email')}
                placeholder="e.g. omkar@gmail.com"
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none transition-colors ${
                  touched.email
                    ? emailVal.valid
                      ? 'border-emerald-500 focus:border-emerald-600'
                      : 'border-rose-500 focus:border-rose-600'
                    : 'border-slate-300 focus:border-blue-500'
                }`}
              />
              <div className="absolute right-3 top-3">
                {touched.email && (
                  emailVal.valid ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <X className="w-4 h-4 text-rose-600" />
                  )
                )}
              </div>
            </div>
            {touched.email && !emailVal.valid && (
              <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {emailVal.error}
              </p>
            )}
          </div>

          {/* 3. Mobile Number */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                Mobile Number
              </label>
              <span className="text-[11px] text-slate-500">10 digits starting with 6, 7, 8, or 9</span>
            </div>
            <div className="relative">
              <input
                type="text"
                name="mobile"
                maxLength={10}
                value={formData.mobile}
                onChange={handleChange}
                onBlur={() => handleBlur('mobile')}
                placeholder="10 digits (e.g. 9876543210)"
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none transition-colors ${
                  touched.mobile
                    ? mobileVal.valid
                      ? 'border-emerald-500 focus:border-emerald-600'
                      : 'border-rose-500 focus:border-rose-600'
                    : 'border-slate-300 focus:border-blue-500'
                }`}
              />
              <div className="absolute right-3 top-3">
                {touched.mobile && (
                  mobileVal.valid ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <X className="w-4 h-4 text-rose-600" />
                  )
                )}
              </div>
            </div>
            {touched.mobile && !mobileVal.valid && (
              <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {mobileVal.error}
              </p>
            )}
          </div>

          {/* 4. Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-blue-600" />
                Password
              </label>
              <span className="text-[11px] text-slate-500">Min 8 chars, 1 letter, 1 number</span>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={() => handleBlur('password')}
                placeholder="Enter password (e.g. Omkar123)"
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none transition-colors pr-20 ${
                  touched.password
                    ? passVal.valid
                      ? 'border-emerald-500 focus:border-emerald-600'
                      : 'border-rose-500 focus:border-rose-600'
                    : 'border-slate-300 focus:border-blue-500'
                }`}
              />
              <div className="absolute right-3 top-2.5 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                {touched.password && (
                  passVal.valid ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <X className="w-4 h-4 text-rose-600" />
                  )
                )}
              </div>
            </div>

            {/* Password Criteria Checklist */}
            <div className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-slate-600 font-medium">Password Strength:</span>
                <span className={`font-bold ${
                  strength.label === 'Strong' ? 'text-emerald-700' :
                  strength.label === 'Good' ? 'text-blue-700' :
                  strength.label === 'Fair' ? 'text-amber-700' : 'text-rose-700'
                }`}>
                  {strength.label} ({strength.score}/4)
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    strength.score === 4 ? 'w-full bg-emerald-500' :
                    strength.score === 3 ? 'w-3/4 bg-blue-500' :
                    strength.score === 2 ? 'w-1/2 bg-amber-500' : 'w-1/4 bg-rose-500'
                  }`}
                ></div>
              </div>
              <div className="grid grid-cols-2 gap-1 text-[11px] pt-1 text-slate-600">
                <span className={`flex items-center gap-1 ${strength.hasMinLength ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                  {strength.hasMinLength ? <Check className="w-3 h-3 text-emerald-600" /> : '•'} At least 8 characters
                </span>
                <span className={`flex items-center gap-1 ${strength.hasLetter ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                  {strength.hasLetter ? <Check className="w-3 h-3 text-emerald-600" /> : '•'} At least 1 letter
                </span>
                <span className={`flex items-center gap-1 ${strength.hasNumber ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                  {strength.hasNumber ? <Check className="w-3 h-3 text-emerald-600" /> : '•'} At least 1 number
                </span>
                <span className={`flex items-center gap-1 ${strength.hasSpecial ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                  {strength.hasSpecial ? <Check className="w-3 h-3 text-emerald-600" /> : '•'} Special symbol
                </span>
              </div>
            </div>
          </div>

          {/* 5. Confirm Password */}
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={() => handleBlur('confirmPassword')}
                placeholder="Re-enter your password"
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none transition-colors ${
                  touched.confirmPassword
                    ? passMatch
                      ? 'border-emerald-500 focus:border-emerald-600'
                      : 'border-rose-500 focus:border-rose-600'
                    : 'border-slate-300 focus:border-blue-500'
                }`}
              />
              <div className="absolute right-3 top-3">
                {touched.confirmPassword && (
                  passMatch ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <X className="w-4 h-4 text-rose-600" />
                  )
                )}
              </div>
            </div>
            {touched.confirmPassword && !passMatch && (
              <p className="text-[11px] text-rose-600 mt-1">Passwords do not match.</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all ${
              loading
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 hover:shadow-md'
            }`}
          >
            {loading ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                Register Account
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-200 text-center text-xs text-slate-600">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 font-bold hover:underline">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}
