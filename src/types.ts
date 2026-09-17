export type SourceBrand = 'scribd' | 'slideshare' | 'everand' | 'fable';

export type PipelineStageId = 
  | 'sandboxing'
  | 'vlm_parsing'
  | 'safety_audit'
  | 'semantic_chunking'
  | 'dual_dispatch';

export interface StageMetric {
  id: PipelineStageId;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'quarantined';
  durationMs: number;
  description: string;
  substeps: string[];
}

export interface VlmVisualElement {
  id: string;
  type: 'chart' | 'table' | 'diagram' | 'slide_hero' | 'infographic';
  description: string;
  confidence: number;
  pageIndex: number;
  detectedLabels: string[];
}

export interface StructureNode {
  level: number;
  title: string;
  pageIndex: number;
  hasVisuals: boolean;
  tokenEstimate: number;
}

export interface VlmExtraction {
  summary: string;
  detectedLanguage: string;
  readingLevel: string;
  pageCount: number;
  structureTree: StructureNode[];
  keyEntities: string[];
  visualElements: VlmVisualElement[];
  markdownRepresentation: string;
}

export interface SafetyPiiFinding {
  type: 'SSN' | 'CREDIT_CARD' | 'EMAIL' | 'PHONE' | 'API_KEY';
  originalSnippet: string;
  redactedReplacement: string;
  riskScore: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface SafetyAudit {
  verdict: 'PASSED' | 'FLAGGED_NEEDS_REVIEW' | 'REDACTED_SAFE' | 'QUARANTINED';
  trustScore: number; // 0-100
  qualityScore: number; // 0-100 (for corpus indexability)
  promptInjectionRisk: 'NONE' | 'LOW' | 'HIGH';
  piiDetected: SafetyPiiFinding[];
  copyrightFingerprint: string;
  quarantineReason?: string;
  sanitizationLogs: string[];
}

export interface DocumentChunk {
  id: string;
  chunkIndex: number;
  headingContext: string;
  text: string;
  tokenCount: number;
  embeddingPreview: number[]; // First 6 dimensional floats
  citationAnchor: string;
  pageNumber: number;
  speechifyDurationEstSec: number;
}

export interface ChunkingAnalysis {
  strategy: 'semantic_vlm' | 'fixed_token' | 'markdown_hierarchy';
  totalChunks: number;
  avgChunkTokens: number;
  boundaryPreservationScore: number; // 0 - 100%
  chunks: DocumentChunk[];
}

export interface SpeechifyAudioSegment {
  id: string;
  chunkId: string;
  startTimeSec: number;
  endTimeSec: number;
  text: string;
  speakerVoice: string;
}

export interface SpeechifyAudioStream {
  voiceId: string;
  voiceName: string;
  totalDurationSeconds: number;
  ssmlText: string;
  segments: SpeechifyAudioSegment[];
}

export interface DownstreamEventPayload {
  eventId: string;
  eventType: 'content.ingested.v2' | 'content.quarantined.v1';
  timestamp: string;
  documentId: string;
  brand: SourceBrand;
  schemaVersion: string;
  destinations: {
    trustAndSafety: string;
    contentUnderstanding: string;
    aiPlatformRAG: string;
    readerService: string;
    speechifyTTS: string;
  };
}

export interface TraceSpan {
  id: string;
  traceId: string;
  parentSpanId?: string;
  serviceName: 'ingress-gateway' | 'firecracker-sandbox' | 'vlm-multimodal-parser' | 'trust-safety-audit' | 'semantic-vector-chunker' | 'speechify-token-streamer' | 'downstream-kafka-bus';
  operationName: string;
  startTimeOffsetMs: number;
  durationMs: number;
  status: 'OK' | 'DEGRADED' | 'ERROR' | 'CACHED';
  attributes: Record<string, string | number | boolean>;
}

export interface JobDistributedTrace {
  traceId: string;
  rootService: string;
  totalDurationMs: number;
  criticalPathMs: number;
  spans: TraceSpan[];
}

export interface RagEvaluationMetric {
  groundTruthChunkId: string;
  citationAnchor: string;
  groundTruthText: string;
  llmAnswer: string;
  contextPrecision: number; // 0-100%
  contextRecall: number; // 0-100%
  faithfulnessScore: number; // 0-100%
  semanticSimilarity: number; // 0-100%
  tokenOverlapJaccard: number; // 0-100%
  matchedKeyTerms: string[];
  hallucinationRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  evaluationExplanation: string;
}

export interface ModerationHeatmapCell {
  id: string;
  category: 'SlideShare Decks' | 'Technical Whitepapers' | 'UGC PDFs' | 'Markdown Guides' | 'Financial Filings' | 'Scanned Books';
  violationType: 'Prompt Injection' | 'Leaked PII / Credentials' | 'Hate / Harassment' | 'Copyright / Trademark' | 'Malware / Parser Panic';
  incidentCount: number;
  riskScore: number; // 0-100
  recentFlagSnippet: string;
  proactiveMitigation: string;
}

export interface SloIncident {
  id: string;
  severity: 'CRITICAL' | 'HIGH' | 'WARNING';
  impactedService: string;
  breachedSlo: string;
  currentValue: string;
  thresholdValue: string;
  timestamp: string;
  rootCauseHeuristic: string;
  blastRadius: string;
  status: 'TRIGGERED' | 'INVESTIGATING' | 'MITIGATED' | 'RESOLVED';
  runbookActions: Array<{
    id: string;
    label: string;
    description: string;
  }>;
}

export interface DecisionTreeNode {
  id: string;
  title: string;
  category: 'INGRESS_CHECK' | 'LAYOUT_COMPLEXITY' | 'AUDIO_REQUIREMENT' | 'STRATEGY_DECISION';
  description: string;
  ruleEvaluated: string;
  conditionMet: boolean;
  metricBadge?: string;
  outputStrategy?: 'semantic_vlm' | 'fixed_token' | 'markdown_hierarchy';
}

export interface IngestionJob {
  id: string;
  documentTitle: string;
  sourceBrand: SourceBrand;
  mimeType: string;
  fileSize: string;
  rawText: string;
  createdAt: string;
  totalLatencyMs: number;
  overallStatus: 'running' | 'completed' | 'quarantined' | 'failed';
  stages: StageMetric[];
  distributedTrace?: JobDistributedTrace;
  vlmExtraction?: VlmExtraction;
  safetyAudit?: SafetyAudit;
  chunkingAnalysis?: ChunkingAnalysis;
  speechifyStream?: SpeechifyAudioStream;
  downstreamEvent?: DownstreamEventPayload;
}

export interface TelemetryMetrics {
  p50LatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  activeIngestionWorkers: number;
  ingestionThroughputPerSec: number;
  vlmCacheHitRatePercent: number;
  dlqDeadLetterCount: number;
  errorBudgetRemainingPercent: number;
  untrustedContentBlockedToday: number;
  totalCorpusProcessedPages: string;
}

export interface RagQueryResult {
  query: string;
  answer: string;
  confidence: number;
  groundedCitations: Array<{
    chunkId: string;
    citationAnchor: string;
    relevanceScore: number;
    textSnippet: string;
    pageNumber: number;
  }>;
}

export interface ArchitectureDecisionRecord {
  id: string;
  title: string;
  date: string;
  status: 'ACCEPTED' | 'PROPOSED' | 'SUPERSEDED';
  context: string;
  decision: string;
  consequences: {
    positive: string[];
    tradeoffs: string[];
  };
}
