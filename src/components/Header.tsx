import React from 'react';
import { 
  Layers, 
  Headphones, 
  Share2, 
  Network, 
  Users, 
  Activity, 
  Zap, 
  Flame, 
  RefreshCw, 
  FileText,
  ShieldAlert,
  GitBranch
} from 'lucide-react';
import { TelemetryMetrics } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  telemetry: TelemetryMetrics | null;
  onSimulateChaos: (action: string) => void;
  isChaosRunning: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  telemetry,
  onSimulateChaos,
  isChaosRunning,
}) => {
  const tabs = [
    { id: 'ingestion', label: 'Live Ingestion Engine', icon: Layers, badge: 'Real-Time VLM' },
    { id: 'speechify', label: 'Speechify Audio Studio', icon: Headphones, badge: 'Dual Delivery' },
    { id: 'contracts', label: 'Downstream Contracts & RAG', icon: Share2, badge: 'Platform API' },
    { id: 'traces', label: 'Tracing Visualizer', icon: Activity, badge: 'Spans & Latency' },
    { id: 'moderation', label: 'Trust & Safety Heatmap', icon: ShieldAlert, badge: 'Proactive Ops' },
    { id: 'decision_tree', label: 'Chunking Decision Tree', icon: GitBranch, badge: 'Dynamic Heuristic' },
    { id: 'topology', label: 'Distributed Systems & Resiliency', icon: Network, badge: 'Kafka / MicroVM' },
    { id: 'em_os', label: 'Engineering Manager OS', icon: Users, badge: 'Leadership' },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-lg">
      {/* Scribd Multi-Brand Bar */}
      <div className="bg-slate-950/80 px-4 py-1.5 text-xs border-b border-slate-800/80 flex flex-wrap items-center justify-between">
        <div className="flex items-center gap-4 text-slate-400">
          <span className="font-semibold text-slate-300">SCRIBD, INC. ECOSYSTEM:</span>
          <span className="flex items-center gap-1 hover:text-amber-400 transition-colors">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Scribd®
          </span>
          <span className="flex items-center gap-1 hover:text-blue-400 transition-colors">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> SlideShare®
          </span>
          <span className="flex items-center gap-1 hover:text-emerald-400 transition-colors">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Everand™
          </span>
          <span className="flex items-center gap-1 hover:text-purple-400 transition-colors">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span> Fable
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300 font-medium">Corpus Scale: 100M+ Knowledge Artifacts</span>
        </div>

        {/* Live Ingestion Health Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-emerald-400 font-medium">CLUSTER STATUS: HEALTHY</span>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-slate-400 font-mono text-[11px] border-l border-slate-800 pl-3">
            <span>p95: <strong className="text-slate-200">{telemetry?.p95LatencyMs || 1820}ms</strong></span>
            <span>Workers: <strong className="text-slate-200">{telemetry?.activeIngestionWorkers || 32}</strong></span>
            <span>Rate: <strong className="text-slate-200">{telemetry?.ingestionThroughputPerSec || 284}/s</strong></span>
          </div>
        </div>
      </div>

      {/* Primary Brand & Role Header */}
      <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shadow-md shadow-amber-500/20">
            <FileText className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Content Foundations
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-medium">
                  Real-Time AI Ingestion
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              Senior Engineering Manager Showcase • Distributed Systems, VLM Parsing & Speechify Dual Delivery
            </p>
          </div>
        </div>

        {/* Chaos & Resiliency Controls */}
        <div className="flex items-center gap-2">
          <button
            id="btn-spike-load"
            onClick={() => onSimulateChaos('spike_load')}
            disabled={isChaosRunning}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-colors"
            title="Simulate 100k docs/min spike load to test autoscaling & backpressure"
          >
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>Simulate Load Spike</span>
          </button>

          <button
            id="btn-worker-fail"
            onClick={() => onSimulateChaos('worker_fail')}
            disabled={isChaosRunning}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-colors"
            title="Simulate worker crash to test DLQ & auto-rebalancing"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Worker Crash Test</span>
          </button>

          <button
            id="btn-reset-cluster"
            onClick={() => onSimulateChaos('reset')}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
            title="Reset cluster metrics"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <nav className="flex px-4 border-t border-slate-800 overflow-x-auto no-scrollbar gap-1 bg-slate-900/60">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-2.5 px-3.5 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
                isActive
                  ? 'border-amber-400 text-amber-400 bg-amber-400/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                  isActive
                    ? 'bg-amber-400/20 text-amber-300'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};
