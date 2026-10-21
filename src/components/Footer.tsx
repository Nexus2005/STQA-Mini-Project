'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PhoneCall, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-600 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Identity with virus.png logo */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <Image
                src="/virus.png"
                alt="COVID-19 Portal"
                width={28}
                height={28}
                className="w-7 h-7 object-contain"
              />
              <span className="font-extrabold text-slate-900 text-base">COVID-19 Portal</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Evidence-based healthcare awareness portal with symptoms assessment, verified prevention protocols, and community discussions.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
              <PhoneCall className="w-3.5 h-3.5" />
              Toll-Free Helpline: <strong>1075</strong>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-3">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="hover:text-blue-600 transition-colors">Home & Symptoms Checker</Link></li>
              <li><Link href="/prevention" className="hover:text-blue-600 transition-colors">Prevention Protocols</Link></li>
              <li><Link href="/about" className="hover:text-blue-600 transition-colors">About COVID-19</Link></li>
              <li><Link href="/comments" className="hover:text-blue-600 transition-colors">Community Forum</Link></li>
              <li><Link href="/feedback" className="hover:text-blue-600 transition-colors">Submit Feedback</Link></li>
            </ul>
          </div>

          {/* Col 3: Prevention Guidelines */}
          <div>
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-3">
              Guidelines
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/prevention" className="hover:text-blue-600 transition-colors">Face Mask Selection</Link></li>
              <li><Link href="/prevention" className="hover:text-blue-600 transition-colors">WHO 7-Step Hand Sanitization</Link></li>
              <li><Link href="/prevention" className="hover:text-blue-600 transition-colors">Immunization & Booster Advice</Link></li>
              <li><Link href="/about" className="hover:text-blue-600 transition-colors">Aerosol Dispersion Dynamics</Link></li>
              <li><Link href="/admin" className="hover:text-blue-600 transition-colors">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Col 4: Public Health Resources */}
          <div>
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-3">
              Health Authorities
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="https://www.who.int" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 flex items-center gap-1">
                  World Health Organization (WHO) <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a href="https://www.cdc.gov" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 flex items-center gap-1">
                  Centers for Disease Control (CDC) <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a href="https://www.mohfw.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 flex items-center gap-1">
                  Ministry of Health & Family Welfare <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a href="https://cowin.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 flex items-center gap-1">
                  CoWIN Vaccination Portal <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 COVID-19 Information Portal. All rights reserved.</p>
          <p>Designed for public health education and community awareness.</p>
        </div>
      </div>
    </footer>
  );
}
