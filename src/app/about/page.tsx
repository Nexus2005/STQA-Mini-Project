'use client';

import React from 'react';
import Link from 'next/link';
import { Info, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  const variants = [
    {
      designation: 'Omicron & Sub-lineages (JN.1, XBB)',
      lineage: 'B.1.1.529',
      emergence: 'Late 2021 - Present',
      transmission: 'High transmissibility; lower lung severity compared to Delta',
      impact: 'Immune evasive mutations; shorter average incubation period',
    },
    {
      designation: 'Delta Variant',
      lineage: 'B.1.617.2',
      emergence: 'Late 2020 - 2021',
      transmission: 'High virulence & lung pathogenicity',
      impact: 'Drove massive second global wave with higher hospitalization rate',
    },
    {
      designation: 'Alpha Variant',
      lineage: 'B.1.1.7',
      emergence: 'Late 2020',
      transmission: 'Enhanced transmission rate (~50% higher than ancestral)',
      impact: 'First major Variant of Concern with N501Y spike mutation',
    },
    {
      designation: 'Ancestral Wuhan-Hu-1 Strain',
      lineage: 'Lineage A / B',
      emergence: 'Dec 2019',
      transmission: 'Wild-Type baseline pathogen',
      impact: 'Original reference genomic sequence published in January 2020',
    },
  ];

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-14">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
          <Info className="w-3.5 h-3.5" />
          <span>Scientific & Virological Reference</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          About COVID-19 & SARS-CoV-2
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          Understanding the molecular biology, transmission vectors, and genomic evolution of the novel coronavirus.
        </p>
      </div>

      {/* Pathogen Profile Card */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold text-sm">
            1
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">SARS-CoV-2 Pathogen Structure</h2>
            <p className="text-xs text-slate-500">Classification, genome structure, and cell entry mechanism</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-700 leading-relaxed">
          <div className="space-y-3">
            <p>
              Severe Acute Respiratory Syndrome Coronavirus 2 (SARS-CoV-2) is an enveloped, positive-sense single-stranded RNA virus belonging to the genus <em>Betacoronavirus</em>.
            </p>
            <p>
              Its genome contains approximately 29.9 kilobases encoding structural proteins: Spike (S), Envelope (E), Membrane (M), and Nucleocapsid (N).
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <strong className="text-slate-900 block font-bold">ACE2 Receptor Mediated Entry:</strong>
              <p className="text-slate-600">
                Infection begins when the receptor-binding domain (RBD) of the trimeric Spike glycoprotein docks with human Angiotensin-Converting Enzyme 2 (ACE2) receptors found on respiratory epithelial cells.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 space-y-2 text-xs">
              <h3 className="font-bold text-blue-950 text-sm">Key Clinical Indicators</h3>
              <ul className="space-y-1.5 text-blue-800">
                <li>• <strong>Incubation Period:</strong> Typically 2 to 14 days (mean 3.2 days for Omicron).</li>
                <li>• <strong>Basic Reproduction (R0):</strong> Baseline wild-type ~2.5–3.0; newer sub-variants exceed 10+ in dense settings.</li>
                <li>• <strong>Peak Infectivity:</strong> Peak viral shedding occurs 1–2 days prior to symptom onset and up to 5 days after.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Aerobiology & Transmission Vectors */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold text-sm">
            2
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Transmission Vectors & Aerobiology</h2>
            <p className="text-xs text-slate-500">Airborne aerosol physics vs ballistic droplet transmission</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Primary Vector</span>
            <h3 className="font-bold text-slate-900 text-base">Inhalation of Airborne Aerosols</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Exhalation, normal speaking, coughing, or singing produces microscopic aerosols (&lt; 5 μm) that remain suspended in indoor air for hours without proper cross-ventilation.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Direct Vector</span>
            <h3 className="font-bold text-slate-900 text-base">Ballistic Droplet Deposition</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Larger respiratory droplets (&gt; 5–10 μm) travel short distances (1–2 meters) and land directly on mucous membranes (eyes, nose, mouth) of nearby people.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Surface Vector</span>
            <h3 className="font-bold text-slate-900 text-base">Fomite Surface Contact</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Transfer of viable virions from contaminated surfaces to mucous membranes via unwashed hands. Neutralized effectively by 70% alcohol sanitizers or soap.
            </p>
          </div>
        </div>
      </section>

      {/* Variants Table */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold text-sm">
            3
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Variants of Concern (VOC) Timeline</h2>
            <p className="text-xs text-slate-500">WHO genomic tracking and evolutionary divergence</p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-semibold">
              <tr>
                <th className="py-3.5 px-4">Variant Designation</th>
                <th className="py-3.5 px-4">Pango Lineage</th>
                <th className="py-3.5 px-4">Period of Emergence</th>
                <th className="py-3.5 px-4">Characteristics</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {variants.map((v, i) => (
                <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{v.designation}</td>
                  <td className="py-3 px-4 font-mono text-blue-700">{v.lineage}</td>
                  <td className="py-3 px-4 text-slate-500">{v.emergence}</td>
                  <td className="py-3 px-4 leading-relaxed">{v.transmission}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Bottom CTA */}
      <div className="p-6 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="font-bold text-slate-900 text-sm">Need help checking your symptoms?</div>
          <div className="text-xs text-slate-600">Use our interactive screening tool for immediate guidance.</div>
        </div>
        <Link
          href="/#symptoms"
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all"
        >
          Symptoms Assessment <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
