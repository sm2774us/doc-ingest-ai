import React, { useState, useEffect, useRef } from 'react';
import { 
  Headphones, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  Sparkles, 
  Radio, 
  Clock, 
  Sliders, 
  FileText, 
  Check, 
  Copy,
  ChevronRight,
  Zap
} from 'lucide-react';
import { IngestionJob, SpeechifyAudioSegment } from '../types';

interface SpeechifyAudioStudioProps {
  currentJob: IngestionJob | null;
  onNavigateToIngest: () => void;
}

export const SpeechifyAudioStudio: React.FC<SpeechifyAudioStudioProps> = ({
  currentJob,
  onNavigateToIngest,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [selectedVoice, setSelectedVoice] = useState('Kore (Neural Warm)');
  const [copiedSSML, setCopiedSSML] = useState(false);
  const [isSpeechAvailable, setIsSpeechAvailable] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const segments: SpeechifyAudioSegment[] = currentJob?.speechifyStream?.segments || [];
  const currentSegment = segments[currentSegmentIndex];

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSpeechAvailable(true);
    }
  }, []);

  // Stop speech when unmounting or switching document
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentJob?.id]);

  const playSegmentAtIndex = (index: number) => {
    if (index >= segments.length) {
      setIsPlaying(false);
      setCurrentSegmentIndex(0);
      return;
    }

    setCurrentSegmentIndex(index);
    setIsPlaying(true);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const textToSpeak = segments[index]?.text || '';
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = playbackRate;

      // Select matching voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha')));
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onend = () => {
        if (index + 1 < segments.length) {
          playSegmentAtIndex(index + 1);
        } else {
          setIsPlaying(false);
          setCurrentSegmentIndex(0);
        }
      };

      utterance.onerror = () => {
        setIsPlaying(false);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback timer simulation if Web Speech is blocked in iframe
      const duration = (segments[index]?.endTimeSec - segments[index]?.startTimeSec) * 1000 / playbackRate;
      setTimeout(() => {
        if (index + 1 < segments.length) {
          playSegmentAtIndex(index + 1);
        } else {
          setIsPlaying(false);
        }
      }, Math.max(1500, duration));
    }
  };

  const togglePlayback = () => {
    if (isPlaying) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
    } else {
      playSegmentAtIndex(currentSegmentIndex);
    }
  };

  const handleReset = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setCurrentSegmentIndex(0);
  };

  const copySSML = () => {
    if (!currentJob?.speechifyStream) return;
    navigator.clipboard.writeText(currentJob.speechifyStream.ssmlText);
    setCopiedSSML(true);
    setTimeout(() => setCopiedSSML(false), 2000);
  };

  if (!currentJob || segments.length === 0) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
          <Headphones className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">No Ingested Document in Audio Buffer</h3>
        <p className="text-slate-500 text-sm max-w-md mx-auto">
          Please run the Real-Time Ingestion Pipeline first to transcode a document into Speechify-ready audio narration tokens with word-level timestamps.
        </p>
        <button
          onClick={onNavigateToIngest}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-xl text-sm transition-colors"
        >
          Go to Ingestion Engine
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Strategic Header */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-2xl p-5 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-black/20 text-white text-xs font-semibold uppercase tracking-wider">
                Speechify Audio Foundations
              </span>
              <span className="text-xs text-amber-100 font-mono">Stream Transcoding v3.1</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Real-Time Document-to-Voice Narration Engine
            </h2>
            <p className="text-xs sm:text-sm text-amber-100 max-w-3xl leading-relaxed">
              Demonstrating how Content Foundations dual-dispatches every ingested PDF, article, and presentation 
              into high-fidelity Speechify narration tokens with word-level sentence offsets, SSML prosody cues, and multi-speed playback.
            </p>
          </div>

          <div className="bg-black/20 backdrop-blur-sm px-4 py-2 rounded-xl text-right font-mono text-xs text-amber-100">
            <div>Document: <strong className="text-white">{currentJob.documentTitle}</strong></div>
            <div>Estimated Duration: <strong className="text-white">{currentJob.speechifyStream?.totalDurationSeconds}s</strong></div>
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Synchronized Visual Reader & Highlighting */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-5">
          {/* Active Audio Player Bar */}
          <div className="p-4 bg-slate-900 rounded-xl text-white space-y-4 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  id="btn-toggle-speechify-audio"
                  onClick={togglePlayback}
                  className="w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-amber-500/30 transition-transform active:scale-95"
                  title={isPlaying ? 'Pause Audio' : 'Play Audio'}
                >
                  {isPlaying ? <Pause className="w-6 h-6 fill-slate-950" /> : <Play className="w-6 h-6 fill-slate-950 ml-0.5" />}
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">
                      {isPlaying ? 'Now Narrating Segment ' + (currentSegmentIndex + 1) : 'Audio Ready'}
                    </span>
                    {isPlaying && (
                      <span className="flex gap-0.5 items-center h-3">
                        <span className="w-1 h-3 bg-amber-400 animate-pulse"></span>
                        <span className="w-1 h-2 bg-amber-400 animate-pulse delay-75"></span>
                        <span className="w-1 h-4 bg-amber-400 animate-pulse delay-150"></span>
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    Segment {currentSegmentIndex + 1} of {segments.length} • {selectedVoice}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Reset to beginning"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Playback Progress Indicator */}
            <div className="space-y-1">
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-amber-500 h-1.5 transition-all duration-300"
                  style={{ width: `${((currentSegmentIndex + 1) / segments.length) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Offset: {currentSegment?.startTimeSec || 0}s</span>
                <span>Total: {currentJob.speechifyStream?.totalDurationSeconds}s</span>
              </div>
            </div>

            {/* Playback Speed & Voice Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Speed:</span>
                {[0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setPlaybackRate(rate)}
                    className={`px-2 py-0.5 rounded font-mono text-xs transition-colors ${
                      playbackRate === rate
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <Volume2 className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="bg-slate-800 text-slate-200 text-xs px-2.5 py-1 rounded border border-slate-700 focus:outline-none"
                >
                  <option value="Kore (Neural Warm)">Kore (Neural Warm Studio)</option>
                  <option value="Puck (Editorial Clear)">Puck (Editorial Clear)</option>
                  <option value="Fenrir (Deep Narrative)">Fenrir (Deep Narrative)</option>
                  <option value="Zephyr (Academic)">Zephyr (Academic Precision)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Synchronized Document Reader with Active Sentence Illumination */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600" />
                Synchronized Reader Canvas
              </h3>
              <span className="text-xs text-slate-500">
                Click any paragraph to jump narration immediately
              </span>
            </div>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
              {segments.map((seg, idx) => {
                const isActive = idx === currentSegmentIndex;
                return (
                  <div
                    key={seg.id}
                    onClick={() => playSegmentAtIndex(idx)}
                    className={`p-3.5 rounded-xl border text-sm transition-all cursor-pointer ${
                      isActive
                        ? 'border-amber-500 bg-amber-50/70 shadow-sm ring-2 ring-amber-400/20'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1.5">
                      <span className="flex items-center gap-1.5">
                        {isActive && <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>}
                        <strong className={isActive ? 'text-amber-800' : 'text-slate-600'}>
                          Segment {idx + 1}
                        </strong>
                      </span>
                      <span>
                        [{seg.startTimeSec}s - {seg.endTimeSec}s]
                      </span>
                    </div>

                    <p className={`leading-relaxed text-xs sm:text-sm ${isActive ? 'text-slate-950 font-medium' : 'text-slate-700'}`}>
                      {seg.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Platform Metadata & SSML Inspector */}
        <div className="lg:col-span-4 space-y-4">
          {/* Engineering Value Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
            <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
              <Zap className="w-4 h-4 text-amber-600" />
              Platform Impact for Speechify
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Instead of passing raw, unformatted PDF dumps to Speechify, Content Foundations delivers structured, 
              prosody-ready tokens:
            </p>
            <ul className="text-xs text-slate-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></span>
                <span><strong>No sentence truncation:</strong> Dynamic semantic chunking guarantees zero mid-clause cuts.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></span>
                <span><strong>Bounding Box Sync:</strong> Word offsets align with visual PDF coordinates for synchronized UI glow.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></span>
                <span><strong>Pre-warmed Streaming:</strong> Page 1 is listenable in &lt;1.8s, streaming remaining segments asynchronously.</span>
              </li>
            </ul>
          </div>

          {/* SSML Markup Preview */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 text-white space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono text-amber-400 font-semibold">Generated SSML Markup</span>
              <button
                onClick={copySSML}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800"
              >
                {copiedSSML ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSSML ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="text-[11px] font-mono text-emerald-400 overflow-x-auto p-2 bg-slate-950 rounded leading-relaxed max-h-48">
              {currentJob.speechifyStream?.ssmlText}
            </pre>
          </div>

          {/* Timing Tokens Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-2">
            <span className="text-xs font-semibold text-slate-800 block">
              Audio Token Index Table
            </span>
            <div className="space-y-1 text-[11px] font-mono max-h-48 overflow-y-auto">
              {segments.map((seg, i) => (
                <div key={i} className="flex items-center justify-between p-1.5 rounded bg-slate-50 hover:bg-slate-100">
                  <span className="text-slate-700 truncate max-w-[140px]">{seg.text}</span>
                  <span className="text-amber-700 font-semibold">{seg.startTimeSec}s - {seg.endTimeSec}s</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
