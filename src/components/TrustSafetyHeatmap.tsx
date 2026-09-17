import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Flame, 
  Eye, 
  RefreshCw, 
  CheckCircle2, 
  Layers, 
  FileText, 
  Sliders, 
  Activity,
  Lock
} from 'lucide-react';
import { 
  MODERATION_CATEGORIES, 
  MODERATION_VIOLATION_TYPES, 
  INITIAL_HEATMAP_CELLS 
} from '../data/moderationHeatmapData';
import { ModerationHeatmapCell } from '../types';

export const TrustSafetyHeatmap: React.FC = () => {
  const [cells, setCells] = useState<ModerationHeatmapCell[]>(INITIAL_HEATMAP_CELLS);
  const [selectedCell, setSelectedCell] = useState<ModerationHeatmapCell>(INITIAL_HEATMAP_CELLS[10]); // default UGC PDF Prompt Injection
  const [timeWindow, setTimeWindow] = useState<'1h' | '24h' | '7d'>('24h');
  const [isSimulatingSurge, setIsSimulatingSurge] = useState<boolean>(false);

  const getCellData = (category: string, violation: string): ModerationHeatmapCell => {
    return (
      cells.find((c) => c.category === category && c.violationType === violation) || {
        id: `cell-${category}-${violation}`,
        category: category as any,
        violationType: violation as any,
        incidentCount: 0,
        riskScore: 0,
        recentFlagSnippet: 'No incidents recorded in window.',
        proactiveMitigation: 'Standard zero-trust validation active.',
      }
    );
  };

  const getHeatmapColor = (riskScore: number) => {
    if (riskScore >= 85) return 'bg-red-500 text-white font-bold hover:bg-red-600';
    if (riskScore >= 65) return 'bg-orange-500 text-white font-bold hover:bg-orange-600';
    if (riskScore >= 40) return 'bg-amber-400 text-slate-950 font-semibold hover:bg-amber-500';
    if (riskScore >= 15) return 'bg-emerald-100 text-emerald-800 font-medium hover:bg-emerald-200';
    return 'bg-slate-100 text-slate-500 hover:bg-slate-200';
  };

  const handleSimulateSurge = () => {
    setIsSimulatingSurge(true);
    setTimeout(() => {
      setCells((prev) =>
        prev.map((c) => {
          if (c.violationType === 'Prompt Injection' || c.violationType === 'Leaked PII / Credentials') {
            return {
              ...c,
              incidentCount: c.incidentCount + Math.floor(Math.random() * 8 + 3),
              riskScore: Math.min(99, c.riskScore + 5),
            };
          }
          return c;
        })
      );
      setIsSimulatingSurge(false);
    }, 600);
  };

  const totalIncidents = cells.reduce((acc, c) => acc + c.incidentCount, 0);
  const highRiskCount = cells.filter((c) => c.riskScore >= 80).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-red-50 text-red-600">
              <ShieldAlert className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Trust & Safety Flagged Content Distribution Heatmap
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-50 text-red-700 font-semibold border border-red-200">
              Real-Time Moderation Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Visualizing real-time moderation violations and proactive quarantine enforcement across Scribd and SlideShare content categories.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-mono">
            {(['1h', '24h', '7d'] as const).map((tw) => (
              <button
                key={tw}
                onClick={() => setTimeWindow(tw)}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  timeWindow === tw
                    ? 'bg-white text-slate-900 font-bold shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tw.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={handleSimulateSurge}
            disabled={isSimulatingSurge}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold transition-colors disabled:opacity-50"
            title="Simulate sudden UGC injection surge"
          >
            <Flame className="w-3.5 h-3.5 text-red-500" />
            <span>Simulate Attack Surge</span>
          </button>
        </div>
      </div>

      {/* Aggregate KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">Total Flagged Incidents</span>
          <div className="text-xl font-bold font-mono text-slate-900">{totalIncidents}</div>
          <span className="text-[10px] text-slate-500">across 6 corpus categories</span>
        </div>

        <div className="p-3 rounded-xl border border-red-200 bg-red-50/50">
          <span className="text-[10px] font-mono text-red-500 uppercase block">High-Risk Cells</span>
          <div className="text-xl font-bold font-mono text-red-700">{highRiskCount} Active</div>
          <span className="text-[10px] text-red-600 font-medium">Auto-quarantine active</span>
        </div>

        <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">PII Scrubbing Precision</span>
          <div className="text-xl font-bold font-mono text-emerald-600">99.94%</div>
          <span className="text-[10px] text-slate-500">zero leaks to public index</span>
        </div>

        <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">Parser Blast Radius</span>
          <div className="text-xl font-bold font-mono text-indigo-600">0 Host Breaches</div>
          <span className="text-[10px] text-slate-500">100% Firecracker microVM contained</span>
        </div>
      </div>

      {/* Heatmap Grid Matrix */}
      <div className="space-y-2">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="p-2.5 text-xs font-bold text-slate-700 bg-slate-50 rounded-tl-xl border-b border-slate-200">
                  Document Category
                </th>
                {MODERATION_VIOLATION_TYPES.map((vType) => (
                  <th
                    key={vType}
                    className="p-2.5 text-[11px] font-semibold text-slate-700 bg-slate-50 border-b border-slate-200 text-center whitespace-nowrap"
                  >
                    {vType}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-sans">
              {MODERATION_CATEGORIES.map((cat) => (
                <tr key={cat} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-2.5 font-semibold text-slate-800 whitespace-nowrap">
                    {cat}
                  </td>
                  {MODERATION_VIOLATION_TYPES.map((vType) => {
                    const data = getCellData(cat, vType);
                    const isSelected =
                      selectedCell.category === cat && selectedCell.violationType === vType;

                    return (
                      <td key={vType} className="p-1.5 text-center">
                        <button
                          onClick={() => setSelectedCell(data)}
                          className={`w-full py-2.5 px-2 rounded-lg text-center transition-all cursor-pointer font-mono text-xs ${getHeatmapColor(
                            data.riskScore
                          )} ${
                            isSelected
                              ? 'ring-2 ring-slate-900 ring-offset-1 scale-[1.03] shadow-md'
                              : 'shadow-xs'
                          }`}
                        >
                          <div className="font-bold">{data.incidentCount}</div>
                          <div className="text-[9px] opacity-85">Risk {data.riskScore}</div>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[10px] font-mono text-slate-500">
          <span>Click any cell to inspect the malicious snippet and proactive mitigation rule</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-slate-100 border border-slate-300"></span> Minimal (&lt;15)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-emerald-100 border border-emerald-300"></span> Low (15-39)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-amber-400"></span> Moderate (40-64)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-orange-500"></span> Elevated (65-84)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-red-500"></span> Critical (85-100)
            </span>
          </div>
        </div>
      </div>

      {/* Selected Cell Deep Dive Inspector */}
      {selectedCell && (
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-2">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase">
                CELL TELEMETRY INSPECTOR
              </span>
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <span>{selectedCell.category}</span>
                <span className="text-slate-400">→</span>
                <span className="text-red-600">{selectedCell.violationType}</span>
              </h4>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <span>Incidents (24h): <strong className="text-slate-900">{selectedCell.incidentCount}</strong></span>
              <span>Risk Score: <strong className={selectedCell.riskScore >= 70 ? 'text-red-600' : 'text-amber-600'}>{selectedCell.riskScore}/100</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1 bg-white p-3 rounded-lg border border-slate-200">
              <span className="font-semibold text-slate-700 block flex items-center gap-1 text-[11px]">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                Recent Flagged Payload / Snippet:
              </span>
              <p className="text-slate-600 font-mono text-[11px] bg-slate-50 p-2 rounded border border-slate-200 leading-relaxed">
                "{selectedCell.recentFlagSnippet}"
              </p>
            </div>

            <div className="space-y-1 bg-white p-3 rounded-lg border border-slate-200">
              <span className="font-semibold text-slate-700 block flex items-center gap-1 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Proactive Content Foundations Mitigation:
              </span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {selectedCell.proactiveMitigation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
