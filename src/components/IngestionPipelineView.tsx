import React, { useState } from 'react';
import { 
  Play, 
  ShieldCheck, 
  Eye, 
  Cpu, 
  Scissors, 
  Radio, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileCode, 
  FileUp, 
  Layers, 
  Lock, 
  Sparkles, 
  ChevronRight,
  Headphones,
  Sliders,
  Copy,
  Check,
  Activity,
  GitBranch
} from 'lucide-react';
import { IngestionJob, SourceBrand, PipelineStageId } from '../types';
import { PRESET_DOCUMENTS, PresetDocument } from '../data/presetDocuments';
import { TracingVisualizer } from './TracingVisualizer';
import { ChunkingDecisionTree } from './ChunkingDecisionTree';

interface IngestionPipelineViewProps {
  currentJob: IngestionJob | null;
  isRunning: boolean;
  onRunIngestion: (config: {
    title: string;
    content: string;
    brand: SourceBrand;
    mimeType: string;
    chunkStrategy: 'semantic_vlm' | 'fixed_token' | 'markdown_hierarchy';
  }) => Promise<void>;
  onSelectForSpeechify: (job: IngestionJob) => void;
  onSelectForRAG: (job: IngestionJob) => void;
}

export const IngestionPipelineView: React.FC<IngestionPipelineViewProps> = ({
  currentJob,
  isRunning,
  onRunIngestion,
  onSelectForSpeechify,
  onSelectForRAG,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<PresetDocument>(PRESET_DOCUMENTS[0]);
  const [customTitle, setCustomTitle] = useState('');
  const [customContent, setCustomContent] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<SourceBrand>('slideshare');
  const [chunkStrategy, setChunkStrategy] = useState<'semantic_vlm' | 'fixed_token' | 'markdown_hierarchy'>('semantic_vlm');
  const [activeInspectTab, setActiveInspectTab] = useState<'vlm' | 'safety' | 'chunks' | 'traces' | 'decision_tree' | 'kafka' | 'raw'>('vlm');
  const [copiedPayload, setCopiedPayload] = useState(false);

  const handleSelectPreset = (doc: PresetDocument) => {
    setSelectedPreset(doc);
    setIsCustomMode(false);
    setSelectedBrand(doc.brand);
  };

  const handleTriggerRun = async () => {
    const title = isCustomMode ? (customTitle || 'Custom UGC Document') : selectedPreset.title;
    const content = isCustomMode ? (customContent || 'Sample document content') : selectedPreset.sampleContent;
    const mimeType = isCustomMode ? 'application/pdf' : selectedPreset.mimeType;

    await onRunIngestion({
      title,
      content,
      brand: selectedBrand,
      mimeType,
      chunkStrategy,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCustomTitle(file.name);
    setIsCustomMode(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCustomContent(text || `Uploaded document: ${file.name}\nSize: ${(file.size / 1024).toFixed(1)} KB`);
    };
    reader.readAsText(file);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Strategic Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-5 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider border border-amber-500/30">
                Live Ingestion Core
              </span>
              <span className="text-xs text-slate-400 font-mono">Pipeline v2.4 (Real-Time VLM)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Real-Time AI-Native Document Ingestion Engine
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Replacing legacy batch OCR and monolithic queue delay with real-time Vision-Language Model parsing, 
              zero-trust sandboxed isolation, intelligent semantic chunking, and dual-delivery serving for readers and AI agents.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="btn-run-pipeline"
              onClick={handleTriggerRun}
              disabled={isRunning}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm shadow-lg transition-all ${
                isRunning
                  ? 'bg-amber-600/60 text-amber-200 cursor-not-allowed animate-pulse'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-amber-500/20 hover:shadow-amber-500/30 active:scale-[0.98]'
              }`}
            >
              {isRunning ? (
                <>
                  <Cpu className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Streaming Through Ingestion Stages...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Ingest & Parse Document Now</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Control Bench: Preset Selector & Ingestion Options */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Preset Document Selection */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                <FileCode className="w-4 h-4 text-amber-600" />
                Select Ingestion Test Corpus
              </h3>
              <p className="text-xs text-slate-500">Pick a production UGC scenario or provide custom text</p>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-600 hover:text-amber-600 cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-amber-400 bg-slate-50 transition-colors">
                <FileUp className="w-3.5 h-3.5" />
                <span>Upload File</span>
                <input 
                  type="file" 
                  accept=".txt,.md,.pdf,.json" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
              </label>
            </div>
          </div>

          {/* Preset Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PRESET_DOCUMENTS.map((doc) => {
              const isSelected = !isCustomMode && selectedPreset.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => handleSelectPreset(doc)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase">
                      {doc.brand}
                    </span>
                    <span className="text-[10px] font-medium text-amber-700 bg-amber-100/60 px-2 py-0.5 rounded">
                      {doc.highlightTag}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-900 line-clamp-1 mb-1">
                    {doc.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {doc.description}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>{doc.pageCount} pages</span>
                    <span>{doc.fileSize}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Custom document editor toggle */}
          {isCustomMode && (
            <div className="p-3.5 bg-slate-50 border border-amber-300 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-800">Custom Document Payload</span>
                <button 
                  onClick={() => setIsCustomMode(false)}
                  className="text-xs text-slate-500 hover:text-slate-700 underline"
                >
                  Return to Presets
                </button>
              </div>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="Document Title"
                className="w-full text-xs px-3 py-1.5 rounded border border-slate-300 bg-white"
              />
              <textarea
                value={customContent}
                onChange={(e) => setCustomContent(e.target.value)}
                rows={4}
                placeholder="Paste Markdown or text payload..."
                className="w-full text-xs font-mono p-2 rounded border border-slate-300 bg-white"
              />
            </div>
          )}
        </div>

        {/* Right Column: Ingestion Engine Configuration */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
              <Sliders className="w-4 h-4 text-slate-700" />
              Pipeline Controls
            </h3>
            <p className="text-xs text-slate-500">Tune platform parser and chunking parameters</p>
          </div>

          {/* Source Brand Target */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">Target Product Surface</label>
            <div className="grid grid-cols-2 gap-2">
              {(['scribd', 'slideshare', 'everand', 'fable'] as SourceBrand[]).map((b) => (
                <button
                  key={b}
                  onClick={() => setSelectedBrand(b)}
                  className={`px-2.5 py-1.5 text-xs rounded-lg border font-medium capitalize transition-colors ${
                    selectedBrand === b
                      ? 'border-amber-500 bg-amber-50 text-amber-800 font-semibold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Chunking Strategy */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700 flex items-center justify-between">
              <span>Chunking Architecture</span>
              <span className="text-[10px] text-amber-600 font-semibold">ADR-003</span>
            </label>
            <div className="space-y-1.5">
              <label className="flex items-start gap-2 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="radio"
                  name="chunkStrategy"
                  checked={chunkStrategy === 'semantic_vlm'}
                  onChange={() => setChunkStrategy('semantic_vlm')}
                  className="mt-0.5 text-amber-500 focus:ring-amber-400"
                />
                <div>
                  <div className="text-xs font-semibold text-slate-800">Dynamic Semantic Boundaries</div>
                  <div className="text-[10px] text-slate-500">VLM layout-aware, preserves tables & Speechify audio sentences</div>
                </div>
              </label>

              <label className="flex items-start gap-2 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="radio"
                  name="chunkStrategy"
                  checked={chunkStrategy === 'fixed_token'}
                  onChange={() => setChunkStrategy('fixed_token')}
                  className="mt-0.5 text-amber-500 focus:ring-amber-400"
                />
                <div>
                  <div className="text-xs font-semibold text-slate-800">Fixed 512-Token Window (Legacy)</div>
                  <div className="text-[10px] text-slate-500">Arbitrary token slicing, risk of chopped formulas</div>
                </div>
              </label>

              <label className="flex items-start gap-2 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="radio"
                  name="chunkStrategy"
                  checked={chunkStrategy === 'markdown_hierarchy'}
                  onChange={() => setChunkStrategy('markdown_hierarchy')}
                  className="mt-0.5 text-amber-500 focus:ring-amber-400"
                />
                <div>
                  <div className="text-xs font-semibold text-slate-800">Markdown Hierarchy AST</div>
                  <div className="text-[10px] text-slate-500">Splits by H1/H2 headings with parent breadcrumbs</div>
                </div>
              </label>
            </div>
          </div>

          {/* Trust & Safety Guardrail Banner */}
          <div className="p-2.5 rounded-xl bg-slate-900 text-white text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero-Trust Sandbox Active</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Ephemeral Firecracker microVM, egress network blocked, automated regex PII sanitization.
            </p>
          </div>
        </div>
      </div>

      {/* Real-Time 5-Stage Waterfall Telemetry */}
      {currentJob && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">{currentJob.id}</span>
                <span className="text-slate-300">•</span>
                <h3 className="font-bold text-slate-900 text-sm">{currentJob.documentTitle}</h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    currentJob.overallStatus === 'quarantined'
                      ? 'bg-red-100 text-red-700 border border-red-300'
                      : 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                  }`}
                >
                  {currentJob.overallStatus.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Total pipeline latency: <strong className="text-slate-800 font-mono">{currentJob.totalLatencyMs}ms</strong> • Target SLO: &lt;2500ms (p95)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onSelectForSpeechify(currentJob)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-medium transition-colors"
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>Open in Speechify Studio</span>
              </button>
              <button
                onClick={() => onSelectForRAG(currentJob)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-300 text-xs font-medium transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Test RAG Grounding</span>
              </button>
            </div>
          </div>

          {/* 5 Stages Flow Visualization */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {currentJob.stages.map((stage, idx) => {
              const isQuarantined = stage.status === 'quarantined';
              return (
                <div
                  key={stage.id}
                  className={`p-3 rounded-xl border transition-all ${
                    isQuarantined
                      ? 'border-red-400 bg-red-50/70'
                      : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-amber-400 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-mono text-[10px] text-slate-400">Stage 0{idx + 1}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        isQuarantined
                          ? 'bg-red-200 text-red-800 font-bold'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {stage.durationMs}ms
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1 mb-1">
                    {stage.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed mb-2">
                    {stage.description}
                  </p>

                  <div className="space-y-1 border-t border-slate-200/60 pt-2">
                    {stage.substeps.slice(0, 2).map((step, sIdx) => (
                      <div key={sIdx} className="text-[10px] text-slate-600 flex items-center gap-1 truncate">
                        <CheckCircle2 className={`w-2.5 h-2.5 flex-shrink-0 ${isQuarantined ? 'text-red-500' : 'text-emerald-500'}`} />
                        <span className="truncate">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Deep Inspection Tabs */}
          <div className="pt-2">
            <div className="flex border-b border-slate-200 gap-2 mb-4 overflow-x-auto">
              <button
                onClick={() => setActiveInspectTab('vlm')}
                className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-colors ${
                  activeInspectTab === 'vlm'
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                VLM Layout & Visuals
              </button>
              <button
                onClick={() => setActiveInspectTab('safety')}
                className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-colors ${
                  activeInspectTab === 'safety'
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Trust & Safety Audit ({currentJob.safetyAudit?.piiDetected.length || 0} PII)
              </button>
              <button
                onClick={() => setActiveInspectTab('chunks')}
                className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-colors ${
                  activeInspectTab === 'chunks'
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Semantic Chunks ({currentJob.chunkingAnalysis?.totalChunks || 0})
              </button>
              <button
                onClick={() => setActiveInspectTab('traces')}
                className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeInspectTab === 'traces'
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Activity className="w-3.5 h-3.5 text-indigo-500" />
                <span>Distributed Traces</span>
                <span className="text-[10px] font-mono px-1 rounded bg-indigo-100 text-indigo-800">
                  {currentJob.distributedTrace?.spans.length || 7} spans
                </span>
              </button>
              <button
                onClick={() => setActiveInspectTab('decision_tree')}
                className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeInspectTab === 'decision_tree'
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <GitBranch className="w-3.5 h-3.5 text-amber-500" />
                <span>Decision Tree</span>
              </button>
              <button
                onClick={() => setActiveInspectTab('kafka')}
                className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-colors ${
                  activeInspectTab === 'kafka'
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Downstream Kafka Event
              </button>
              <button
                onClick={() => setActiveInspectTab('raw')}
                className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-colors ${
                  activeInspectTab === 'raw'
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Raw Ingest Payload
              </button>
            </div>

            {/* Tab 1: VLM Extraction Viewer */}
            {activeInspectTab === 'vlm' && currentJob.vlmExtraction && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      VLM Document Intelligence
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-mono font-medium">
                      Gemini Multimodal VLM
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-slate-500 font-medium">Executive Summary:</span>
                      <p className="text-slate-800 mt-0.5 leading-relaxed bg-white p-2 rounded border border-slate-200">
                        {currentJob.vlmExtraction.summary}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                      <div className="p-2 bg-white rounded border border-slate-200">
                        <span className="text-slate-500 block">Language:</span>
                        <span className="font-semibold text-slate-800">{currentJob.vlmExtraction.detectedLanguage}</span>
                      </div>
                      <div className="p-2 bg-white rounded border border-slate-200">
                        <span className="text-slate-500 block">Reading Grade:</span>
                        <span className="font-semibold text-slate-800">{currentJob.vlmExtraction.readingLevel}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-500 font-medium">Key Semantic Entities:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {currentJob.vlmExtraction.keyEntities.map((ent, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-medium">
                            {ent}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visual Elements & Layout Tree */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    Extracted Visual Elements & Tables
                  </span>

                  <div className="space-y-2">
                    {currentJob.vlmExtraction.visualElements.map((vis) => (
                      <div key={vis.id} className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 capitalize flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                            {vis.type} Element (Page {vis.pageIndex})
                          </span>
                          <span className="font-mono text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                            {Math.round(vis.confidence * 100)}% confidence
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">
                          {vis.description}
                        </p>
                        <div className="flex gap-1 pt-1">
                          {vis.detectedLabels.map((lbl, li) => (
                            <span key={li} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                              #{lbl}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Structural Tree */}
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-[11px] font-semibold text-slate-700 block mb-1.5">
                      Hierarchical Layout Structure
                    </span>
                    <div className="space-y-1 max-h-32 overflow-y-auto font-mono text-[10px]">
                      {currentJob.vlmExtraction.structureTree.map((node, ni) => (
                        <div key={ni} className="flex items-center justify-between p-1 rounded hover:bg-slate-100">
                          <span className="text-slate-700" style={{ paddingLeft: `${(node.level - 1) * 12}px` }}>
                            {node.level === 1 ? '■' : '↳'} {node.title}
                          </span>
                          <span className="text-slate-400">p.{node.pageIndex} (~{node.tokenEstimate} tok)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Trust & Safety Audit */}
            {activeInspectTab === 'safety' && currentJob.safetyAudit && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        currentJob.safetyAudit.verdict === 'QUARANTINED'
                          ? 'bg-red-500 animate-pulse'
                          : 'bg-emerald-500'
                      }`}
                    ></div>
                    <span className="font-bold text-sm text-slate-900">
                      Audit Verdict: {currentJob.safetyAudit.verdict}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span>Trust Score: <strong className="text-slate-800">{currentJob.safetyAudit.trustScore}/100</strong></span>
                    <span>Quality Index: <strong className="text-slate-800">{currentJob.safetyAudit.qualityScore}/100</strong></span>
                    <span>Prompt Injection: <strong className={currentJob.safetyAudit.promptInjectionRisk === 'HIGH' ? 'text-red-600' : 'text-emerald-600'}>{currentJob.safetyAudit.promptInjectionRisk}</strong></span>
                  </div>
                </div>

                {currentJob.safetyAudit.quarantineReason && (
                  <div className="p-3 bg-red-100 border border-red-300 rounded-xl text-xs text-red-800 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="block font-semibold">SECURITY ACTION TAKEN:</strong>
                      {currentJob.safetyAudit.quarantineReason}
                    </div>
                  </div>
                )}

                {/* PII Findings Table */}
                <div>
                  <span className="text-xs font-semibold text-slate-700 block mb-2">
                    Automated PII Redaction Log (Protected by Zero-Trust Rule):
                  </span>
                  {currentJob.safetyAudit.piiDetected.length === 0 ? (
                    <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-500 italic">
                      No sensitive Personal Identifiable Information (SSN, credit cards, confidential phones) detected.
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {currentJob.safetyAudit.piiDetected.map((item, idx) => (
                        <div key={idx} className="p-2 bg-white rounded border border-slate-200 text-xs flex items-center justify-between font-mono">
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-800 font-bold text-[10px]">
                              {item.type}
                            </span>
                            <span className="text-slate-400 line-through">{item.originalSnippet}</span>
                            <span className="text-slate-400">→</span>
                            <span className="text-emerald-700 font-semibold">{item.redactedReplacement}</span>
                          </div>
                          <span className="text-[10px] text-slate-400">Masked prior to corpus storage</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sanitization logs */}
                <div>
                  <span className="text-xs font-semibold text-slate-700 block mb-1">Sanitization Pipeline Logs:</span>
                  <div className="p-2.5 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-lg space-y-1">
                    {currentJob.safetyAudit.sanitizationLogs.map((log, li) => (
                      <div key={li} className="flex items-center gap-2">
                        <span className="text-slate-500">&gt;</span>
                        <span>{log}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Semantic Chunks & Vectorization */}
            {activeInspectTab === 'chunks' && currentJob.chunkingAnalysis && (
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-800">Chunking Strategy: </span>
                    <span className="font-mono text-amber-700">{currentJob.chunkingAnalysis.strategy}</span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-600 font-mono text-[11px]">
                    <span>Total Chunks: <strong>{currentJob.chunkingAnalysis.totalChunks}</strong></span>
                    <span>Avg Tokens: <strong>{currentJob.chunkingAnalysis.avgChunkTokens}</strong></span>
                    <span>Boundary Score: <strong>{currentJob.chunkingAnalysis.boundaryPreservationScore}%</strong></span>
                  </div>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {currentJob.chunkingAnalysis.chunks.map((chunk) => (
                    <div key={chunk.id} className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-[10px]">
                            Chunk #{chunk.chunkIndex}
                          </span>
                          <span className="text-slate-500 font-medium truncate max-w-xs">{chunk.headingContext}</span>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
                          <span>{chunk.tokenCount} tokens</span>
                          <span>•</span>
                          <span>p.{chunk.pageNumber}</span>
                          <span>•</span>
                          <span className="text-indigo-600">~{chunk.speechifyDurationEstSec}s audio</span>
                        </div>
                      </div>

                      <p className="text-slate-700 font-sans leading-relaxed text-xs">
                        {chunk.text}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 text-[10px] font-mono text-slate-500">
                        <span className="bg-slate-100 px-2 py-0.5 rounded truncate max-w-md">
                          Anchor: {chunk.citationAnchor}
                        </span>
                        <div className="flex items-center gap-1 text-slate-400">
                          <span>Embedding (1536d):</span>
                          <span>[{chunk.embeddingPreview.join(', ')}...]</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Distributed Traces */}
            {activeInspectTab === 'traces' && (
              <TracingVisualizer currentJob={currentJob} />
            )}

            {/* Tab 5: Chunking Decision Tree */}
            {activeInspectTab === 'decision_tree' && (
              <ChunkingDecisionTree currentStrategy={currentJob.chunkingAnalysis?.strategy} />
            )}

            {/* Tab 6: Downstream Kafka Event */}
            {activeInspectTab === 'kafka' && currentJob.downstreamEvent && (
              <div className="p-4 bg-slate-900 text-slate-200 rounded-xl space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-amber-400 font-bold">EVENT CONTRACT: content.ingested.v2</span>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(currentJob.downstreamEvent, null, 2))}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
                  >
                    {copiedPayload ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedPayload ? 'Copied' : 'Copy JSON'}</span>
                  </button>
                </div>
                <pre className="overflow-x-auto text-[11px] leading-relaxed text-emerald-400">
                  {JSON.stringify(currentJob.downstreamEvent, null, 2)}
                </pre>
              </div>
            )}

            {/* Tab 5: Raw Ingest Payload */}
            {activeInspectTab === 'raw' && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs max-h-80 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                  {currentJob.rawText}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
