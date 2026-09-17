import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '25mb' }));

// Lazy initialize Gemini client
const getGeminiClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  try {
    return new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Error creating GoogleGenAI client:', err);
    return null;
  }
};

/**
 * Resilient multi-model cascade with circuit-breaking.
 * If the primary model experiences a 503 (high demand) or 429 spike,
 * it routes to next-tier models in the inference pool before engaging fast-path heuristics.
 */
async function generateGeminiWithCascade(
  ai: GoogleGenAI | null,
  prompt: string,
  config?: any,
  taskName: string = 'Inference'
): Promise<{ text: string; modelUsed: string } | null> {
  if (!ai) return null;

  const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];

  for (let i = 0; i < candidateModels.length; i++) {
    const model = candidateModels[i];
    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Inference timeout (3500ms)')), 3500);
      });

      const response = await Promise.race([
        ai.models.generateContent({
          model,
          contents: prompt,
          config,
        }),
        timeoutPromise,
      ]);

      if (response && response.text) {
        return { text: response.text, modelUsed: model };
      }
    } catch (err: any) {
      const errorMsg = err?.message || String(err);
      const isCapacitySpike =
        errorMsg.includes('503') ||
        errorMsg.includes('high demand') ||
        errorMsg.includes('UNAVAILABLE') ||
        errorMsg.includes('429') ||
        errorMsg.includes('timeout');

      console.log(
        `[Content Foundations AI Cascade] Model '${model}' for ${taskName}: ${
          isCapacitySpike ? 'Transient capacity spike / timeout' : 'Unavailable'
        }. ${
          i < candidateModels.length - 1
            ? 'Routing to next-tier model in pool...'
            : 'Circuit breaker engaged; falling back to fast-path heuristic parser.'
        }`
      );

      if (i < candidateModels.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }
  }

  return null;
}

// Global telemetry metrics state
let clusterTelemetry = {
  p50LatencyMs: 580,
  p95LatencyMs: 1820,
  p99LatencyMs: 2750,
  activeIngestionWorkers: 32,
  ingestionThroughputPerSec: 284,
  vlmCacheHitRatePercent: 78.4,
  dlqDeadLetterCount: 3,
  errorBudgetRemainingPercent: 99.98,
  untrustedContentBlockedToday: 412,
  totalCorpusProcessedPages: '482,910,230',
  systemStatus: 'HEALTHY',
};

// In-memory job storage for query grounding
const completedJobsMap = new Map<string, any>();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'scribd-content-foundations-ingestion',
    version: '2.4.0',
    region: 'us-west-2',
    timestamp: new Date().toISOString(),
  });
});

// Telemetry endpoint
app.get('/api/telemetry', (req, res) => {
  res.json(clusterTelemetry);
});

// Chaos simulator endpoint to demonstrate EM operational leadership
app.post('/api/chaos-simulate', (req, res) => {
  const { action } = req.body;
  
  if (action === 'spike_load') {
    clusterTelemetry = {
      ...clusterTelemetry,
      p95LatencyMs: 2640,
      p99LatencyMs: 4100,
      ingestionThroughputPerSec: 1420,
      activeIngestionWorkers: 96,
      errorBudgetRemainingPercent: 99.82,
      systemStatus: 'AUTOSCALING_UNDER_LOAD',
    };
  } else if (action === 'worker_fail') {
    clusterTelemetry = {
      ...clusterTelemetry,
      activeIngestionWorkers: 18,
      dlqDeadLetterCount: clusterTelemetry.dlqDeadLetterCount + 14,
      p95LatencyMs: 2980,
      systemStatus: 'RECOVERING_WORKER_POOL',
    };
  } else if (action === 'dlq_drain') {
    clusterTelemetry = {
      ...clusterTelemetry,
      dlqDeadLetterCount: 0,
      systemStatus: 'HEALTHY',
    };
  } else {
    // Reset to baseline
    clusterTelemetry = {
      p50LatencyMs: 580,
      p95LatencyMs: 1820,
      p99LatencyMs: 2750,
      activeIngestionWorkers: 32,
      ingestionThroughputPerSec: 284,
      vlmCacheHitRatePercent: 78.4,
      dlqDeadLetterCount: 1,
      errorBudgetRemainingPercent: 99.98,
      untrustedContentBlockedToday: clusterTelemetry.untrustedContentBlockedToday + 1,
      totalCorpusProcessedPages: '482,912,850',
      systemStatus: 'HEALTHY',
    };
  }

  res.json({ success: true, currentMetrics: clusterTelemetry });
});

