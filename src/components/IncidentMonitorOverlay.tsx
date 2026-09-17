import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  X, 
  Zap, 
  Flame, 
  RefreshCw, 
  CheckCircle2, 
  Activity, 
  ChevronRight, 
  Server, 
  Clock
} from 'lucide-react';
import { TelemetryMetrics, SloIncident } from '../types';

interface IncidentMonitorOverlayProps {
  telemetry: TelemetryMetrics | null;
  onSimulateChaos: (action: string) => void;
}

export const IncidentMonitorOverlay: React.FC<IncidentMonitorOverlayProps> = ({
  telemetry,
  onSimulateChaos,
}) => {
  const [activeIncident, setActiveIncident] = useState<SloIncident | null>(null);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [isRemediating, setIsRemediating] = useState<boolean>(false);
  const [remediatedMsg, setRemediatedMsg] = useState<string | null>(null);

  // Monitor telemetry thresholds in real time
  useEffect(() => {
    if (!telemetry) return;

    // Check for SLO threshold breaches: p95 > 2500ms or DLQ > 5 or workers dropped under load
    if (telemetry.p95LatencyMs > 2500 || telemetry.dlqDeadLetterCount > 5) {
      setIsDismissed(false);
      const isDLQ = telemetry.dlqDeadLetterCount > 5;
      const isWorkerFail = telemetry.activeIngestionWorkers < 20;

      setActiveIncident({
        id: `inc-${Date.now().toString().slice(-6)}`,
        severity: isWorkerFail ? 'CRITICAL' : 'HIGH',
        impactedService: isWorkerFail
          ? 'Firecracker-Worker-Pool-us-west2'
          : isDLQ
          ? 'Kafka-Dead-Letter-Queue-Consumer'
          : 'VLM-Inference-Pool-GPU-L4',
        breachedSlo: isDLQ
          ? `Dead-Letter Queue Backlog (${telemetry.dlqDeadLetterCount} > 5 doc threshold)`
          : `p95 Ingestion Latency (${telemetry.p95LatencyMs}ms > 2500ms SLO Target)`,
        currentValue: isDLQ ? `${telemetry.dlqDeadLetterCount} docs` : `${telemetry.p95LatencyMs}ms`,
        thresholdValue: isDLQ ? '5 docs' : '2500ms',
        timestamp: new Date().toLocaleTimeString(),
        rootCauseHeuristic: isWorkerFail
          ? 'Worker crash detected in zone us-west-2a. Unhandled exception in malformed PDF decompression triggered pod eviction.'
          : isDLQ
          ? 'Repeated downstream timeout publishing to Vector Database index. Poison pills diverted to DLQ topic.'
          : 'Sudden spike in high-density SlideShare presentation uploads causing temporary VLM inference queue saturation.',
        blastRadius: 'Isolated to asynchronous UGC background ingestion. Reader CDN & live Speechify playback remain 100% operational.',
        status: 'TRIGGERED',
        runbookActions: [
          {
            id: 'autoscale_workers',
            label: 'Auto-Scale Worker Pool (+64 pods)',
            description: 'Trigger horizontal pod autoscaler to double Firecracker microVM concurrency.',
          },
          {
            id: 'heuristic_fallback',
            label: 'Engage Fast-Path Heuristic Parser',
            description: 'Bypass heavy GPU VLM layer for simple text documents to restore p95 under 1.8s.',
          },
          {
            id: 'drain_dlq',
            label: 'Drain & Replay Poison Pill DLQ',
            description: 'Reroute quarantined documents through isolated debug sandbox with verbose tracing.',
          },
        ],
      });
    } else {
      if (!isRemediating) {
        setActiveIncident(null);
        setRemediatedMsg(null);
      }
    }
  }, [telemetry]);

  const handleExecuteRemediation = (actionId: string) => {
    setIsRemediating(true);
    setRemediatedMsg(`Executing Runbook Action: ${actionId}...`);

    setTimeout(() => {
      onSimulateChaos('reset');
      setIsRemediating(false);
      setRemediatedMsg('Auto-Remediation Successful: Cluster returned to Healthy state (p95: 1820ms).');
      setTimeout(() => {
        setActiveIncident(null);
        setRemediatedMsg(null);
      }, 2500);
    }, 1200);
  };

  if (!activeIncident || isDismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-lg w-full px-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-slate-950 border-2 border-red-500 text-white rounded-2xl shadow-2xl p-4 space-y-3 font-sans ring-4 ring-red-500/20">
        {/* Banner Alert Bar */}
        <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-red-500 text-slate-950 text-[10px] font-black uppercase font-mono tracking-wider">
                  SLO BREACH INCIDENT
                </span>
                <span className="text-xs font-mono text-red-400 font-bold">
                  {activeIncident.id}
                </span>
              </div>
              <h4 className="text-xs font-bold text-white mt-0.5">
                {activeIncident.breachedSlo}
              </h4>
            </div>
          </div>

          <button
            onClick={() => setIsDismissed(true)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Impacted Microservice & Metrics */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Impacted Microservice:</span>
            <span className="text-red-400 font-bold truncate block">{activeIncident.impactedService}</span>
          </div>
          <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Current vs SLO Threshold:</span>
            <span className="text-amber-400 font-bold">{activeIncident.currentValue} / {activeIncident.thresholdValue}</span>
          </div>
        </div>

        {/* Root cause analysis */}
        <div className="p-2.5 bg-slate-900/90 rounded-lg border border-slate-800 text-[11px] space-y-1">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold font-mono text-[10px]">
            <AlertTriangle className="w-3 h-3" />
            <span>HEURISTIC ROOT CAUSE:</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            {activeIncident.rootCauseHeuristic}
          </p>
          <div className="pt-1 text-slate-400 text-[10px]">
            <strong>Blast Radius: </strong>{activeIncident.blastRadius}
          </div>
        </div>

        {/* Remediation message */}
        {remediatedMsg && (
          <div className="p-2 bg-emerald-950 border border-emerald-500/50 rounded-lg text-xs text-emerald-300 flex items-center gap-1.5 font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>{remediatedMsg}</span>
          </div>
        )}

        {/* One-Click Runbook Actions */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] font-mono text-slate-400 font-semibold block uppercase">
            Execute On-Call Runbook Mitigation:
          </span>
          <div className="grid grid-cols-1 gap-1.5">
            {activeIncident.runbookActions.map((act) => (
              <button
                key={act.id}
                onClick={() => handleExecuteRemediation(act.id)}
                disabled={isRemediating}
                className="flex items-center justify-between p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/80 text-left transition-colors text-xs disabled:opacity-50"
              >
                <div>
                  <span className="font-bold text-red-200 block">{act.label}</span>
                  <span className="text-[10px] text-slate-400">{act.description}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-red-400 flex-shrink-0 ml-2" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
