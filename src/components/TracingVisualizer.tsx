import React, { useState } from 'react';
import { 
  Activity, 
  Clock, 
  Layers, 
  ShieldCheck, 
  Cpu, 
  Database, 
  Radio, 
  CheckCircle2, 
  AlertTriangle, 
  Filter, 
  Search, 
  ChevronRight, 
  Info,
  Maximize2
} from 'lucide-react';
import { IngestionJob, TraceSpan, JobDistributedTrace } from '../types';

interface TracingVisualizerProps {
  currentJob: IngestionJob | null;
}

export const TracingVisualizer: React.FC<TracingVisualizerProps> = ({ currentJob }) => {
  const [selectedSpan, setSelectedSpan] = useState<TraceSpan | null>(null);
  const [serviceFilter, setServiceFilter] = useState<string>('ALL');
  const [highlightService, setHighlightService] = useState<'ALL' | 'content_foundations' | 'trust_safety' | 'ai_embedding'>('ALL');

  // If no trace is attached to the job yet, generate a comprehensive realistic OpenTelemetry trace
  const trace: JobDistributedTrace = currentJob?.distributedTrace || {
    traceId: `trace-${currentJob?.id?.slice(0, 8) || '4f810e92'}-9821`,
    rootService: 'ingress-gateway',
    totalDurationMs: currentJob?.totalLatencyMs || 1820,
    criticalPathMs: currentJob?.totalLatencyMs ? Math.round(currentJob.totalLatencyMs * 0.92) : 1674,
    spans: [
      {
        id: 'span-01',
        traceId: `trace-${currentJob?.id?.slice(0, 8) || '4f810e92'}-9821`,
        serviceName: 'ingress-gateway',
        operationName: 'POST /v2/documents/upload [Ingress Gateway]',
        startTimeOffsetMs: 0,
        durationMs: 42,
        status: 'OK',
        attributes: {
          'http.method': 'POST',
          'http.status_code': 200,
          'document.brand': currentJob?.sourceBrand || 'slideshare',
          'tls.version': 'TLS 1.3',
          'rate_limit.remaining': 994,
          'client.region': 'us-west-2',
        },
      },
      {
        id: 'span-02',
        traceId: `trace-${currentJob?.id?.slice(0, 8) || '4f810e92'}-9821`,
        parentSpanId: 'span-01',
        serviceName: 'firecracker-sandbox',
        operationName: 'sandbox.microvm.spawn [Content Foundations Sandbox]',
        startTimeOffsetMs: 38,
        durationMs: 145,
        status: 'OK',
        attributes: {
          'sandbox.runtime': 'Firecracker v1.4.1',
          'sandbox.network_egress': 'DISABLED_ISOLATED',
          'sandbox.memory_limit_mb': 1024,
          'mime.magic_bytes_verified': true,
          'parser.format': currentJob?.mimeType || 'application/pdf',
        },
      },
      {
        id: 'span-03',
        traceId: `trace-${currentJob?.id?.slice(0, 8) || '4f810e92'}-9821`,
        parentSpanId: 'span-02',
        serviceName: 'vlm-multimodal-parser',
        operationName: 'vlm.gemini.multimodal_extraction [AI Layout Engine]',
        startTimeOffsetMs: 180,
        durationMs: 840,
        status: 'OK',
        attributes: {
          'ai.model': 'gemini-3.8-flash',
          'ai.cache_hit': false,
          'vlm.pages_rendered': 12,
          'vlm.reading_order_detected': true,
          'vlm.visual_elements_count': currentJob?.vlmExtraction?.visualElements.length || 3,
        },
      },
      {
        id: 'span-04',
        traceId: `trace-${currentJob?.id?.slice(0, 8) || '4f810e92'}-9821`,
        parentSpanId: 'span-03',
        serviceName: 'trust-safety-audit',
        operationName: 'safety.audit.pii_and_adversarial_scan [Trust & Safety Service]',
        startTimeOffsetMs: 1015,
        durationMs: 165,
        status: currentJob?.safetyAudit?.verdict === 'QUARANTINED' ? 'ERROR' : 'OK',
        attributes: {
          'safety.verdict': currentJob?.safetyAudit?.verdict || 'PASSED',
          'safety.pii_detected_count': currentJob?.safetyAudit?.piiDetected.length || 0,
          'safety.prompt_injection_risk': currentJob?.safetyAudit?.promptInjectionRisk || 'NONE',
          'safety.trust_score': currentJob?.safetyAudit?.trustScore || 96,
          'safety.rules_evaluated': 48,
        },
      },
      {
        id: 'span-05',
        traceId: `trace-${currentJob?.id?.slice(0, 8) || '4f810e92'}-9821`,
        parentSpanId: 'span-03',
        serviceName: 'semantic-vector-chunker',
        operationName: 'chunking.vectorize.semantic_embeddings [AI Embedding Service]',
        startTimeOffsetMs: 1175,
        durationMs: 380,
        status: 'OK',
        attributes: {
          'chunker.strategy': currentJob?.chunkingAnalysis?.strategy || 'semantic_vlm',
          'chunker.total_chunks': currentJob?.chunkingAnalysis?.totalChunks || 8,
          'embedding.model': 'text-embedding-004',
          'embedding.dimensions': 1536,
          'vector.boundary_score': '98.4%',
        },
      },
      {
        id: 'span-06',
        traceId: `trace-${currentJob?.id?.slice(0, 8) || '4f810e92'}-9821`,
        parentSpanId: 'span-05',
        serviceName: 'speechify-token-streamer',
        operationName: 'speechify.tts.dual_dispatch [Speechify Narration Tokenizer]',
        startTimeOffsetMs: 1550,
        durationMs: 160,
        status: 'OK',
        attributes: {
          'speechify.audio_duration_sec': currentJob?.speechifyStream?.totalDurationSeconds || 94,
          'speechify.segments_generated': currentJob?.speechifyStream?.segments.length || 6,
          'speechify.voice': 'Kore (Neural Studio)',
          'speechify.word_offsets_synced': true,
        },
      },
      {
        id: 'span-07',
        traceId: `trace-${currentJob?.id?.slice(0, 8) || '4f810e92'}-9821`,
        parentSpanId: 'span-01',
        serviceName: 'downstream-kafka-bus',
        operationName: 'kafka.producer.publish_event [Downstream Event Bus]',
        startTimeOffsetMs: 1705,
        durationMs: 85,
        status: 'OK',
        attributes: {
          'kafka.topic': 'content.ingested.v2',
          'kafka.partition': 14,
          'kafka.ack_mode': 'all (acks=-1)',
          'schema.version': '2026.04-contracts',
        },
      },
    ],
  };

  const getServiceColor = (serviceName: string) => {
    switch (serviceName) {
      case 'ingress-gateway':
      case 'firecracker-sandbox':
        return {
          bg: 'bg-amber-500',
          text: 'text-amber-400',
          border: 'border-amber-400',
          pill: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
          label: 'Content Foundations',
        };
      case 'trust-safety-audit':
        return {
          bg: 'bg-red-500',
          text: 'text-red-400',
          border: 'border-red-400',
          pill: 'bg-red-500/10 text-red-300 border-red-500/30',
          label: 'Trust & Safety',
        };
      case 'vlm-multimodal-parser':
      case 'semantic-vector-chunker':
        return {
          bg: 'bg-indigo-500',
          text: 'text-indigo-400',
          border: 'border-indigo-400',
          pill: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
          label: 'AI Embedding & VLM',
        };
      case 'speechify-token-streamer':
        return {
          bg: 'bg-emerald-500',
          text: 'text-emerald-400',
          border: 'border-emerald-400',
          pill: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
          label: 'Speechify Audio',
        };
      default:
        return {
          bg: 'bg-cyan-500',
          text: 'text-cyan-400',
          border: 'border-cyan-400',
          pill: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
          label: 'Data Bus',
        };
    }
  };

  const isHighlighted = (span: TraceSpan) => {
    if (highlightService === 'ALL') return true;
    if (highlightService === 'content_foundations') {
      return span.serviceName === 'ingress-gateway' || span.serviceName === 'firecracker-sandbox';
    }
    if (highlightService === 'trust_safety') {
      return span.serviceName === 'trust-safety-audit';
    }
    if (highlightService === 'ai_embedding') {
      return span.serviceName === 'semantic-vector-chunker' || span.serviceName === 'vlm-multimodal-parser';
    }
    return true;
  };

  const filteredSpans = trace.spans.filter((s) => {
    if (serviceFilter === 'ALL') return true;
    return s.serviceName === serviceFilter;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-xl space-y-5 font-sans">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Activity className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Distributed Span Tracing Visualizer
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              Trace: {trace.traceId}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time OpenTelemetry trace breakdown across Content Foundations, Trust & Safety, and AI Embedding services.
          </p>
        </div>

        {/* Latency Summary Metrics */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Total Latency:</span>
            <strong className="text-emerald-400 text-sm">{trace.totalDurationMs}ms</strong>
          </div>
          <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Critical Path:</span>
            <strong className="text-amber-400 text-sm">{trace.criticalPathMs}ms</strong>
          </div>
        </div>
      </div>

      {/* Service Highlight Quick Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-semibold text-[11px]">Highlight Service Latency:</span>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'ALL', label: 'All Services' },
              { id: 'content_foundations', label: 'Content Foundations' },
              { id: 'trust_safety', label: 'Trust & Safety' },
              { id: 'ai_embedding', label: 'AI Embedding Service' },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setHighlightService(btn.id as any)}
                className={`px-2.5 py-1 rounded-lg font-medium text-[11px] transition-colors ${
                  highlightService === btn.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status Legend */}
        <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> OK
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> Degraded
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500"></span> Quarantined / Error
          </span>
        </div>
      </div>

      {/* Waterfall Gantt Chart */}
      <div className="space-y-2">
        {/* Time Scale Axis */}
        <div className="grid grid-cols-12 text-[10px] font-mono text-slate-500 pb-1 border-b border-slate-800 px-2">
          <span className="col-span-4">Span / Operation Name</span>
          <span className="col-span-1 text-center">0ms</span>
          <span className="col-span-2 text-center">{Math.round(trace.totalDurationMs * 0.25)}ms</span>
          <span className="col-span-2 text-center">{Math.round(trace.totalDurationMs * 0.5)}ms</span>
          <span className="col-span-2 text-center">{Math.round(trace.totalDurationMs * 0.75)}ms</span>
          <span className="col-span-1 text-right">{trace.totalDurationMs}ms</span>
        </div>

        {/* Spans List */}
        <div className="space-y-1.5">
          {filteredSpans.map((span) => {
            const color = getServiceColor(span.serviceName);
            const activeHighlight = isHighlighted(span);
            const leftPercent = Math.min(95, (span.startTimeOffsetMs / trace.totalDurationMs) * 100);
            const widthPercent = Math.max(3, (span.durationMs / trace.totalDurationMs) * 100);
            const isSelected = selectedSpan?.id === span.id;

            return (
              <div
                key={span.id}
                onClick={() => setSelectedSpan(span)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800/90 border-amber-400 shadow-md ring-1 ring-amber-400/30'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                } ${!activeHighlight ? 'opacity-30' : 'opacity-100'}`}
              >
                <div className="grid grid-cols-12 gap-2 items-center">
                  {/* Left Column: Operation & Service Tag */}
                  <div className="col-span-12 sm:col-span-4 flex items-center justify-between pr-2">
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${color.bg}`}></span>
                        <span className="text-xs font-semibold text-slate-200 truncate" title={span.operationName}>
                          {span.operationName}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${color.pill}`}>
                          {color.label}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {span.serviceName}
                        </span>
                      </div>
                    </div>

                    <span className="text-[11px] font-mono text-slate-300 font-bold sm:hidden">
                      {span.durationMs}ms
                    </span>
                  </div>

                  {/* Right Column: Timeline Bar */}
                  <div className="col-span-12 sm:col-span-8 relative h-6 bg-slate-900/90 rounded-lg overflow-hidden border border-slate-800/60 flex items-center">
                    {/* Grid line markers */}
                    <div className="absolute inset-0 grid grid-cols-4 pointer-events-none opacity-20 divide-x divide-slate-700">
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>

                    {/* Active Span Duration Pill */}
                    <div
                      className={`absolute h-4 rounded-md transition-all flex items-center justify-between px-2 text-[10px] font-mono font-bold shadow ${color.bg} text-slate-950`}
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                        minWidth: '42px',
                      }}
                    >
                      <span className="truncate">{span.durationMs}ms</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Span Detail Inspector Card */}
      {selectedSpan && (
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <span className="text-[10px] font-mono text-slate-400">SPAN INSPECTOR</span>
              <h4 className="text-xs font-bold text-amber-400 font-mono">
                {selectedSpan.operationName}
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-300">
                Duration: <strong className="text-emerald-400">{selectedSpan.durationMs}ms</strong> ({((selectedSpan.durationMs / trace.totalDurationMs) * 100).toFixed(1)}% of total)
              </span>
              <button
                onClick={() => setSelectedSpan(null)}
                className="text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs font-mono">
            <div className="p-2 bg-slate-900 rounded border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Service:</span>
              <span className="text-slate-200">{selectedSpan.serviceName}</span>
            </div>
            <div className="p-2 bg-slate-900 rounded border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Span Status:</span>
              <span className={selectedSpan.status === 'OK' ? 'text-emerald-400' : 'text-red-400'}>
                {selectedSpan.status}
              </span>
            </div>
            <div className="p-2 bg-slate-900 rounded border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Offset Start:</span>
              <span className="text-slate-200">+{selectedSpan.startTimeOffsetMs}ms</span>
            </div>
            <div className="p-2 bg-slate-900 rounded border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Span ID:</span>
              <span className="text-slate-200">{selectedSpan.id}</span>
            </div>
          </div>

          {/* Span Attributes Key-Value Table */}
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 block">Span Attributes & RPC Metadata:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] font-mono">
              {Object.entries(selectedSpan.attributes).map(([key, val]) => (
                <div key={key} className="p-1.5 bg-slate-900 rounded border border-slate-800/80 flex items-center justify-between">
                  <span className="text-slate-400">{key}:</span>
                  <span className="text-amber-300 font-bold truncate max-w-[200px]">{String(val)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