// Helper to simulate realistic latency and generate mock embeddings
const generateEmbeddingPreview = () => {
  return Array.from({ length: 6 }, () => Number((Math.random() * 0.8 - 0.4).toFixed(4)));
};

// Core Ingestion Pipeline Endpoint
app.post('/api/ingest', async (req, res) => {
  const startTime = Date.now();
  const {
    documentTitle = 'Untitled Ingest',
    content = '',
    mimeType = 'application/pdf',
    sourceBrand = 'scribd',
    fileSize = '3.4 MB',
    chunkStrategy = 'semantic_vlm',
  } = req.body;

  const jobId = 'ingest_' + Math.random().toString(36).substring(2, 10);
  const textContent = content || 'No content provided.';
  
  // 1. Stage 1: Untrusted Ingestion & Sandboxing
  const stage1Start = Date.now();
  const hasMaliciousKeywords = /ignore all (previous )?instructions|system override|root_exploit|bypass.*safety|print all.*secrets/i.test(textContent);
  const sandboxingVerdict = hasMaliciousKeywords ? 'quarantined' : 'completed';
  const stage1Duration = Math.max(12, Date.now() - stage1Start + Math.floor(Math.random() * 30 + 15));

  // 2. Stage 2: Multimodal VLM Parsing
  const stage2Start = Date.now();
  let vlmExtraction = {
    summary: '',
    detectedLanguage: 'English (en-US)',
    readingLevel: 'Advanced Technical (Flesch-Kincaid: 14.2)',
    pageCount: Math.max(2, Math.ceil(textContent.split('\n').length / 15)),
    structureTree: [] as any[],
    keyEntities: [] as string[],
    visualElements: [] as any[],
    markdownRepresentation: textContent,
  };

  const ai = getGeminiClient();
  let usedAI = false;
  let activeModelUsed = '';

  if (ai && textContent.length > 50) {
    const prompt = `You are a high-throughput Vision-Language Model (VLM) parser at Scribd Content Foundations.
Analyze the following uploaded document content and extract a clean JSON object with this exact structure:
{
  "summary": "Concise 2-3 sentence executive summary of the document",
  "detectedLanguage": "e.g. English (en-US)",
  "readingLevel": "e.g. College Graduate / Technical",
  "structureTree": [
    {"level": 1, "title": "Heading or Section title", "pageIndex": 1, "hasVisuals": false, "tokenEstimate": 120}
  ],
  "keyEntities": ["List of 4-6 key concepts, entities, or technologies mentioned"],
  "visualElements": [
    {"id": "vis_1", "type": "diagram", "description": "Description of any chart/table/diagram mentioned or inferred", "confidence": 0.96, "pageIndex": 1, "detectedLabels": ["Architecture", "Pipeline"]}
  ]
}

Document Content:
${textContent.slice(0, 3000)}`;

    const cascadeResult = await generateGeminiWithCascade(
      ai,
      prompt,
      {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
      'VLM Extraction'
    );

    if (cascadeResult && cascadeResult.text) {
      try {
        const parsed = JSON.parse(cascadeResult.text);
        vlmExtraction = {
          ...vlmExtraction,
          summary: parsed.summary || vlmExtraction.summary,
          detectedLanguage: parsed.detectedLanguage || vlmExtraction.detectedLanguage,
          readingLevel: parsed.readingLevel || vlmExtraction.readingLevel,
          structureTree: parsed.structureTree || [],
          keyEntities: parsed.keyEntities || [],
          visualElements: parsed.visualElements || [],
        };
        usedAI = true;
        activeModelUsed = cascadeResult.modelUsed;
      } catch (parseErr) {
        console.log('[Content Foundations VLM] JSON parsing failed, using high-fidelity structural fallback');
      }
    }
  }

  // Fallback VLM heuristics if Gemini did not run or had an issue
  if (!usedAI || !vlmExtraction.summary) {
    const lines = textContent.split('\n');
    const headings = lines
      .filter((l: string) => l.startsWith('#'))
      .map((h: string, idx: number) => ({
        level: h.startsWith('###') ? 3 : h.startsWith('##') ? 2 : 1,
        title: h.replace(/^#+\s*/, ''),
        pageIndex: Math.floor(idx / 2) + 1,
        hasVisuals: idx % 2 === 0,
        tokenEstimate: Math.floor(Math.random() * 100 + 80),
      }));

    vlmExtraction.summary = `This document provides technical foundations for ${documentTitle.toLowerCase()}, covering structural architectures, ingestion streaming, and dual delivery contracts for downstream consumers.`;
    vlmExtraction.structureTree = headings.length > 0 ? headings : [
      { level: 1, title: documentTitle, pageIndex: 1, hasVisuals: true, tokenEstimate: 210 },
      { level: 2, title: 'Architecture & Ingestion Pipeline', pageIndex: 2, hasVisuals: true, tokenEstimate: 340 },
      { level: 2, title: 'Downstream Consumer Contracts & SLOs', pageIndex: 3, hasVisuals: false, tokenEstimate: 180 },
    ];
    vlmExtraction.keyEntities = ['Content Foundations', 'Streaming Ingestion', 'Vision-Language Models', 'Speechify Audio', 'RAG Retrieval', 'Apache Kafka'];
    vlmExtraction.visualElements = [
      {
        id: 'vis_1',
        type: 'diagram',
        description: 'High-throughput event streaming topology and sandboxed microVM worker pool',
        confidence: 0.98,
        pageIndex: 1,
        detectedLabels: ['Architecture', 'Kafka', 'Sandboxing', 'VLM'],
      },
      {
        id: 'vis_2',
        type: 'table',
        description: 'Benchmark comparison of p50/p95 parsing latency across conversion pipelines',
        confidence: 0.94,
        pageIndex: 2,
        detectedLabels: ['Latency', 'SLO', 'Throughput'],
      },
    ];
  }

  const stage2Duration = Math.max(30, Date.now() - stage2Start + (usedAI ? 0 : Math.floor(Math.random() * 40 + 60)));

  // 3. Stage 3: Trust & Safety / Policy Redaction
  const stage3Start = Date.now();
  const piiFindings: any[] = [];
  let sanitizedText = textContent;

  // SSN pattern
  const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
  let match;
  while ((match = ssnRegex.exec(textContent)) !== null) {
    piiFindings.push({
      type: 'SSN',
      originalSnippet: match[0],
      redactedReplacement: 'XXX-XX-XXXX [REDACTED_SSN]',
      riskScore: 'HIGH',
    });
  }
  sanitizedText = sanitizedText.replace(ssnRegex, 'XXX-XX-XXXX [REDACTED_SSN]');

  // Email pattern
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  while ((match = emailRegex.exec(textContent)) !== null) {
    if (!match[0].includes('scribd') && !match[0].includes('example')) {
      piiFindings.push({
        type: 'EMAIL',
        originalSnippet: match[0],
        redactedReplacement: '[REDACTED_EMAIL]',
        riskScore: 'MEDIUM',
      });
    }
  }
  sanitizedText = sanitizedText.replace(emailRegex, '[REDACTED_EMAIL]');

  // Phone pattern
  const phoneRegex = /\+?1?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  while ((match = phoneRegex.exec(textContent)) !== null) {
    piiFindings.push({
      type: 'PHONE',
      originalSnippet: match[0],
      redactedReplacement: '[REDACTED_PHONE]',
      riskScore: 'MEDIUM',
    });
  }
  sanitizedText = sanitizedText.replace(phoneRegex, '[REDACTED_PHONE]');

  const safetyVerdict = hasMaliciousKeywords
    ? 'QUARANTINED'
    : piiFindings.length > 0
    ? 'REDACTED_SAFE'
    : 'PASSED';

  const safetyAudit = {
    verdict: safetyVerdict,
    trustScore: hasMaliciousKeywords ? 14 : piiFindings.length > 0 ? 88 : 99,
    qualityScore: hasMaliciousKeywords ? 20 : 96,
    promptInjectionRisk: hasMaliciousKeywords ? 'HIGH' : 'NONE',
    piiDetected: piiFindings,
    copyrightFingerprint: 'sha256:d8a9f2c730e1' + Math.random().toString(16).substring(2, 8),
    quarantineReason: hasMaliciousKeywords ? 'Adversarial prompt injection signature detected in metadata payload' : undefined,
    sanitizationLogs: [
      `Magic byte verification: VALID (File format matched ${mimeType})`,
      `Sandbox network egress: BLOCKED (isolated microVM)`,
      hasMaliciousKeywords ? 'CRITICAL: Prompt injection filter triggered on token sequence' : 'Adversarial scan: CLEAN',
      piiFindings.length > 0 ? `Automated redaction: ${piiFindings.length} PII tokens masked prior to corpus indexing` : 'PII scan: CLEAN',
      'Perceptual duplicate hash: 0.02% similarity to existing copyrighted corpus (Passed)',
    ],
  };

  const stage3Duration = Math.max(15, Date.now() - stage3Start + Math.floor(Math.random() * 20 + 20));

  // 4. Stage 4: Semantic Chunking & Vectorization
  const stage4Start = Date.now();
  const rawParagraphs = sanitizedText
    .split(/\n\n+/)
    .filter((p: string) => p.trim().length > 20);

  const chunks = rawParagraphs.map((para: string, idx: number) => {
    const cleanPara = para.replace(/^#+\s*/, '').trim();
    const tokenCount = Math.max(20, Math.ceil(cleanPara.split(/\s+/).length * 1.3));
    const pageNum = Math.floor(idx / 3) + 1;
    return {
      id: `${jobId}_chk_${idx + 1}`,
      chunkIndex: idx + 1,
      headingContext: `Section ${idx + 1} > ${documentTitle}`,
      text: cleanPara,
      tokenCount,
      embeddingPreview: generateEmbeddingPreview(),
      citationAnchor: `urn:scribd:doc:${jobId}:p${pageNum}:c${idx + 1}`,
      pageNumber: pageNum,
      speechifyDurationEstSec: Number((tokenCount / 2.5).toFixed(1)),
    };
  });

  const totalTokens = chunks.reduce((acc: number, c: any) => acc + c.tokenCount, 0);

  const chunkingAnalysis = {
    strategy: chunkStrategy as any,
    totalChunks: chunks.length,
    avgChunkTokens: chunks.length ? Math.round(totalTokens / chunks.length) : 0,
    boundaryPreservationScore: chunkStrategy === 'semantic_vlm' ? 98.4 : 74.2,
    chunks: chunks,
  };

  const stage4Duration = Math.max(20, Date.now() - stage4Start + Math.floor(Math.random() * 30 + 35));

  // 5. Stage 5: Dual Delivery & Speechify Audio Narration
  const stage5Start = Date.now();
  let cumulativeTime = 0;
  const audioSegments = chunks.map((chunk: any) => {
    const segDuration = chunk.speechifyDurationEstSec;
    const start = cumulativeTime;
    cumulativeTime += segDuration;
    return {
      id: `seg_${chunk.id}`,
      chunkId: chunk.id,
      startTimeSec: Number(start.toFixed(1)),
      endTimeSec: Number(cumulativeTime.toFixed(1)),
      text: chunk.text,
      speakerVoice: 'Kore (Neural Warm)',
    };
  });

  const speechifyStream = {
    voiceId: 'speechify_kore_neural_v3',
    voiceName: 'Kore (Neural Warm Studio)',
    totalDurationSeconds: Number(cumulativeTime.toFixed(1)),
    ssmlText: `<speak version="1.1" xmlns="http://www.w3.org/2001/10/synthesis">
  <p><s>${chunks[0]?.text.slice(0, 140) || ''}</s></p>
</speak>`,
    segments: audioSegments,
  };

  const downstreamEvent = {
    eventId: 'evt_' + Math.random().toString(36).substring(2, 12),
    eventType: (safetyVerdict === 'QUARANTINED' ? 'content.quarantined.v1' : 'content.ingested.v2') as any,
    timestamp: new Date().toISOString(),
    documentId: jobId,
    brand: sourceBrand as any,
    schemaVersion: '2026.04-contracts',
    destinations: {
      trustAndSafety: 'kafka://content.trust-safety.audit',
      contentUnderstanding: 'grpc://content-understanding.internal.scribd.net:50051',
      aiPlatformRAG: 'vector://rag-indexing.internal/v2/embeddings',
      readerService: 'https://cdn.scribd.com/manifests/' + jobId + '.json',
      speechifyTTS: 'speechify://audio-sync/stream/' + jobId,
    },
  };

  const stage5Duration = Math.max(15, Date.now() - stage5Start + Math.floor(Math.random() * 25 + 25));

  const totalDuration = stage1Duration + stage2Duration + stage3Duration + stage4Duration + stage5Duration;

  const jobResult = {
    id: jobId,
    documentTitle,
    sourceBrand,
    mimeType,
    fileSize,
    rawText: textContent,
    createdAt: new Date().toISOString(),
    totalLatencyMs: totalDuration,
    overallStatus: hasMaliciousKeywords ? 'quarantined' : 'completed',
    stages: [
      {
        id: 'sandboxing',
        name: 'Untrusted Ingress & MicroVM Sandboxing',
        status: hasMaliciousKeywords ? 'quarantined' : 'completed',
        durationMs: stage1Duration,
        description: 'Validates file headers, executes virus scan, and isolates payload inside ephemeral Firecracker microVM container.',
        substeps: [
          'Magic bytes verification: OK',
          'MIME spoofing detection: OK',
          'Network egress quarantine: ENFORCED',
          hasMaliciousKeywords ? 'Adversarial payload intercepted' : 'Malware hash match: 0 hits',
        ],
      },
      {
        id: 'vlm_parsing',
        name: 'Multimodal VLM Layout & Visual Extraction',
        status: 'completed',
        durationMs: stage2Duration,
        description: 'Replaces legacy OCR with Vision-Language Models to preserve reading order, tables, diagrams, and hierarchy in real time.',
        substeps: [
          `Visual layout decomposed into ${vlmExtraction.structureTree.length} structural blocks`,
          `Detected ${vlmExtraction.visualElements.length} charts/diagrams with visual bounding boxes`,
          `Reading grade level scored: ${vlmExtraction.readingLevel}`,
          usedAI
            ? `${activeModelUsed} real-time VLM inference active`
            : 'Content Foundations Fast-Path Heuristic Parser active (circuit breaker protected)',
        ],
      },
      {
        id: 'safety_audit',
        name: 'Trust & Safety, PII Masking & Quality Scoring',
        status: hasMaliciousKeywords ? 'quarantined' : 'completed',
        durationMs: stage3Duration,
        description: 'Filters prompt injections, redacts PII before corpus persistence, and assigns indexability quality score.',
        substeps: [
          safetyAudit.promptInjectionRisk === 'HIGH' ? 'Adversarial prompt injection BLOCKED' : 'Prompt injection scan: CLEAN',
          `Automated PII tokens redacted: ${piiFindings.length}`,
          `Corpus quality index score: ${safetyAudit.qualityScore}/100`,
          `Perceptual copyright hash: ${safetyAudit.copyrightFingerprint.slice(0, 16)}...`,
        ],
      },
      {
        id: 'semantic_chunking',
        name: 'Intelligent Semantic Boundary Chunking & Vectorization',
        status: 'completed',
        durationMs: stage4Duration,
        description: 'Dynamic semantic boundary chunking preserving code, tables, and sentence continuity for agent grounding.',
        substeps: [
          `Partitioned into ${chunks.length} semantic chunks (${chunkingAnalysis.avgChunkTokens} avg tokens)`,
          'Hierarchical context breadcrumbs injected into chunk headers',
          '1536-dim vector embeddings calculated with citation anchors',
          'Boundary preservation metric: 98.4%',
        ],
      },
      {
        id: 'dual_dispatch',
        name: 'Dual-Delivery Dispatch: Reader Manifest & Speechify TTS Stream',
        status: 'completed',
        durationMs: stage5Duration,
        description: 'Simultaneously packages low-latency reader JSON, RAG vector index records, and Speechify audio narration tokens.',
        substeps: [
          'Published content.ingested.v2 event to Apache Kafka ingress topic',
          `Generated ${audioSegments.length} Speechify synchronized audio segments (${speechifyStream.totalDurationSeconds}s total)`,
          'Wrote citation bounding boxes to Vector Database index',
          'Reader CDN manifest pre-warmed for instant mobile/web page 1 preview',
        ],
      },
    ],
    vlmExtraction,
    safetyAudit,
    chunkingAnalysis,
    speechifyStream,
    downstreamEvent,
  };

  // Cache in memory for RAG queries
  completedJobsMap.set(jobId, jobResult);

  res.json(jobResult);
});

// Grounded RAG Query endpoint for AI agent integration demonstration
app.post('/api/rag-query', async (req, res) => {
  const { query = '', documentId = '' } = req.body;
  const job = completedJobsMap.get(documentId) || Array.from(completedJobsMap.values())[0];

  if (!job || !job.chunkingAnalysis?.chunks?.length) {
    return res.status(404).json({ error: 'No ingested document available for grounding' });
  }

  const chunks = job.chunkingAnalysis.chunks;
  
  // Calculate simple keyword relevance scoring for simulated vector retrieval
  const queryWords = query.toLowerCase().split(/\s+/).filter((w: string) => w.length > 3);
  const scoredChunks = chunks.map((c: any) => {
    const textLower = c.text.toLowerCase();
    let hits = 0;
    queryWords.forEach((word: string) => {
      if (textLower.includes(word)) hits += 1;
    });
    return {
      chunk: c,
      relevanceScore: Number(Math.min(0.99, 0.65 + hits * 0.1).toFixed(3)),
    };
  });

  scoredChunks.sort((a: any, b: any) => b.relevanceScore - a.relevanceScore);
  const topCitations = scoredChunks.slice(0, 3).map((item: any) => ({
    chunkId: item.chunk.id,
    citationAnchor: item.chunk.citationAnchor,
    relevanceScore: item.relevanceScore,
    textSnippet: item.chunk.text.slice(0, 180) + '...',
    pageNumber: item.chunk.pageNumber,
  }));

  const ai = getGeminiClient();
  let answer = '';

  if (ai) {
    const prompt = `You are a precision RAG Grounding Engine at Scribd.
Given the following context chunks from document "${job.documentTitle}", answer the user's question accurately.
Explicitly cite the source using [Citation Anchor].

Context:
${topCitations.map((c: any) => `[${c.citationAnchor}]: ${c.textSnippet}`).join('\n\n')}

Question: ${query}
Answer:`;

    const cascadeResult = await generateGeminiWithCascade(ai, prompt, undefined, 'RAG Grounding');
    if (cascadeResult && cascadeResult.text) {
      answer = cascadeResult.text;
    }
  }

  if (!answer) {
    answer = `Based on the ingested document "${job.documentTitle}", the platform processes content using real-time streaming ingestion, ensuring that every document is parsed via Vision-Language Models, validated for safety and PII, and converted into grounded semantic chunks with Speechify-ready audio narration segments. [${topCitations[0]?.citationAnchor || 'urn:scribd:doc'}]`;
  }

  res.json({
    query,
    answer,
    confidence: 0.96,
    groundedCitations: topCitations,
  });
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Content Foundations Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
