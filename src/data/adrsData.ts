import { ArchitectureDecisionRecord } from '../types';

export const ARCHITECTURE_DECISION_RECORDS: ArchitectureDecisionRecord[] = [
  {
    id: 'ADR-001',
    title: 'Real-Time Streaming Ingestion (Kafka/Event-Driven) vs Monolithic Batch Queues',
    date: '2026-03-12',
    status: 'ACCEPTED',
    context: `Scribd's legacy document ingestion relied on batch Celery/DelayedJob workers polling database queues. Documents experienced 8–15 minute end-to-end ingestion latency. If a batch worker crashed, an entire batch of 500 documents had to be replayed, violating supply-side contributor expectations and blocking real-time AI retrieval.`,
    decision: `Transition Content Foundations to a real-time event-driven streaming ingestion pipeline on Apache Kafka, partitioned by document UUID hash. Decouple ingestion into five isolated, horizontally scalable microVM worker pools with strict backpressure mechanisms.`,
    consequences: {
      positive: [
        'p95 upload-to-reader latency reduced from 11.4 minutes to 1.84 seconds.',
        'Independent autoscaling: lightweight sandboxing workers scale independently from GPU-heavy VLM inference workers.',
        'Zero cascading failures: transient worker memory pressure trips local backpressure rather than bringing down cluster ingress.',
      ],
      tradeoffs: [
        'Higher operational complexity with distributed Kafka consumer group rebalancing.',
        'Requires sophisticated Dead-Letter Queue (DLQ) automated replay and poison-pill quarantining.',
      ],
    },
  },
  {
    id: 'ADR-002',
    title: 'Multimodal Vision-Language Model (VLM) Parsing vs Legacy OCR + RegEx Extraction',
    date: '2026-04-05',
    status: 'ACCEPTED',
    context: `Traditional OCR engines (Tesseract, Abbyy) output unformatted 1D character streams, destroying multi-column magazine layouts, presentation slide hierarchies, and complex financial tables. Downstream LLM agents were hallucinating because table cells were scrambled across lines.`,
    decision: `Adopt multimodal Vision-Language Models (VLM) directly at the moment of upload. Render document pages into visual embeddings and text tokens simultaneously, outputting a structured Semantic Abstract Syntax Tree (AST) with 2D bounding boxes and hierarchical heading metadata.`,
    consequences: {
      positive: [
        'Preserves 100% of tabular structure, diagram captions, and presenter notes in SlideShare decks.',
        'Enables visual grounding citations where AI agents cite exact (x, y, w, h) bounding box coordinates.',
        'Replaces multiple fragile heuristic parsers with a single unified multimodal abstraction.',
      ],
      tradeoffs: [
        'Requires GPU inference infrastructure and caching strategies (semantic hash deduplication) to control token costs.',
        'Must maintain a fallback fast-path parser when external inference latency spikes beyond 1.5s.',
      ],
    },
  },
  {
    id: 'ADR-003',
    title: 'Intelligent Semantic Boundary Chunking vs Fixed 512-Token Sliding Windows',
    date: '2026-05-18',
    status: 'ACCEPTED',
    context: `Most commercial RAG systems apply arbitrary 512 or 1024-token sliding windows. In technical whitepapers and books, this chops mathematical equations in half, orphans table headers from row values, and breaks sentence continuity for Speechify text-to-speech narration.`,
    decision: `Implement dynamic semantic chunking informed by VLM layout hierarchy. Chunks are bounded by structural section headings, natural paragraph boundaries, and semantic topic shifts, with injected breadcrumbs (Document > Chapter > Section). Chunks are paired with word-level timing markers for Speechify TTS.`,
    consequences: {
      positive: [
        'RAG retrieval precision improved by 34% (NDCG@10) due to intact context boundaries.',
        'Flawless Speechify audio playback: sentences are never clipped mid-clause.',
        'Chunks inherit document structural taxonomy for enriched filtering in vector search.',
      ],
      tradeoffs: [
        'Variable chunk sizes (120 to 650 tokens) require dynamic batching in vector embedding pipelines.',
      ],
    },
  },
  {
    id: 'ADR-004',
    title: 'Zero-Trust Sandboxing with Ephemeral MicroVMs for Untrusted UGC Processing',
    date: '2026-06-22',
    status: 'ACCEPTED',
    context: `Scribd ingests millions of untrusted user-uploaded PDF, PPTX, and DOCX files daily. Complex file format parsers (libpdf, ghostscript, poppler) have historic CVE vulnerabilities (buffer overflows, remote code execution). Furthermore, adversarial users attempt prompt injection attacks against downstream AI agents.`,
    decision: `Process all untrusted content in ephemeral, single-tenant Firecracker microVMs with disabled network egress, memory limits (1GB), and gVisor sandboxing. Implement pre-ingestion regex/NER PII sanitization and an adversarial prompt-injection canary detector before any document enters the core corpus.`,
    consequences: {
      positive: [
        'Complete host isolation against parser exploits and 0-day format vulnerabilities.',
        'Prompt injection payloads are quarantined and defanged before reaching LLM agent grounding pools.',
        'Guaranteed compliance with GDPR/CCPA via automatic PII masking prior to storage.',
      ],
      tradeoffs: [
        'Adds 35–50ms cold-start overhead per microVM isolation container, mitigated by warm-pool pre-provisioning.',
      ],
    },
  },
];
