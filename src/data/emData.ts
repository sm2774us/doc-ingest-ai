export interface HiringRole {
  title: string;
  level: string;
  focus: string;
  keyCompetencies: string[];
  gritEvaluation: string;
  openHeadcount: number;
}

export const TEAM_ROLES: HiringRole[] = [
  {
    title: 'Staff Distributed Systems Architect',
    level: 'IC6 / Staff',
    focus: 'Core Ingestion Engine & Event Streaming',
    keyCompetencies: [
      'High-throughput Kafka / Pulsar partitioning & backpressure handling',
      'Go / Rust / C++ high-efficiency document decoders & memory-safe parsers',
      'Zero-downtime schema evolution and outbox CDC patterns',
      'Cross-functional technical roadmapping across Trust & Safety and AI Platform',
    ],
    gritEvaluation: 'Evaluated on sustained technical perseverance through legacy migration challenges and bold architectural bets.',
    openHeadcount: 1,
  },
  {
    title: 'Senior Backend Engineer (Platform & APIs)',
    level: 'IC5 / Senior',
    focus: 'Downstream Service Interfaces & SLAs',
    keyCompetencies: [
      'gRPC / OpenAPI v3 interface design with strict backwards compatibility',
      'Sandboxed microVM lifecycle management (Firecracker / gVisor)',
      'Reliability engineering: circuit breakers, fallback caches, DLQ auto-remediation',
      'Building Developer Experience (DX) tooling and SDKs for consumer teams',
    ],
    gritEvaluation: 'Assessed on rigorous delivery of platform commitments and setting high standards for testing and observability.',
    openHeadcount: 2,
  },
  {
    title: 'Senior Applied AI / VLM Data Engineer',
    level: 'IC5 / Senior',
    focus: 'Multimodal VLM Inference & Semantic Chunking',
    keyCompetencies: [
      'Production deployment of Vision-Language Models (Gemini, multimodal embedding models)',
      'Intelligent chunking algorithms and RAG retrieval optimization (HNSW, hybrid search)',
      'Inference cost optimization: semantic caching, batching, GPU quantization',
      'Evaluation benchmarks for document layout fidelity and citation precision',
    ],
    gritEvaluation: 'Assessed on innovative approaches to replacing brittle heuristic OCR with scalable multimodal models.',
    openHeadcount: 2,
  },
  {
    title: 'Software Engineer, Trust, Safety & Security',
    level: 'IC4 / Mid-Senior',
    focus: 'Untrusted Content Sandboxing & Compliance',
    keyCompetencies: [
      'Adversarial prompt injection defense, canary tokens, jailbreak heuristics',
      'High-throughput PII detection & automated redaction at line speed',
      'Perceptual copyright fingerprinting and duplicate detection',
      'Threat modeling for user-generated content upload attack surfaces',
    ],
    gritEvaluation: 'Assessed on proactive vigilance, safety-first mindset, and collaborative alignment with Legal & Policy teams.',
    openHeadcount: 1,
  },
];

export const GRIT_FRAMEWORK_PILLARS = [
  {
    letter: 'G',
    title: 'Goals',
    description: 'Setting ambitious, measurable platform commitments (e.g. sub-2s p95 ingestion across 100M+ documents) and unblocking cross-functional roadmaps with clear SLOs.',
    emAction: 'Establish quarterly platform contracts with Product and downstream leads; track progress via transparent SLO burndown charts.',
  },
  {
    letter: 'R',
    title: 'Results',
    description: 'Delivering tangible user and infrastructure outcomes: cut ingestion latency by 82%, zero untrusted payload escapes, and 99.98% platform availability.',
    emAction: 'Prioritize production velocity without compromising reliability; celebrate team milestones and drive blameless post-mortem action items to completion.',
  },
  {
    letter: 'I',
    title: 'Innovation',
    description: 'Pioneering the shift from legacy batch OCR pipelines to real-time multimodal VLM parsing, intelligent semantic chunking, and Speechify audio streaming.',
    emAction: 'Allocate 15% team capacity for high-leverage architectural spikes; sponsor proof-of-concepts that redefine document understanding.',
  },
  {
    letter: 'T',
    title: 'Team',
    description: 'Building an empathetic, psychologically safe engineering culture with high standards, clear leveling rubrics, sustainable on-call rotation, and intentional hybrid connection.',
    emAction: 'Foster career progression for founding engineers; champion inclusive hiring across Scribd Flex hubs; conduct regular 1-on-1s focused on growth.',
  },
];

export const ONBOARDING_ROADMAP_30_60_90 = [
  {
    phase: 'Days 1 - 30: Discover & Align',
    theme: 'Listen, Audit & Baseline',
    milestones: [
      'Audit existing ingestion pipelines across Scribd, SlideShare, and Everand; map architectural bottlenecks and failure domains.',
      'Conduct 1-on-1 discovery with Product leads in Trust & Safety, Content Understanding, Supply, and AI Platform to identify friction points.',
      'Shadow the on-call rotation to evaluate alert volume, paging fatigue, and DLQ resolution runbooks.',
      'Deliver initial team charter and baseline metrics report (p50/p95 latency, throughput, compute cost per 1k pages).',
    ],
  },
  {
    phase: 'Days 31 - 60: Architect & Build Founding Team',
    theme: 'Founding Team & Real-Time MVP',
    milestones: [
      'Finalize hiring pipeline and interview loops for founding backend and AI data engineers across Scribd Flex locations.',
      'Ship Phase 1 of the real-time VLM ingestion pilot on 10% of new SlideShare uploads, validating sub-2.5s parsing targets.',
      'Institute formal Platform SLAs and OpenAPI/gRPC interface definitions with downstream consumer teams.',
      'Standardize Architecture Decision Records (ADR) workflow and blameless post-mortem cadence.',
    ],
  },
  {
    phase: 'Days 61 - 90: Scale & Accelerate Velocity',
    theme: 'Corpus-Scale Rollout & Product Impact',
    milestones: [
      'Ramp real-time VLM ingestion to 100% of new uploads with automated zero-trust sandboxing and PII redaction.',
      'Launch Speechify dual-delivery audio stream and semantic chunking endpoints for downstream AI Platform RAG agents.',
      'Achieve target operational SLO: 99.95% uptime, p95 < 2.0s, and 75%+ semantic cache hit rate.',
      'Conduct first quarterly Content Foundations Platform Review with Executive Leadership.',
    ],
  },
];
