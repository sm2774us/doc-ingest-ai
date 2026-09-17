import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { IngestionPipelineView } from './components/IngestionPipelineView';
import { SpeechifyAudioStudio } from './components/SpeechifyAudioStudio';
import { DownstreamContractsView } from './components/DownstreamContractsView';
import { DistributedTopologyView } from './components/DistributedTopologyView';
import { EngineeringManagerHub } from './components/EngineeringManagerHub';
import { TracingVisualizer } from './components/TracingVisualizer';
import { TrustSafetyHeatmap } from './components/TrustSafetyHeatmap';
import { ChunkingDecisionTree } from './components/ChunkingDecisionTree';
import { IncidentMonitorOverlay } from './components/IncidentMonitorOverlay';
import { IngestionJob, TelemetryMetrics, SourceBrand, RagQueryResult } from './types';
import { PRESET_DOCUMENTS } from './data/presetDocuments';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('ingestion');
  const [currentJob, setCurrentJob] = useState<IngestionJob | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [telemetry, setTelemetry] = useState<TelemetryMetrics | null>(null);
  const [isChaosRunning, setIsChaosRunning] = useState(false);

  // Fetch cluster telemetry on mount
  useEffect(() => {
    fetch('/api/telemetry')
      .then((res) => res.json())
      .then((data) => setTelemetry(data))
      .catch((err) => console.warn('Telemetry fetch error:', err));
  }, []);

  // Pre-seed initial ingestion job on load for immediate interactive exploration
  useEffect(() => {
    const initialDoc = PRESET_DOCUMENTS[0];
    handleRunIngestion({
      title: initialDoc.title,
      content: initialDoc.sampleContent,
      brand: initialDoc.brand,
      mimeType: initialDoc.mimeType,
      chunkStrategy: 'semantic_vlm',
    });
  }, []);

  const handleRunIngestion = async (config: {
    title: string;
    content: string;
    brand: SourceBrand;
    mimeType: string;
    chunkStrategy: 'semantic_vlm' | 'fixed_token' | 'markdown_hierarchy';
  }) => {
    setIsRunning(true);
    try {
      const response = await fetch('/api/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error(`Ingest failed: ${response.statusText}`);
      }

      const data: IngestionJob = await response.json();
      setCurrentJob(data);

      // Refresh telemetry
      const telRes = await fetch('/api/telemetry');
      if (telRes.ok) {
        const telData = await telRes.json();
        setTelemetry(telData);
      }
    } catch (err) {
      console.error('Ingestion error:', err);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSimulateChaos = async (action: string) => {
    setIsChaosRunning(true);
    try {
      const res = await fetch('/api/chaos-simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        const data = await res.json();
        setTelemetry(data.currentMetrics);
      }
    } catch (err) {
      console.error('Chaos simulation error:', err);
    } finally {
      setIsChaosRunning(false);
    }
  };

  const handleQueryRAG = async (query: string): Promise<RagQueryResult | null> => {
    try {
      const res = await fetch('/api/rag-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          documentId: currentJob?.id,
        }),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.error('RAG query error:', err);
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-900">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        telemetry={telemetry}
        onSimulateChaos={handleSimulateChaos}
        isChaosRunning={isChaosRunning}
      />

      <main className="flex-1 pb-16">
        {activeTab === 'ingestion' && (
          <IngestionPipelineView
            currentJob={currentJob}
            isRunning={isRunning}
            onRunIngestion={handleRunIngestion}
            onSelectForSpeechify={(job) => {
              setCurrentJob(job);
              setActiveTab('speechify');
            }}
            onSelectForRAG={(job) => {
              setCurrentJob(job);
              setActiveTab('contracts');
            }}
          />
        )}

        {activeTab === 'speechify' && (
          <SpeechifyAudioStudio
            currentJob={currentJob}
            onNavigateToIngest={() => setActiveTab('ingestion')}
          />
        )}

        {activeTab === 'contracts' && (
          <DownstreamContractsView
            currentJob={currentJob}
            onQueryRAG={handleQueryRAG}
          />
        )}

        {activeTab === 'traces' && (
          <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4">
            <TracingVisualizer currentJob={currentJob} />
          </div>
        )}

        {activeTab === 'moderation' && (
          <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4">
            <TrustSafetyHeatmap />
          </div>
        )}

        {activeTab === 'decision_tree' && (
          <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4">
            <ChunkingDecisionTree currentStrategy={currentJob?.chunkingAnalysis?.strategy} />
          </div>
        )}

        {activeTab === 'topology' && (
          <DistributedTopologyView
            telemetry={telemetry}
            onSimulateChaos={handleSimulateChaos}
            isChaosRunning={isChaosRunning}
          />
        )}

        {activeTab === 'em_os' && (
          <EngineeringManagerHub />
        )}
      </main>

      {/* Global Real-Time Incident Monitor Overlay */}
      <IncidentMonitorOverlay
        telemetry={telemetry}
        onSimulateChaos={handleSimulateChaos}
      />

      {/* Footer with Role Alignment Credentials */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-6 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-slate-200">Scribd, Inc. Content Foundations Platform</span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Senior Engineering Manager Showcase • Distributed Systems, Applied AI, and Speechify Audio Foundations
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Scribd®</span>
            <span>•</span>
            <span>SlideShare®</span>
            <span>•</span>
            <span>Everand™</span>
            <span>•</span>
            <span>Fable</span>
            <span>•</span>
            <span className="text-amber-400">Speechify Integration</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
