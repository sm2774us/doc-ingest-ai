import React, { useState } from 'react';
import { 
  GitBranch, 
  CheckCircle2, 
  FileText, 
  Layers, 
  Headphones, 
  Cpu, 
  Scissors, 
  ArrowRight, 
  Sparkles, 
  Sliders, 
  Check, 
  Info,
  ChevronDown
} from 'lucide-react';
import { DecisionTreeNode } from '../types';

interface ChunkingDecisionTreeProps {
  currentStrategy?: 'semantic_vlm' | 'fixed_token' | 'markdown_hierarchy';
}

export const ChunkingDecisionTree: React.FC<ChunkingDecisionTreeProps> = ({
  currentStrategy = 'semantic_vlm',
}) => {
  const [testFormat, setTestFormat] = useState<'slideshare' | 'technical_pdf' | 'markdown_guide' | 'plain_text'>('slideshare');
  const [hasVisualTables, setHasVisualTables] = useState<boolean>(true);
  const [enableSpeechifySync, setEnableSpeechifySync] = useState<boolean>(true);

  // Calculate dynamic decision path based on parameters
  const calculateSelectedStrategy = () => {
    if (testFormat === 'slideshare' || (testFormat === 'technical_pdf' && hasVisualTables)) {
      return 'semantic_vlm';
    }
    if (testFormat === 'markdown_guide') {
      return 'markdown_hierarchy';
    }
    return 'fixed_token';
  };

  const selectedStrategy = calculateSelectedStrategy();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <GitBranch className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Dynamic Chunking Strategy Decision Tree
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold border border-amber-300">
              ADR-003 Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Visualizing how Content Foundations inspects document structure, reading order, and audio constraints to automatically choose the optimal chunking algorithm.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Active Path Verdict:</span>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-500 text-slate-950 shadow-sm">
            {selectedStrategy.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Interactive Simulator Bar */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-amber-600" />
            Document Structural Parameters (Interactive Test Bench):
          </span>
          <span className="text-[10px] text-slate-500 font-mono">Tweak parameters to watch path reroute</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Format Selector */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600">Ingress Document Format:</label>
            <select
              value={testFormat}
              onChange={(e) => setTestFormat(e.target.value as any)}
              className="w-full text-xs font-medium bg-white border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-400 focus:outline-none"
            >
              <option value="slideshare">SlideShare Presentation (PPTX / Deck)</option>
              <option value="technical_pdf">Complex Technical PDF (Multi-Column)</option>
              <option value="markdown_guide">Markdown Documentation Guide (AST)</option>
              <option value="plain_text">Unstructured Raw Text / Scratchpad</option>
            </select>
          </div>

          {/* Visual Tables Toggle */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600">Visual Diagrams / Tables Detected:</label>
            <div className="flex gap-2">
              <button
                onClick={() => setHasVisualTables(true)}
                className={`flex-1 py-2 text-xs rounded-lg font-semibold border transition-colors ${
                  hasVisualTables
                    ? 'bg-amber-500 text-slate-950 border-amber-500'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                YES (Tables / Visuals)
              </button>
              <button
                onClick={() => setHasVisualTables(false)}
                className={`flex-1 py-2 text-xs rounded-lg font-semibold border transition-colors ${
                  !hasVisualTables
                    ? 'bg-amber-500 text-slate-950 border-amber-500'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                NO (Pure Text)
              </button>
            </div>
          </div>

          {/* Speechify Audio Sync Toggle */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600">Speechify Narration Sync Required:</label>
            <div className="flex gap-2">
              <button
                onClick={() => setEnableSpeechifySync(true)}
                className={`flex-1 py-2 text-xs rounded-lg font-semibold border transition-colors ${
                  enableSpeechifySync
                    ? 'bg-amber-500 text-slate-950 border-amber-500'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                ENABLED
              </button>
              <button
                onClick={() => setEnableSpeechifySync(false)}
                className={`flex-1 py-2 text-xs rounded-lg font-semibold border transition-colors ${
                  !enableSpeechifySync
                    ? 'bg-amber-500 text-slate-950 border-amber-500'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                DISABLED
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-Step Visual Decision Tree */}
      <div className="space-y-4">
        {/* Level 1: Ingress MIME & Document Structure Inspection */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded">
              STEP 1: Ingress Format & Layout Decomposition
            </span>
            <span className="text-[10px] font-mono text-slate-400">Heuristic Parser Hook</span>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed">
            Content Foundations scans document headers, page geometry, and magic bytes.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
            <div
              className={`p-2.5 rounded-lg border transition-all ${
                testFormat === 'slideshare' || testFormat === 'technical_pdf'
                  ? 'border-amber-500 bg-amber-50/60 font-bold text-slate-900 ring-1 ring-amber-400'
                  : 'border-slate-200 bg-slate-50 text-slate-500'
              }`}
            >
              <span>[Branch A] Multi-Page Slide / Rich PDF</span>
              <span className="block text-[9px] font-normal text-slate-500 mt-0.5">
                Contains slide canvas or multi-column flow
              </span>
            </div>

            <div
              className={`p-2.5 rounded-lg border transition-all ${
                testFormat === 'markdown_guide'
                  ? 'border-amber-500 bg-amber-50/60 font-bold text-slate-900 ring-1 ring-amber-400'
                  : 'border-slate-200 bg-slate-50 text-slate-500'
              }`}
            >
              <span>[Branch B] Structured Markdown AST</span>
              <span className="block text-[9px] font-normal text-slate-500 mt-0.5">
                Explicit H1, H2, code fences, blockquotes
              </span>
            </div>

            <div
              className={`p-2.5 rounded-lg border transition-all ${
                testFormat === 'plain_text'
                  ? 'border-amber-500 bg-amber-50/60 font-bold text-slate-900 ring-1 ring-amber-400'
                  : 'border-slate-200 bg-slate-50 text-slate-500'
              }`}
            >
              <span>[Branch C] Unstructured Raw Stream</span>
              <span className="block text-[9px] font-normal text-slate-500 mt-0.5">
                Continuous text without structural tags
              </span>
            </div>
          </div>
        </div>

        {/* Level 2: Visual Elements & Boundary Integrity */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded">
              STEP 2: Multimodal Visual Continuity & Table Isolation
            </span>
            <span className="text-[10px] font-mono text-slate-400">VLM Vision Boundary Check</span>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed">
            Checks whether tables, charts, or mathematical equations would be corrupted if cut mid-token.
          </p>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs flex items-center justify-between font-mono">
            <div>
              <span className="text-slate-500">Evaluated Condition: </span>
              <strong className="text-slate-900">
                {hasVisualTables ? 'Tables/Visuals Present' : 'Pure Text Flow'}
              </strong>
            </div>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                hasVisualTables
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {hasVisualTables ? 'Semantic Anchor Required' : 'Standard Boundary'}
            </span>
          </div>
        </div>

        {/* Level 3: Downstream Speechify Prosody Alignment */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded">
              STEP 3: Downstream Speechify Audio Cadence & TTS Alignment
            </span>
            <span className="text-[10px] font-mono text-slate-400">Audio Tokenizer</span>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed">
            Ensures that every chunk boundary coincides with a sentence break or paragraph pause for natural audio narration.
          </p>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs flex items-center justify-between font-mono">
            <div>
              <span className="text-slate-500">Speechify Alignment Constraint: </span>
              <strong className="text-slate-900">
                {enableSpeechifySync ? 'Synchronized Sentence Offsets' : 'Bypass Audio Formatting'}
              </strong>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              {enableSpeechifySync ? 'Zero Mid-Clause Cuts' : 'Standard Token Chunk'}
            </span>
          </div>
        </div>

        {/* Level 4: Final Strategy Decision Output */}
        <div className="p-5 rounded-2xl border-2 border-amber-500 bg-gradient-to-r from-amber-50/70 via-white to-amber-50/70 shadow-md space-y-3">
          <div className="flex items-center justify-between border-b border-amber-200 pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <h4 className="text-sm font-bold text-slate-900">
                Engine Final Decision: {selectedStrategy === 'semantic_vlm' ? 'Dynamic Semantic Boundary Chunking (VLM-Assisted)' : selectedStrategy === 'markdown_hierarchy' ? 'Hierarchical Markdown AST Chunking' : 'Fixed-Token Window (512 tokens with 15% overlap)'}
              </h4>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-500 text-slate-950">
              OPTIMAL STRATEGY
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="space-y-1">
              <strong className="text-slate-800 block text-[11px]">Boundary Preservation:</strong>
              <p className="text-slate-600">
                {selectedStrategy === 'semantic_vlm'
                  ? '98.4% — Table columns, slide bullet hierarchies, and code listings kept intact.'
                  : selectedStrategy === 'markdown_hierarchy'
                  ? '95.2% — Preserves H1/H2 header breadcrumbs in chunk metadata.'
                  : '82.1% — Standard token sliding window for linear documents.'}
              </p>
            </div>

            <div className="space-y-1">
              <strong className="text-slate-800 block text-[11px]">RAG Vector Quality:</strong>
              <p className="text-slate-600">
                {selectedStrategy === 'semantic_vlm'
                  ? 'High cosine density (0.92) with precise slide coordinate bounding box anchors.'
                  : selectedStrategy === 'markdown_hierarchy'
                  ? 'High contextual relevance with parent section path embeddings.'
                  : 'Standard token embedding for general search indexing.'}
              </p>
            </div>

            <div className="space-y-1">
              <strong className="text-slate-800 block text-[11px]">Speechify Narration Sync:</strong>
              <p className="text-slate-600">
                {enableSpeechifySync
                  ? 'Word offsets match chunk boundaries for smooth voice playback without mid-sentence chops.'
                  : 'TTS will re-segment on client side.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
