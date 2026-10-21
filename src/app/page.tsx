'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShieldCheck, 
  Activity, 
  CheckCircle2, 
  ChevronRight, 
  ArrowRight,
  MessageSquare,
  HelpCircle,
  RotateCcw
} from 'lucide-react';

export default function HomePage() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const symptomList = [
    { id: 'fever', label: 'Fever or chills (Body temp > 100.4°F)' },
    { id: 'cough', label: 'Dry persistent cough' },
    { id: 'taste_smell', label: 'Loss of taste or smell' },
    { id: 'breath', label: 'Shortness of breath / Difficulty breathing' },
    { id: 'fatigue', label: 'Unusual tiredness & muscle aches' },
    { id: 'throat', label: 'Sore throat or congestion' },
    { id: 'headache', label: 'Persistent headache' },
  ];

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const calculateRisk = () => {
    const hasEmergency = selectedSymptoms.includes('breath');
    const highCount = selectedSymptoms.filter((s) => s === 'fever' || s === 'taste_smell').length;
    const total = selectedSymptoms.length;

    if (hasEmergency) {
      return {
        level: 'Immediate Medical Attention Required',
        badge: 'Critical Advisory',
        desc: 'Difficulty breathing is an emergency warning sign. Please seek immediate medical care at the nearest healthcare facility or call the national emergency line.',
        action: 'Contact National Emergency Helpline (1075) Immediately',
      };
    }
    if (highCount >= 1 || total >= 3) {
      return {
        level: 'Moderate Symptoms - Clinical Advice Advised',
        badge: 'Testing Recommended',
        desc: 'Your selected symptoms match key signs of viral respiratory infection. Self-isolate at home, arrange an RT-PCR test, and consult a doctor.',
        action: 'Schedule RT-PCR Test & Consult a Physician',
      };
    }
    if (total > 0) {
      return {
        level: 'Mild Symptoms - Rest & Home Care',
        badge: 'Routine Monitoring',
        desc: 'Symptoms appear mild. Get adequate rest, stay hydrated, wear a mask around others, and monitor your temperature twice daily.',
        action: 'Monitor Temperature and Maintain Hydration',
      };
    }
    return {
      level: 'No Symptoms Selected',
      badge: 'Baseline Status',
      desc: 'Check any symptoms you or your family members are experiencing to view automated health guidance.',
      action: 'Select your current symptoms from the checklist',
    };
  };

  const risk = calculateRisk();

  const faqs = [
    {
      q: 'How does COVID-19 spread between people?',
      a: 'The virus spreads mainly when an infected person breathes, talks, or coughs, releasing droplets and microscopic aerosols into the air. In closed spaces with limited ventilation, these particles can remain suspended for longer periods.',
    },
    {
      q: 'What is the typical incubation period?',
      a: 'Symptoms generally develop within 2 to 14 days after exposure. With current variants, symptoms frequently emerge within 3 to 5 days.',
    },
    {
      q: 'How do vaccines and boosters help?',
      a: 'Vaccines train your immune system to recognize and fight the virus. Even if an infection occurs, being up to date on vaccinations significantly lowers the risk of severe illness, hospitalization, and complications.',
    },
    {
      q: 'What steps should I take if a family member tests positive?',
      a: 'Designate a separate room and bathroom if possible. Open windows for fresh air ventilation, wear well-fitting masks during necessary contact, and clean frequently touched surfaces regularly.',
    },
    {
      q: 'When should someone go to an emergency hospital?',
      a: 'Seek immediate care for severe signs such as persistent difficulty breathing, chest pain, confusion, or bluish lips or face.',
    },
  ];

  return (
    <div className="space-y-16 pb-20 bg-slate-50">
      {/* Hero Section */}
      <section className="pt-10 sm:pt-14 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Public Health & Awareness Portal</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Evidence-Based <span className="text-blue-600">COVID-19 Health</span> Information & Care
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Access verified scientific guidelines, perform instant interactive symptoms self-assessments, explore protective hygiene protocols, and connect with community health discussions.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#symptoms"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2 transition-all shadow-sm"
              >
                <Activity className="w-4 h-4" />
                Check Symptoms
              </a>
              <Link
                href="/prevention"
                className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold flex items-center gap-2 transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Prevention Protocols
              </Link>
            </div>

            {/* Micro Highlights */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-xs text-slate-600">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-0.5">WHO Aligned</span>
                <span>Current prevention guidance</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-0.5">Community</span>
                <span>Moderated discussion forum</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-0.5">Self-Assessment</span>
                <span>Interactive symptom triage</span>
              </div>
            </div>
          </div>

          {/* User's Lottie/Video Animation 1: Vaccine & Lab Research */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-sm">
              <video
                src="/vaccine-research.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto rounded-xl object-contain bg-white"
              />
              <div className="mt-2.5 px-2 flex items-center justify-between text-xs text-slate-500">
                <span className="font-medium text-slate-700">Scientific Immunization Research</span>
                <span className="text-[11px] text-blue-600 font-semibold">Active Guidelines</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Symptoms Self-Assessment Tool */}
      <section id="symptoms" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="p-6 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Heading and Checklist */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Interactive Self-Assessment</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  COVID-19 Symptoms Screening
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Select any symptoms you or your family are experiencing to receive instant triage recommendations.
                </p>
              </div>

              {/* Checklist */}
              <div className="space-y-2.5 pt-2">
                {symptomList.map((item) => {
                  const isChecked = selectedSymptoms.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleSymptom(item.id)}
                      className={`w-full text-left flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                        isChecked
                          ? 'bg-blue-50 border-blue-400 text-blue-900 font-semibold'
                          : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                            isChecked
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                        <span className="text-sm">{item.label}</span>
                      </div>
                      <span className="text-xs text-slate-400">
                        {isChecked ? 'Selected' : 'Tap to select'}
                      </span>
                    </button>
                  );
                })}

                <div className="flex items-center justify-between pt-2 text-xs">
                  <span className="text-slate-500 font-medium">
                    {selectedSymptoms.length} of {symptomList.length} symptoms selected
                  </span>
                  {selectedSymptoms.length > 0 && (
                    <button
                      onClick={() => setSelectedSymptoms([])}
                      className="text-blue-600 hover:underline font-semibold flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset selections
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Doctor Animation + Results Card */}
            <div className="lg:col-span-5 space-y-4">
              {/* User's Lottie/Video Animation 2: Doctor Checking Patient */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2 overflow-hidden">
                <video
                  src="/doctor-checkup.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-44 object-contain rounded-xl bg-white"
                />
              </div>

              {/* Assessment Status Box */}
              <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Clinical Evaluation
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                    {risk.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{risk.level}</h3>
                <p className="text-xs leading-relaxed text-slate-600">{risk.desc}</p>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Recommended Next Step
                  </div>
                  <div className="text-xs font-semibold text-blue-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-blue-600" />
                    {risk.action}
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 pt-1">
                  Note: This screening provides general educational information and does not replace medical advice from a qualified doctor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prevention Pillars Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-8">
          <div className="lg:col-span-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Core Guidelines</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Essential Transmission Prevention
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Follow these recommended health measures to reduce the spread of respiratory pathogens.
            </p>
          </div>
          <div className="lg:col-span-4 flex lg:justify-end">
            <Link
              href="/prevention"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              Full Prevention Protocols <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 4 Clean Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 transition-colors">
            <h3 className="font-bold text-slate-900 text-sm mb-1.5">1. Certified Masks</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Wear a tight-fitting N95 or multi-layer surgical mask in crowded indoor spaces and public transport.
            </p>
            <Link href="/prevention" className="text-xs font-semibold text-blue-600 hover:underline">
              Mask guidelines &rarr;
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 transition-colors">
            <h3 className="font-bold text-slate-900 text-sm mb-1.5">2. Hand Hygiene</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Wash hands with soap for at least 20 seconds, or use an alcohol-based sanitizer after touching public surfaces.
            </p>
            <Link href="/prevention" className="text-xs font-semibold text-blue-600 hover:underline">
              7-step washing guide &rarr;
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 transition-colors">
            <h3 className="font-bold text-slate-900 text-sm mb-1.5">3. Ventilation</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Keep rooms well-ventilated by opening windows to disperse any suspended airborne particles.
            </p>
            <Link href="/about" className="text-xs font-semibold text-blue-600 hover:underline">
              Aerosol dynamics &rarr;
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 transition-colors">
            <h3 className="font-bold text-slate-900 text-sm mb-1.5">4. Vaccination</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Complete recommended primary and booster vaccine doses to reinforce antibody defense.
            </p>
            <Link href="/prevention" className="text-xs font-semibold text-blue-600 hover:underline">
              Vaccine info &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Community Banner with User's 3rd Animation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="w-full md:w-44 shrink-0 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
            <video
              src="/pandemic-awareness.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-32 object-contain bg-white"
            />
          </div>

          <div className="flex-1 space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Community Health Discussions & Feedback
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Have questions, recovery experiences, or local vaccination advice? Join our community forum or share feedback to help us improve.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/comments"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Community Forum
            </Link>
            <Link
              href="/feedback"
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-all"
            >
              Submit Feedback
            </Link>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-200 text-slate-700 text-xs font-semibold mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Common Questions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm hover:text-blue-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  <span
                    className={`transform transition-transform text-blue-600 shrink-0 ${
                      isOpen ? 'rotate-90' : ''
                    }`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
