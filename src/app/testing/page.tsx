'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { 
  Play, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Code2, 
  Bug, 
  Download, 
  RefreshCw, 
  Sparkles,
  ArrowRight,
  Filter,
  Check,
  AlertTriangle
} from 'lucide-react';
import { MASTER_TEST_CASES, TestCase } from '@/lib/test-cases';
import { REGEX_RULES, validateName, validateEmail, validateMobile, validatePassword } from '@/lib/validation';

interface TestResult {
  passed: boolean;
  actualResult: string;
  executionTimeMs: number;
}

export default function TestingPage() {
  const [activeTab, setActiveTab] = useState<'matrix' | 'sandbox' | 'defects'>('matrix');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [results, setResults] = useState<Record<string, TestResult>>({});
  const [isRunning, setIsRunning] = useState(false);
  const [currentRunningId, setCurrentRunningId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // Sandbox state
  const [sandboxField, setSandboxField] = useState<'name' | 'email' | 'mobile' | 'password'>('email');
  const [sandboxInput, setSandboxInput] = useState('omkar@gmail.com');
  const [sandboxResult, setSandboxResult] = useState<{ valid: boolean; error?: string }>(() => validateEmail('omkar@gmail.com'));

  const categories = ['All', 'Regex Validation', 'Boundary & Negative', 'Security Testing', 'Database Integrity', 'Functional Testing'];

  // Execute all 36 test cases
  const runAllTests = async () => {
    setIsRunning(true);
    const newResults: Record<string, TestResult> = {};

    for (const tc of MASTER_TEST_CASES) {
      setCurrentRunningId(tc.id);
      try {
        const res = await tc.execute();
        newResults[tc.id] = res;
        setResults({ ...newResults });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Execution error';
        newResults[tc.id] = {
          passed: false,
          actualResult: `Error: ${message}`,
          executionTimeMs: 0,
        };
        setResults({ ...newResults });
      }
      // Small visual pause for smooth progress animation
      await new Promise((r) => setTimeout(r, 40));
    }

    setCurrentRunningId(null);
    setIsRunning(false);
  };

  // Run single test
  const runSingleTest = async (tc: TestCase) => {
    setCurrentRunningId(tc.id);
    const res = await tc.execute();
    setResults((prev) => ({ ...prev, [tc.id]: res }));
    setCurrentRunningId(null);
  };

  // Filtered test cases
  const filteredCases = filterCategory === 'All' 
    ? MASTER_TEST_CASES 
    : MASTER_TEST_CASES.filter((tc) => tc.category === filterCategory);

  const passedCount = Object.values(results).filter((r) => r.passed).length;
  const executedCount = Object.keys(results).length;

  // Handle sandbox change
  const handleSandboxChange = (val: string, field = sandboxField) => {
    setSandboxInput(val);
    if (field === 'name') setSandboxResult(validateName(val));
    if (field === 'email') setSandboxResult(validateEmail(val));
    if (field === 'mobile') setSandboxResult(validateMobile(val));
    if (field === 'password') setSandboxResult(validatePassword(val));
  };

  // Export CSV matrix
  const exportCSV = () => {
    const headers = ['Test ID', 'Category', 'Module', 'Test Type', 'Description', 'Input Data', 'Expected Result', 'Actual Result', 'Status', 'Execution Time (ms)'];
    const rows = MASTER_TEST_CASES.map((tc) => {
      const res = results[tc.id];
      return [
        tc.id,
        tc.category,
        tc.module,
        tc.testType,
        `"${tc.description.replace(/"/g, '""')}"`,
        `"${tc.inputData.replace(/"/g, '""')}"`,
        `"${tc.expectedResult.replace(/"/g, '""')}"`,
        `"${(res?.actualResult || 'Not Run').replace(/"/g, '""')}"`,
        res ? (res.passed ? 'PASS' : 'FAIL') : 'NOT RUN',
        res ? res.executionTimeMs : 0,
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'STQA_COVID_Portal_Test_Execution_Matrix.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-3">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                STQA Mini Project Quality Assurance Center
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Automated Test Execution Suite & Regex Matrix
              </h1>
              <p className="mt-2 text-slate-600 text-sm md:text-base max-w-3xl">
                Rigorous testing framework covering 36 automated assertions across Regular Expressions, Boundary Value Analysis (BVA), Equivalence Class Partitioning (ECP), XSS sanitization, SQL Injection, and live cloud database integrity.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={runAllTests}
                disabled={isRunning}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all disabled:opacity-60 active:scale-95"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Executing Tests ({executedCount}/36)...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    Run All 36 Test Cases
                  </>
                )}
              </button>
              
              <button
                onClick={exportCSV}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors"
                title="Export Excel / CSV format test cases"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Planned Cases</span>
              <p className="text-2xl font-bold text-slate-900 mt-1">36 Total</p>
              <span className="text-xs text-blue-600 font-medium">TC01 - TC36</span>
            </div>

            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
              <span className="text-xs font-medium text-emerald-700 uppercase tracking-wider">Passed Tests</span>
              <p className="text-2xl font-bold text-emerald-800 mt-1">{passedCount}</p>
              <span className="text-xs text-emerald-600 font-medium">
                {executedCount > 0 ? `${Math.round((passedCount / executedCount) * 100)}% Success Rate` : 'Ready to Run'}
              </span>
            </div>

            <div className="bg-rose-50 rounded-xl p-4 border border-rose-200">
              <span className="text-xs font-medium text-rose-700 uppercase tracking-wider">Defects Resolved</span>
              <p className="text-2xl font-bold text-rose-800 mt-1">5 Closed</p>
              <span className="text-xs text-rose-600 font-medium">100% Triage Resolution</span>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <span className="text-xs font-medium text-blue-700 uppercase tracking-wider">Database Status</span>
              <p className="text-2xl font-bold text-blue-800 mt-1">Active</p>
              <span className="text-xs text-blue-600 font-medium">Supabase Cloud PostgreSQL</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 space-x-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`pb-3 inline-flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'matrix'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Test Execution Matrix ({MASTER_TEST_CASES.length})
          </button>

          <button
            onClick={() => setActiveTab('sandbox')}
            className={`pb-3 inline-flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'sandbox'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code2 className="w-4 h-4" />
            Live Regex Interactive Sandbox
          </button>

          <button
            onClick={() => setActiveTab('defects')}
            className={`pb-3 inline-flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'defects'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bug className="w-4 h-4" />
            Defect Triage Log (5 Discovered & Fixed)
          </button>
        </div>

        {/* TAB 1: Test Cases Matrix */}
        {activeTab === 'matrix' && (
          <div className="space-y-4">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1 mr-2">
                <Filter className="w-3.5 h-3.5" /> Filter Category:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    filterCategory === cat
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Test Cases Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs md:text-sm">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Test ID</th>
                      <th className="py-3 px-4">Category & Module</th>
                      <th className="py-3 px-4">Test Description</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Input Data</th>
                      <th className="py-3 px-4">Expected Result</th>
                      <th className="py-3 px-4">Actual Result</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCases.map((tc) => {
                      const res = results[tc.id];
                      const isExecuting = currentRunningId === tc.id;

                      return (
                        <tr key={tc.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                            {tc.id}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="block font-semibold text-slate-900">{tc.module}</span>
                            <span className="text-[11px] text-slate-500">{tc.category}</span>
                          </td>
                          <td className="py-3 px-4 max-w-xs text-slate-700">
                            {tc.description}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                              tc.testType === 'Positive' ? 'bg-emerald-100 text-emerald-800' :
                              tc.testType === 'Negative' ? 'bg-amber-100 text-amber-800' :
                              tc.testType === 'Boundary' ? 'bg-purple-100 text-purple-800' :
                              tc.testType === 'Security' ? 'bg-rose-100 text-rose-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {tc.testType}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-600 max-w-[150px] truncate" title={tc.inputData}>
                            {tc.inputData}
                          </td>
                          <td className="py-3 px-4 text-slate-600 max-w-xs text-xs">
                            {tc.expectedResult}
                          </td>
                          <td className="py-3 px-4 text-xs font-mono max-w-xs">
                            {isExecuting ? (
                              <span className="text-blue-600 animate-pulse flex items-center gap-1 font-sans">
                                <RefreshCw className="w-3 h-3 animate-spin" /> Running...
                              </span>
                            ) : res ? (
                              <span className={res.passed ? 'text-emerald-700' : 'text-rose-700'}>
                                {res.actualResult} ({res.executionTimeMs}ms)
                              </span>
                            ) : (
                              <span className="text-slate-400 font-sans italic">Not yet executed</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center whitespace-nowrap">
                            {isExecuting ? (
                              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                Testing
                              </span>
                            ) : res ? (
                              res.passed ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  PASS
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                  FAIL
                                </span>
                              )
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-500">
                                Idle
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <button
                              onClick={() => runSingleTest(tc)}
                              disabled={isExecuting || isRunning}
                              className="px-2.5 py-1 rounded-md text-xs font-medium text-blue-700 hover:bg-blue-50 border border-blue-200 transition-colors disabled:opacity-50"
                            >
                              Run
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Regex Sandbox */}
        {activeTab === 'sandbox' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Live Regular Expression Sandbox</h2>
              <p className="text-slate-600 text-sm mt-1">
                Test custom examiner input strings against the exact production regex patterns configured in the portal.
              </p>
            </div>

            {/* Field Selectors */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(['name', 'email', 'mobile', 'password'] as const).map((field) => (
                <button
                  key={field}
                  onClick={() => {
                    setSandboxField(field);
                    const defaultVal = REGEX_RULES[field].validExample;
                    handleSandboxChange(defaultVal, field);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    sandboxField === field
                      ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-sm'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <p className="font-semibold capitalize text-sm">{REGEX_RULES[field].label}</p>
                  <code className="text-[10px] text-slate-500 block truncate mt-1">
                    {REGEX_RULES[field].patternString}
                  </code>
                </button>
              ))}
            </div>

            {/* Live Testing Input */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Input String for {REGEX_RULES[sandboxField].label}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={sandboxInput}
                    onChange={(e) => handleSandboxChange(e.target.value)}
                    placeholder="Type string to test regex..."
                    className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                  <button
                    onClick={() => handleSandboxChange(REGEX_RULES[sandboxField].validExample)}
                    className="px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                  >
                    Reset Valid
                  </button>
                </div>
              </div>

              {/* Instant Evaluation Result */}
              <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                sandboxResult.valid
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}>
                {sandboxResult.valid ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-bold text-sm">
                    {sandboxResult.valid ? 'Regex Pattern MATCHED (VALID INPUT)' : 'Regex Pattern REJECTED (INVALID INPUT)'}
                  </h4>
                  <p className="text-xs mt-1">
                    {sandboxResult.valid 
                      ? 'The entered string satisfies all syntactic grammar and length constraints.' 
                      : sandboxResult.error}
                  </p>
                  <p className="text-[11px] font-mono mt-2 text-slate-600">
                    Rule: <span className="bg-white px-2 py-0.5 rounded border">{REGEX_RULES[sandboxField].patternString}</span>
                  </p>
                </div>
              </div>

              {/* Pre-set Quick Test Tokens */}
              <div className="pt-2">
                <span className="text-xs font-semibold text-slate-500 uppercase block mb-2">
                  Quick Boundary / Negative Test Buttons:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleSandboxChange(REGEX_RULES[sandboxField].validExample)}
                    className="px-2.5 py-1 bg-white border border-emerald-300 text-emerald-700 rounded text-xs font-medium hover:bg-emerald-50"
                  >
                    Valid: {REGEX_RULES[sandboxField].validExample}
                  </button>
                  {REGEX_RULES[sandboxField].invalidExamples.map((ex, i) => (
                    <button
                      key={i}
                      onClick={() => handleSandboxChange(ex)}
                      className="px-2.5 py-1 bg-white border border-rose-200 text-rose-700 rounded text-xs font-medium hover:bg-rose-50"
                    >
                      Invalid: {ex === '' ? 'Empty String' : ex}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Defect Triage Log */}
        {activeTab === 'defects' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">STQA Defect Report & Bug Triage Log</h2>
              <p className="text-slate-600 text-sm mt-1">
                Real-world bugs identified during initial integration testing, categorized by severity, analyzed for root causes, and resolved.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  id: 'DEF-01',
                  severity: 'Critical (P1)',
                  category: 'Security / Input Sanitization',
                  tests: 'TC20, TC22',
                  issue: 'Stored Cross-Site Scripting (XSS) in Community Forum Comments',
                  cause: 'Missing HTML entity encoding allowed raw <script> and <img> tags to be injected into the database.',
                  fix: 'Implemented sanitizeHtml() helper in src/lib/validation.ts converting unsafe delimiters into safe HTML entities (&lt;, &gt;, &quot;).',
                  status: 'VERIFIED & CLOSED',
                },
                {
                  id: 'DEF-02',
                  severity: 'High (P2)',
                  category: 'Database / Concurrency',
                  tests: 'TC29',
                  issue: 'Race Condition Duplicate Email Registration under Concurrent Threads',
                  cause: 'Application-level SELECT before INSERT was prone to race conditions without a database-level UNIQUE constraint.',
                  fix: 'Added PostgreSQL UNIQUE constraint on users.email and caught unique violation code 23505 returning HTTP 409 Conflict.',
                  status: 'VERIFIED & CLOSED',
                },
                {
                  id: 'DEF-03',
                  severity: 'Medium (P3)',
                  category: 'Regular Expression',
                  tests: 'TC08',
                  issue: 'Mobile Regex Accepted Non-Numeric Characters at End of String',
                  cause: 'Missing end-of-string anchor $ in /^[6-9][0-9]+/ allowed alphabetical suffixes like 98765abcde.',
                  fix: 'Enforced full anchor regex /^[6-9][0-9]{9}$/ ensuring strictly 10 numeric digits starting with 6,7,8,9.',
                  status: 'VERIFIED & CLOSED',
                },
                {
                  id: 'DEF-04',
                  severity: 'Low (P4)',
                  category: 'Boundary Value Analysis',
                  tests: 'TC27',
                  issue: 'Whitespace-Only Strings Accepted in Full Name Field',
                  cause: 'Length check name.length >= 2 was performed before stripping leading and trailing spaces.',
                  fix: 'Enforced name.trim() before applying regex and length checks. Space-only strings now trigger validation rejection.',
                  status: 'VERIFIED & CLOSED',
                },
                {
                  id: 'DEF-05',
                  severity: 'High (P2)',
                  category: 'Role-Based Access Control',
                  tests: 'TC32',
                  issue: 'Unauthenticated Access to Admin Statistics & User Roster Endpoints',
                  cause: 'Missing authorization check on /api/admin/users and /api/admin/stats endpoints.',
                  fix: 'Integrated authentication middleware checking cookie token and user.role === "admin".',
                  status: 'VERIFIED & CLOSED',
                },
              ].map((def) => (
                <div key={def.id} className="border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                        {def.id}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base">{def.issue}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        def.severity.startsWith('Critical') ? 'bg-rose-100 text-rose-800' :
                        def.severity.startsWith('High') ? 'bg-amber-100 text-amber-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {def.severity}
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                        {def.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                    <div>
                      <strong className="text-slate-800 block mb-1">Root Cause Analysis:</strong>
                      <p>{def.cause}</p>
                    </div>
                    <div>
                      <strong className="text-slate-800 block mb-1">Applied Remediation:</strong>
                      <p className="text-slate-700 font-medium">{def.fix}</p>
                    </div>
                  </div>

                  <div className="mt-2 text-[11px] text-slate-400 font-mono">
                    Category: {def.category} | Associated Regression Tests: {def.tests}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
