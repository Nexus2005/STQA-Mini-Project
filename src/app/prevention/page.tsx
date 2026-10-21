'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Check, 
  X, 
  Layers, 
  ArrowRight
} from 'lucide-react';

export default function PreventionPage() {
  const handwashingSteps = [
    { step: 1, title: 'Palm to Palm', desc: 'Apply soap and rub hands palm to palm vigorously in circular motions.' },
    { step: 2, title: 'Back of Hands', desc: 'Rub right palm over left dorsum with interlaced fingers, and vice versa.' },
    { step: 3, title: 'Interlaced Fingers', desc: 'Palm to palm with fingers interlaced, cleaning web spaces thoroughly.' },
    { step: 4, title: 'Back of Fingers', desc: 'Backs of fingers to opposing palms with fingers interlocked.' },
    { step: 5, title: 'Rotational Thumb Rubbing', desc: 'Rotational rubbing of left thumb clasped in right palm and vice versa.' },
    { step: 6, title: 'Fingertips to Palms', desc: 'Rotational rubbing backwards and forwards with clasped fingers on opposite palm.' },
    { step: 7, title: 'Wrist Cleansing & Rinse', desc: 'Cleanse both wrists and rinse thoroughly under clean flowing tap water.' },
  ];

  const maskTypes = [
    {
      name: 'N95 / FFP2 / KN95 Respirators',
      badge: 'High Filtration (≥ 95%)',
      filtration: '≥ 95% of 0.3 micron particles',
      fit: 'Tight facial seal required',
      bestFor: 'Healthcare settings, crowded indoor areas, flights, clinics',
      reusable: 'Up to 5 uses with 72h rotation & dry storage in breathable bag',
    },
    {
      name: '3-Ply Surgical Medical Mask',
      badge: 'Moderate Filtration (60–80%)',
      filtration: '60% - 80% bacterial/particulate filtration',
      fit: 'Loose fitting; requires nose wire pinch',
      bestFor: 'General outdoor walks, low-density settings',
      reusable: 'Single use (dispose safely after 6-8 hours or when damp)',
    },
    {
      name: 'Double-Layer Cloth Mask',
      badge: 'Basic Barrier (30–50%)',
      filtration: '30% - 50% particulate filtration',
      fit: 'Moderate fit',
      bestFor: 'Outdoor activities; recommend layering over surgical mask',
      reusable: 'Washable with warm soapy water after every use',
    },
  ];

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-14">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Verified Health Standards</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          COVID-19 Prevention & Hygiene Protocol
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          Public safety measures based on World Health Organization (WHO) and Ministry of Health (MoHFW) clinical guidance.
        </p>
      </div>

      {/* 1. Mask Filtration Comparison */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold text-sm">
            1
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Face Mask Selection & Filtration Standard</h2>
            <p className="text-xs text-slate-500">Comparing protective efficacy and particulate containment across mask categories</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {maskTypes.map((mask, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {mask.badge}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Option 0{i + 1}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-3">{mask.name}</h3>

                <div className="space-y-2.5 text-xs text-slate-700">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <strong className="text-blue-700 block mb-0.5">Filtration Efficiency:</strong>
                    {mask.filtration}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">Facial Fit: </span>
                    <span className="text-slate-600">{mask.fit}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">Best Application: </span>
                    <span className="text-slate-600">{mask.bestFor}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">Reuse Guideline: </span>
                    <span className="text-slate-600">{mask.reusable}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. WHO 7-Step Hand Sanitization */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold text-sm">
            2
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">WHO 7-Step Hand Sanitization (20 Seconds)</h2>
            <p className="text-xs text-slate-500">Effective soap surfactant and alcohol rubbing dissolves viral lipid envelope</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {handwashingSteps.map((step) => (
            <div key={step.step} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                {step.step}
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{step.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col justify-center text-center space-y-1">
            <span className="text-xs font-bold text-blue-900">20-Second Rule</span>
            <p className="text-[11px] text-blue-700 leading-relaxed">
              Lather for at least 20 seconds to allow soap surfactants to break down viral lipids completely.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Do's and Don'ts */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold text-sm">
            3
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Recommended Do&apos;s & Don&apos;ts</h2>
            <p className="text-xs text-slate-500">Essential hygiene behaviors to adopt during community transmission</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Do's */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">✓</span>
              Recommended Do&apos;s
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>Wear certified N95 / KN95 masks in enclosed or crowded settings.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>Keep windows open during gatherings to enable cross-ventilation.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>Sanitize hands before eating, after transit, and after touching shared items.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>Monitor body temperature and SpO2 levels if feeling unwell.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>Isolate promptly if test results are positive or fever persists.</span>
              </li>
            </ul>
          </div>

          {/* Don'ts */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center text-xs">✕</span>
              Critical Don&apos;ts
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <X className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>Do NOT touch your eyes, nose, or mouth with unwashed hands.</span>
              </li>
              <li className="flex items-start gap-2">
                <X className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>Do NOT wear loose or single-layer cloth masks in healthcare settings.</span>
              </li>
              <li className="flex items-start gap-2">
                <X className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>Do NOT self-medicate with unverified antibiotics without doctor consultation.</span>
              </li>
              <li className="flex items-start gap-2">
                <X className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>Do NOT ignore persistent shortness of breath or chest tightness.</span>
              </li>
              <li className="flex items-start gap-2">
                <X className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>Do NOT share utensils, towels, or bed linen with an infected patient.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Community CTA */}
      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="font-bold text-slate-900 text-sm">Have hygiene questions or prevention tips?</div>
          <div className="text-xs text-slate-500">Join the discussion board or submit your feedback.</div>
        </div>
        <Link
          href="/comments"
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all"
        >
          Community Forum <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
