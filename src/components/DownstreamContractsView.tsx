import React, { useState } from 'react';
import { 
  Share2, 
  ShieldCheck, 
  Brain, 
  Sparkles, 
  Layers, 
  Headphones, 
  Code, 
  Check, 
  Copy, 
  Send, 
  ArrowRight,
  Database,
  Search,
  ExternalLink,
  Cpu,
  Award
} from 'lucide-react';
import { IngestionJob, RagQueryResult } from '../types';
import { EvaluationSandbox } from './EvaluationSandbox';

interface DownstreamContractsViewProps {
  currentJob: IngestionJob | null;
  onQueryRAG: (query: string) => Promise<RagQueryResult | null>;
}

export const DownstreamContractsView: React.FC<DownstreamContractsViewProps> = ({
  currentJob,
  onQueryRAG,
}) => {
  const [activeSubMode, setActiveSubMode] = useState<'contracts' | 'evaluation'>('contracts');
  const [selectedConsumer, setSelectedConsumer] = useState<'ai_platform' | 'trust_safety' | 'content_understanding' | 'supply' | 'speechify'>('ai_platform');
  const [copiedContract, setCopiedContract] = useState(false);
  const [ragQueryText, setRagQueryText] = useState('What are the architectural pillars and latency targets of this ingestion platform?');
  const [isQueryingRAG, setIsQueryingRAG] = useState(false);
  const [ragResult, setRagResult] = useState<RagQueryResult | null>(null);

  const consumers = [
    {
      id: 'ai_platform',
      name: 'AI Platform & RAG Grounding',
      icon: Sparkles,
      tag: 'Vector DB & Agent Citations',
      sla: '< 3.2s from upload to vector index freshness',
      protocol: 'gRPC / Kafka (content.indexed.v2)',
    },
    {
      id: 'trust_safety',
      name: 'Trust & Safety Platform',
      icon: ShieldCheck,
      tag: 'Zero-Trust Quarantine & PII',
      sla: '< 40ms automated PII redaction & injection scan',
      protocol: 'Async Webhook / Event Bus',
    },
    {
      id: 'content_understanding',
      name: 'Content Understanding',
      icon: Brain,
      tag: 'Semantic AST & Taxonomy',
      sla: 'Full AST hierarchy & entity graph within 1.5s',
      protocol: 'Protobuf v3 over gRPC',
    },
    {
      id: 'supply',
      name: 'Supply & Contributor Experience',
      icon: Layers,
      tag: 'UGC Ingress & Page 1 Preview',
      sla: '< 1.8s p95 for instant contributor validation',
      protocol: 'REST / WebSocket Stream',
    },
    {
      id: 'speechify',
      name: 'Speechify Audio Pipeline',
      icon: Headphones,
      tag: 'Synchronized TTS & SSML',
      sla: 'Streaming word offsets ready before audio starts',
      protocol: 'Binary Chunk Stream / JSON Manifest',
    },
  ];

  const handleExecuteRAG = async () => {
    if (!ragQueryText.trim()) return;
    setIsQueryingRAG(true);
    try {
      const result = await onQueryRAG(ragQueryText);
      setRagResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsQueryingRAG(false);
    }
  };

  const copyContractSnippet = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedContract(true);
    setTimeout(() => setCopiedContract(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Strategic Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/50 rounded-2xl p-5 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider border border-indigo-500/30">
                Platform as a Product
              </span>
              <span className="text-xs text-slate-400 font-mono">Service-Level Agreements (SLAs)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Downstream Consumer Contracts & Agent Grounding
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Content Foundations operates as the central data infrastructure engine for Scribd, Inc. 
              Here we showcase the exact schema contracts, SLAs, and live vector grounding endpoints consumed by downstream teams.
            </p>
          </div>
        </div>
      </div>

      {/* Sub-Mode Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2 bg-white p-2 rounded-xl border">
        <button
          onClick={() => setActiveSubMode('contracts')}
          className={`flex items-center gap-2 py-2 px-4 rounded-lg text-xs font-bold transition-colors ${
            activeSubMode === 'contracts'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Downstream Team Interfaces & Protocols</span>
        </button>

        <button
          onClick={() => setActiveSubMode('evaluation')}
          className={`flex items-center gap-2 py-2 px-4 rounded-lg text-xs font-bold transition-colors ${
            activeSubMode === 'evaluation'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-amber-300" />
          <span>RAG Retrieval Accuracy Evaluation Sandbox</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-black">
            NEW
          </span>
        </button>
      </div>

      {activeSubMode === 'evaluation' ? (
        <EvaluationSandbox
          currentJob={currentJob}
          onQueryRAG={onQueryRAG}
        />
      ) : (
        <>
          {/* Consumer Selector Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {consumers.map((c) => {
          const Icon = c.icon;
          const isSelected = selectedConsumer === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedConsumer(c.id as any)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-500/20 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-600' : 'text-slate-500'}`} />
                <span className="text-[10px] font-mono text-slate-400">{c.protocol.split(' ')[0]}</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mb-1">{c.name}</h4>
              <p className="text-[10px] text-slate-500 mb-2">{c.tag}</p>
              <div className="text-[9px] font-mono text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded truncate">
                SLA: {c.sla}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Content Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Interactive Agent Grounding / RAG Playground (Special for AI Platform) */}
        {selectedConsumer === 'ai_platform' ? (
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Live AI Agent Grounding & Retrieval Tester
                </h3>
                <p className="text-xs text-slate-500">
                  Simulate an LLM agent querying Content Foundations vector index with strict citation anchors
                </p>
              </div>
            </div>

            {/* Input Query */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">Test Grounding Query:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={ragQueryText}
                  onChange={(e) => setRagQueryText(e.target.value)}
                  placeholder="Ask a question about the currently ingested document..."
                  className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <button
                  id="btn-execute-rag"
                  onClick={handleExecuteRAG}
                  disabled={isQueryingRAG}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all disabled:opacity-60"
                >
                  {isQueryingRAG ? (
                    <Cpu className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>Query Grounding</span>
                </button>
              </div>
            </div>

            {/* Grounded Response Panel */}
            {ragResult && (
              <div className="p-4 bg-slate-50 rounded-xl border border-indigo-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" />
                    Agent Verified Response:
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                    Confidence: {(ragResult.confidence * 100).toFixed(0)}%
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                  {ragResult.answer}
                </p>

                {/* Citations */}
                <div>
                  <span className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Grounded Citation Anchors:
                  </span>
                  <div className="space-y-1.5">
                    {ragResult.groundedCitations.map((cit, ci) => (
                      <div key={ci} className="p-2.5 bg-white rounded border border-slate-200 text-xs space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                            {cit.citationAnchor}
                          </span>
                          <span className="text-slate-400">Relevance: {(cit.relevanceScore * 100).toFixed(1)}%</span>
                        </div>
                        <p className="text-[11px] text-slate-600 italic">
                          "{cit.textSnippet}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">
                Contract Interface & Integration Guide: {consumers.find(c => c.id === selectedConsumer)?.name}
              </h3>
              <p className="text-xs text-slate-500">
                Detailed protocol specification, failure handling, and backwards compatibility policy
              </p>
            </div>

            <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block">SLA Commitment:</span>
                <p>{consumers.find(c => c.id === selectedConsumer)?.sla}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block">Failure Domains & Backpressure:</span>
                <p>
                  If downstream consumer experiences degraded ingestion capacity, Content Foundations 
                  enforces consumer-side exponential backoff, temporary dead-letter queuing (DLQ) buffering in Kafka, 
                  and poison-pill isolation.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block">Schema Evolution Policy:</span>
                <p>
                  All Protobuf and JSON event payloads adhere to strict semantic versioning (MAJOR.MINOR). 
                  Fields are never deleted; deprecated fields are marked for 2 quarters before retirement.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Right Column: Code & Schema Definitions */}
        <div className="lg:col-span-5 bg-slate-900 rounded-2xl border border-slate-800 p-5 text-white space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs text-indigo-400 font-bold">
              {selectedConsumer === 'ai_platform' ? 'Vector Index Schema (Protobuf/gRPC)' : 'Consumer Event Payload'}
            </span>
            <button
              onClick={() => copyContractSnippet('// Copied contract definition')}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800"
            >
              {copiedContract ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedContract ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <pre className="text-[11px] leading-relaxed text-emerald-400 overflow-x-auto p-2 bg-slate-950 rounded max-h-[380px]">
{selectedConsumer === 'ai_platform' ? `syntax = "proto3";

package scribd.content.foundations.v2;

message DocumentVectorIndexRecord {
  string document_id = 1;
  string brand = 2; // "scribd", "slideshare", "everand"
  int32 chunk_index = 3;
  int32 page_number = 4;
  string citation_anchor = 5; // urn:scribd:doc:{id}:p{page}:c{chunk}
  
  string chunk_text = 6;
  repeated float embedding_1536 = 7;
  
  message BoundingBox {
    float x = 1;
    float y = 2;
    float width = 3;
    float height = 4;
  }
  BoundingBox visual_coordinate = 8;
  
  map<string, string> contextual_breadcrumbs = 9;
  int64 timestamp_ms = 10;
}` : selectedConsumer === 'trust_safety' ? `// Trust & Safety Quarantine Event
{
  "event_id": "evt_ts_998124",
  "event_type": "content.trust_safety.quarantine",
  "document_id": "doc_99182",
  "quarantine_reason": "ADVERSARIAL_PROMPT_INJECTION",
  "trust_score": 14,
  "pii_detected_count": 4,
  "redacted_safe_payload_available": true,
  "requires_human_moderation": true,
  "callback_url": "https://api.scribd.com/v2/trust-safety/review/doc_99182"
}` : `// Generic Downstream Event Contract
{
  "schema_version": "2026.04-contracts",
  "source": "scribd.content.foundations",
  "document_id": "doc_882914",
  "brand": "slideshare",
  "status": "INGESTION_COMPLETED",
  "p95_latency_ms": 1820,
  "total_pages": 18,
  "artifacts": {
    "reader_manifest": "https://cdn.scribd.com/manifests/doc_882914.json",
    "speechify_stream": "speechify://audio-sync/stream/doc_882914",
    "vector_embeddings": "vector://rag-indexing.internal/v2/embeddings"
  }
}`}
          </pre>
        </div>
      </div>
      </>
      )}
    </div>
  );
};
