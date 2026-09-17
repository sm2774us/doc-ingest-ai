import React, { useState } from 'react';
import { 
  Users, 
  Award, 
  Compass, 
  BookOpen, 
  ShieldAlert, 
  CheckCircle2, 
  TrendingUp, 
  Briefcase, 
  MapPin, 
  HeartHandshake, 
  FileText,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import { TEAM_ROLES, GRIT_FRAMEWORK_PILLARS, ONBOARDING_ROADMAP_30_60_90 } from '../data/emData';
import { ARCHITECTURE_DECISION_RECORDS } from '../data/adrsData';
import { ArchitectureDecisionRecord } from '../types';

export const EngineeringManagerHub: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'charter' | 'hiring' | 'grit' | 'roadmap' | 'adrs' | 'oncall'>('charter');
  const [selectedAdr, setSelectedAdr] = useState<ArchitectureDecisionRecord>(ARCHITECTURE_DECISION_RECORDS[0]);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Strategic Header */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 border border-amber-900/50 rounded-2xl p-5 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider border border-amber-500/30">
                Engineering Manager OS
              </span>
              <span className="text-xs text-slate-400 font-mono">People, Strategy & Execution</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Content Foundations Leadership & Operational Operating System
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Leading the newly formed team at the center of Scribd's biggest strategic investment. 
              Balancing technical vision for real-time AI ingestion, founding team hiring, cross-functional partnership, and Scribd GRIT culture.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2">
        {[
          { id: 'charter', label: 'Team Charter & Vision', icon: Compass },
          { id: 'hiring', label: 'Founding Team Hiring Matrix', icon: Briefcase },
          { id: 'grit', label: 'Scribd GRIT Framework', icon: Award },
          { id: 'roadmap', label: '30-60-90 Day Plan', icon: Calendar },
          { id: 'adrs', label: 'Architecture Decisions (ADRs)', icon: BookOpen },
          { id: 'oncall', label: 'Operational Health & On-Call', icon: ShieldAlert },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
                isActive
                  ? 'border-amber-500 text-amber-600 bg-amber-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-Tab 1: Team Charter & Vision */}
      {activeSubTab === 'charter' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-600" />
              Content Foundations Team Charter
            </h3>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
              Behind our UGC brands (Scribd, SlideShare, Everand, Fable) sits one of the largest corpora of human-created knowledge anywhere: 
              hundreds of millions of documents and presentations. <strong>Content Foundations owns the system through which every piece of that knowledge enters Scribd.</strong>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-amber-600" />
                  Product Roadmap Accelerator
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Powers faster uploads (&lt;2s), richer multimodal document reading, and instantaneous Speechify narration generation for contributors and readers.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  Platform for Downstream Teams
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Operates as a reliable foundation for Trust & Safety, Content Understanding, Supply, and AI Platform RAG teams to consume clean, structured interfaces.
                </p>
              </div>
            </div>

            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-xs space-y-2 text-slate-800">
              <span className="font-bold text-amber-900 block">The Three EM Responsibilities (In Equal Measure):</span>
              <ul className="space-y-1.5 pl-4 list-disc text-slate-700">
                <li><strong>Technical Leader:</strong> Setting the vision for real-time AI ingestion, making architectural calls, and holding a world-class reliability bar.</li>
                <li><strong>People Leader:</strong> Hiring, growing, and inspiring a founding team of backend and AI data engineers across Scribd Flex hubs.</li>
                <li><strong>Cross-Functional Partner:</strong> Running the platform as a product with transparent roadmaps, commitments, and SLAs other teams plan against.</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-700" />
              Scribd Flex & Culture
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We empower employees to choose the workstyle and location that support their best performance, 
              while committing to intentional in-person moments that strengthen collaboration.
            </p>

            <div className="space-y-2 text-xs">
              <span className="font-semibold text-slate-800 block">Hiring Hubs:</span>
              <div className="flex flex-wrap gap-1">
                {['San Francisco', 'Austin', 'Seattle', 'New York', 'Toronto', 'Vancouver', 'Mexico City'].map((city) => (
                  <span key={city} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {city}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <span className="font-semibold text-slate-800 block">Core Team Principles:</span>
              <p className="text-[11px] text-slate-500">
                1. Customer & Contributor first.<br />
                2. Be real and be bold.<br />
                3. Debate and commit as we embrace plot twists.<br />
                4. Zero untrusted content escapes.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Hiring Matrix & Org Structure */}
      {activeSubTab === 'hiring' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Founding Team Hiring Plan (Headcount: 6 ICs)</h3>
                <p className="text-xs text-slate-500">Standing up a newly formed platform team from a blank page</p>
              </div>
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-amber-100 text-amber-800">
                Target Timeline: 60 Days
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {TEAM_ROLES.map((role, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{role.title}</h4>
                      <span className="text-[10px] font-mono text-amber-700 font-semibold">{role.level} • {role.focus}</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 font-bold">
                      {role.openHeadcount} open
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-slate-700 block mb-1">Key Competencies:</span>
                    <ul className="text-[11px] text-slate-600 space-y-1 list-disc pl-4">
                      {role.keyCompetencies.map((comp, ci) => (
                        <li key={ci}>{comp}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80 text-[10px] text-slate-500">
                    <strong className="text-slate-700">GRIT Rubric: </strong>{role.gritEvaluation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Scribd GRIT Framework */}
      {activeSubTab === 'grit' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-600" />
              Scribd GRIT Framework: How We Work & Lead
            </h3>
            <p className="text-xs text-slate-500">
              The intersection of passion and perseverance toward long-term platform goals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {GRIT_FRAMEWORK_PILLARS.map((pillar) => (
              <div key={pillar.letter} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black text-lg flex items-center justify-center shadow-md shadow-amber-500/20">
                  {pillar.letter}
                </div>
                <h4 className="font-bold text-sm text-slate-900">{pillar.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{pillar.description}</p>
                <div className="pt-2 border-t border-slate-200 text-[11px] text-amber-800 font-medium">
                  <strong>EM Action: </strong>{pillar.emAction}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Tab 4: 30-60-90 Day Execution Plan */}
      {activeSubTab === 'roadmap' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-600" />
              Senior Engineering Manager 30-60-90 Day Onboarding & Execution Plan
            </h3>
            <p className="text-xs text-slate-500">Strategic sequencing to establish trust, recruit talent, and ship production value</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ONBOARDING_ROADMAP_30_60_90.map((plan, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">{plan.phase}</span>
                  <span className="text-xs font-mono text-slate-400">Phase 0{i + 1}</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900">{plan.theme}</h4>

                <div className="space-y-2">
                  {plan.milestones.map((ms, mi) => (
                    <div key={mi} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>{ms}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Tab 5: Architecture Decision Records (ADRs) */}
      {activeSubTab === 'adrs' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
              Architecture Decision Records
            </span>
            {ARCHITECTURE_DECISION_RECORDS.map((adr) => (
              <button
                key={adr.id}
                onClick={() => setSelectedAdr(adr)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  selectedAdr.id === adr.id
                    ? 'border-amber-500 bg-amber-50/70 shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span>{adr.id}</span>
                  <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">{adr.status}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{adr.title}</h4>
              </button>
            ))}
          </div>

          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono text-amber-700 font-bold">{selectedAdr.id} • {selectedAdr.date}</span>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base mt-0.5">{selectedAdr.title}</h3>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold font-mono">
                {selectedAdr.status}
              </span>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <div>
                <strong className="text-slate-900 block mb-1">Context & Problem Statement:</strong>
                <p className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                  {selectedAdr.context}
                </p>
              </div>

              <div>
                <strong className="text-slate-900 block mb-1">Architectural Decision:</strong>
                <p className="bg-amber-50/50 p-3 rounded-lg border border-amber-200 text-xs text-slate-800">
                  {selectedAdr.decision}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-200 text-xs space-y-1">
                  <strong className="text-emerald-900 block">Positive Consequences:</strong>
                  <ul className="space-y-1 pl-4 list-disc text-emerald-800 text-[11px]">
                    {selectedAdr.consequences.positive.map((pos, pi) => (
                      <li key={pi}>{pos}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-slate-100 rounded-lg border border-slate-200 text-xs space-y-1">
                  <strong className="text-slate-900 block">Trade-offs & Mitigations:</strong>
                  <ul className="space-y-1 pl-4 list-disc text-slate-700 text-[11px]">
                    {selectedAdr.consequences.tradeoffs.map((tro, ti) => (
                      <li key={ti}>{tro}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 6: Operational Health & On-Call */}
      {activeSubTab === 'oncall' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              Operational Excellence & Sustainable On-Call Health
            </h3>
            <p className="text-xs text-slate-500">
              Reliability, observability, and on-call health are first-class engineering commitments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <h4 className="font-bold text-xs text-slate-900">1. Alert Fatigue Elimination</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Only page for actionable customer-facing breaches (e.g. Ingestion p95 &gt; 3.5s or DLQ backlog &gt; 50 docs). 
                All non-actionable warnings go to daytime Slack digests.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <h4 className="font-bold text-xs text-slate-900">2. Blameless Post-Mortems</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Incidents are systemic learning opportunities. Action items are committed to the sprint backlog with IC owners 
                and reviewed within 5 business days.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <h4 className="font-bold text-xs text-slate-900">3. On-Call Recovery Compensation</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                If an engineer is paged after hours, they are granted equivalent rest time off the following day. 
                The EM tracks rotation load to prevent burnout.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
