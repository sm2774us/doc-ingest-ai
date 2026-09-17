import React, { useState } from 'react';
import { 
  Network, 
  Server, 
  Database, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Zap, 
  Flame, 
  RefreshCw, 
  Activity, 
  Radio, 
  Lock, 
  Clock, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';
import { TelemetryMetrics } from '../types';

interface DistributedTopologyViewProps {
  telemetry: TelemetryMetrics | null;
  onSimulateChaos: (action: string) => void;
  isChaosRunning: boolean;
}

export const DistributedTopologyView: React.FC<DistributedTopologyViewProps> = ({
  telemetry,
  onSimulateChaos,
  isChaosRunning,
}) => {
  const [selectedNode, setSelectedNode] = useState<string>('kafka');

  const topologyNodes = [
    {
      id: 'gateway',
      name: 'API Gateway & Ingress',
      category: 'Edge Tier',
      icon: Radio,
      details: 'TLS 1.3, Rate-limiting (Token bucket), Magic Byte MIME validation, Direct-to-S3 presigned upload tokens.',
      metrics: '35,000 req/sec peak • 12ms edge latency',
    },
    {
      id: 'kafka',
      name: 'Event Streaming Bus (Kafka)',
      category: 'Data Bus',
      icon: Network,
      details: '128 partitions keyed by hash(doc_id). Guarantees per-document sequencing, distributed backpressure, and DLQ topic routing.',
      metrics: '284 docs/sec • Zero message loss • 3 replicas',
    },
    {
      id: 'sandboxing',
      name: 'Firecracker MicroVM Pool',
      category: 'Security Worker',
      icon: ShieldCheck,
      details: 'Ephemeral microVM execution per document. Disabled host network egress, 1GB memory limits, gVisor sandboxing to defeat parser exploits.',
      metrics: '32 active microVMs • 35ms cold-start warm pool',
    },
    {
      id: 'vlm_inference',
      name: 'Multimodal VLM Inference',
      category: 'Applied AI Tier',
      icon: Cpu,
      details: 'GPU worker pool running Vision-Language Models for layout decomposition, reading order detection, and diagram understanding. Semantic cache avoids re-running known documents.',
      metrics: '78.4% Cache Hit Rate • 620ms p50 inference',
    },
    {
      id: 'storage',
      name: 'Storage & Vector Index',
      category: 'Persistence Tier',
      icon: Database,
      details: 'Multi-tiered storage: S3 for raw/rendered page SVGs, Qdrant/Milvus for 1536-dim vector embeddings, and PostgreSQL with Debezium Outbox CDC.',
      metrics: '500M+ documents indexed • 99.99% durability',
    },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Strategic Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-5 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold uppercase tracking-wider border border-cyan-500/30">
                High-Throughput Architecture
              </span>
              <span className="text-xs text-slate-400 font-mono">100M+ Document Scale</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Distributed Streaming Pipeline & Resiliency Architecture
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              An event-driven distributed system designed to process hundreds of millions of untrusted user documents with 
              real-time SLAs, zero-trust sandboxing, backpressure throttling, and automated dead-letter recovery.
            </p>
          </div>

          {/* Chaos Test Quick Triggers */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onSimulateChaos('spike_load')}
              disabled={isChaosRunning}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-600/30 hover:bg-orange-600/50 text-orange-200 border border-orange-500/40 text-xs font-semibold transition-colors"
            >
              <Flame className="w-4 h-4 text-orange-400" />
              <span>100k Spike</span>
            </button>
            <button
              onClick={() => onSimulateChaos('worker_fail')}
              disabled={isChaosRunning}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-600/30 hover:bg-red-600/50 text-red-200 border border-red-500/40 text-xs font-semibold transition-colors"
            >
              <Zap className="w-4 h-4 text-red-400" />
              <span>Crash Worker</span>
            </button>
            <button
              onClick={() => onSimulateChaos('dlq_drain')}
              disabled={isChaosRunning}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-500/40 text-xs font-semibold transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-emerald-400" />
              <span>Drain DLQ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Observability Metrics Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">p95 Latency</span>
          <div className="text-lg font-bold font-mono text-slate-900">
            {telemetry?.p95LatencyMs || 1820}ms
          </div>
          <span className="text-[10px] text-emerald-600 font-medium">Target: &lt; 2000ms</span>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">Throughput Rate</span>
          <div className="text-lg font-bold font-mono text-slate-900">
            {telemetry?.ingestionThroughputPerSec || 284}/s
          </div>
          <span className="text-[10px] text-slate-500">docs ingested/sec</span>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">VLM Cache Hit</span>
          <div className="text-lg font-bold font-mono text-indigo-600">
            {telemetry?.vlmCacheHitRatePercent || 78.4}%
          </div>
          <span className="text-[10px] text-slate-500">GPU cost optimized</span>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">DLQ Dead-Letter</span>
          <div className={`text-lg font-bold font-mono ${telemetry?.dlqDeadLetterCount ? 'text-amber-600' : 'text-slate-900'}`}>
            {telemetry?.dlqDeadLetterCount || 0}
          </div>
          <span className="text-[10px] text-slate-500">auto-retry buffered</span>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">Error Budget</span>
          <div className="text-lg font-bold font-mono text-emerald-600">
            {telemetry?.errorBudgetRemainingPercent || 99.98}%
          </div>
          <span className="text-[10px] text-slate-500">30-day window</span>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">Corpus Scale</span>
          <div className="text-lg font-bold font-mono text-slate-900 truncate">
            {telemetry?.totalCorpusProcessedPages || '482M'}
          </div>
          <span className="text-[10px] text-slate-500">total processed pages</span>
        </div>
      </div>

      {/* Visual Interactive Topology Canvas */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-white shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Network className="w-4 h-4 text-cyan-400" />
              Event-Driven Pipeline Topology (Live Node Status)
            </h3>
            <p className="text-xs text-slate-400">Click any component to inspect architectural invariants and failure modes</p>
          </div>
          <div className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            CLUSTER: {telemetry?.activeIngestionWorkers || 32} WORKERS ONLINE
          </div>
        </div>

        {/* Node Pipeline Flow */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
          {topologyNodes.map((node, i) => {
            const Icon = node.icon;
            const isSelected = selectedNode === node.id;
            return (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node.id)}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-950/40 ring-2 ring-cyan-400/20 shadow-lg'
                    : 'border-slate-800 bg-slate-900/80 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 uppercase">
                    {node.category}
                  </span>
                  <span className="text-xs font-mono text-cyan-400">0{i + 1}</span>
                </div>

                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center mb-2 text-cyan-400">
                  <Icon className="w-4 h-4" />
                </div>

                <h4 className="text-xs font-bold text-white mb-1">{node.name}</h4>
                <p className="text-[11px] text-slate-400 font-mono line-clamp-1">{node.metrics}</p>
              </div>
            );
          })}
        </div>

        {/* Selected Component Deep Dive */}
        {selectedNode && (
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-cyan-400 uppercase tracking-wider font-mono">
                Component Invariant & Failure Mode: {topologyNodes.find(n => n.id === selectedNode)?.name}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Active Tier: {topologyNodes.find(n => n.id === selectedNode)?.category}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300 leading-relaxed">
              <div className="space-y-1">
                <span className="font-semibold text-white block">Architectural Responsibilities:</span>
                <p className="text-[11px] text-slate-400">
                  {topologyNodes.find(n => n.id === selectedNode)?.details}
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-white block">Resiliency & Failure Mitigation:</span>
                <p className="text-[11px] text-slate-400">
                  {selectedNode === 'kafka' && 'If downstream consumers stall, Kafka buffers events without dropping. Auto-rebalance protocol prevents message duplication via idempotent producer IDs.'}
                  {selectedNode === 'sandboxing' && 'If a malformed PDF triggers a parser panic or memory exhaustion, the single Firecracker microVM is killed immediately with zero blast radius on the host.'}
                  {selectedNode === 'vlm_inference' && 'If GPU inference queue spikes beyond 1.5s, the system automatically engages the high-speed heuristic fallback parser, ensuring the reader receives page 1 on time.'}
                  {selectedNode === 'gateway' && 'Global Anycast IP with Cloudflare DDoS protection; direct-to-S3 pre-signed upload bypasses application memory buffers for large 500MB slide decks.'}
                  {selectedNode === 'storage' && 'Transactional Outbox pattern via PostgreSQL + Debezium ensures dual-writes between relational metadata and vector indexes are atomic and exactly-once.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
