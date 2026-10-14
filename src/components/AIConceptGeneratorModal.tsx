import React, { useState } from 'react';
import { X, Sparkles, Brain, ArrowRight, Loader2, CheckCircle2, Sliders, Layers } from 'lucide-react';
import { Category, Concept, Task } from '../types';
import { generateConceptBreakdown } from '../services/aiConceptService';
import { LogoIcon } from './ConceptAILogo';
import confetti from 'canvas-confetti';

interface AIConceptGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyConceptAndTasks: (concept: Concept, tasks: Task[]) => void;
}

export const AIConceptGeneratorModal: React.FC<AIConceptGeneratorModalProps> = ({
  isOpen,
  onClose,
  onApplyConceptAndTasks,
}) => {
  const [prompt, setPrompt] = useState('');
  const [category, setCategory] = useState<Category>('Tech');
  const [loading, setLoading] = useState(false);
  const [previewResult, setPreviewResult] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    try {
      const result = await generateConceptBreakdown(prompt, category);
      setPreviewResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAndAdd = () => {
    if (!previewResult) return;

    const conceptId = `cpt_${Date.now()}`;
    const newConcept: Concept = {
      id: conceptId,
      title: previewResult.conceptTitle || prompt,
      description: previewResult.conceptDescription || 'Decomposed by Concept AI',
      category: previewResult.category || category,
      color: category === 'Study' ? '#3b82f6' : category === 'Health' ? '#10b981' : '#06b6d4',
      progress: 0,
      createdAt: new Date().toISOString().split('T')[0],
      nodes: (previewResult.neuralNodes || []).map((n: any, idx: number) => ({
        id: `node_${conceptId}_${idx}`,
        label: n.label,
        type: n.type || 'task',
        status: 'todo',
        description: n.description,
        x: 180 + (idx % 3) * 180,
        y: 120 + Math.floor(idx / 3) * 140,
      })),
      edges: (previewResult.neuralNodes || []).slice(1).map((_: any, idx: number) => ({
        from: `node_${conceptId}_0`,
        to: `node_${conceptId}_${idx + 1}`,
      })),
    };

    const newTasks: Task[] = previewResult.tasks.map((t: any, idx: number) => ({
      id: `tsk_${Date.now()}_${idx}`,
      title: t.title,
      description: t.description,
      conceptId: conceptId,
      priority: t.priority || 'medium',
      category: previewResult.category || category,
      status: 'todo',
      dueDate: new Date(Date.now() + 86400000 * (idx + 2)).toISOString().split('T')[0],
      estimatedMinutes: t.estimatedMinutes || 45,
      subtasks: (t.subtasks || []).map((st: string, sidx: number) => ({
        id: `st_${Date.now()}_${idx}_${sidx}`,
        title: st,
        completed: false,
      })),
      tags: t.tags || [category, 'ConceptAI'],
      aiGenerated: true,
      createdAt: new Date().toISOString().split('T')[0],
    }));

    confetti({
      particleCount: 75,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#00f2fe', '#38bdf8', '#2563eb', '#ffffff'],
    });

    onApplyConceptAndTasks(newConcept, newTasks);
    onClose();
    setPreviewResult(null);
    setPrompt('');
  };

  const samplePrompts = [
    { title: 'Master Machine Learning Algorithms', cat: 'Study' as Category },
    { title: 'Deploy High-Volume Stripe SaaS Billing System', cat: 'Tech' as Category },
    { title: '30-Day Daily Deep Work & Health Reset', cat: 'Health' as Category },
    { title: 'Prepare for Final Semester Honors Thesis', cat: 'Study' as Category },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl glass-panel border border-cyan-400/40 p-6 sm:p-8 shadow-[0_0_60px_rgba(6,182,212,0.25)] overflow-hidden max-h-[90vh] flex flex-col justify-between">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-cyan-900/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <LogoIcon width={22} height={22} animate={false} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Concept AI Neural Decomposer
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Gemini 2.5
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Transform any high-level concept, subject, or project into structured neural tasks.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="my-5 space-y-4 overflow-y-auto pr-1">
          {!previewResult ? (
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                  What goal or concept do you want to decompose?
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
                  placeholder="e.g., Master Distributed Consensus & Paxos, or Launch a high-converting MVP landing page with payment integration..."
                  className="w-full rounded-xl bg-slate-900/90 border border-cyan-500/30 p-3.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />
              </div>

              {/* Category Picker */}
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Taxonomy Category
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {(['Tech', 'Work', 'Study', 'Personal', 'Research', 'Health'] as Category[]).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`py-2 px-1 text-xs font-medium rounded-xl border text-center transition-all ${
                        category === cat
                          ? 'bg-cyan-500/25 text-cyan-300 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                          : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sample Quick Starters */}
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Quick Starter Templates
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {samplePrompts.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setPrompt(sample.title);
                        setCategory(sample.cat);
                      }}
                      className="text-left p-2.5 rounded-xl bg-slate-900/60 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-300 transition-all flex items-center justify-between group"
                    >
                      <span className="truncate">{sample.title}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!prompt.trim() || loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-600 text-slate-950 font-black text-sm tracking-wide shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:brightness-110 disabled:opacity-40 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Decomposing Neural Synapses...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Decompose with Concept AI
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Result Preview Screen */
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30">
                <span className="text-[10px] font-mono uppercase text-cyan-400 tracking-wider">
                  Generated Concept Map
                </span>
                <h4 className="text-base font-bold text-white mt-0.5">{previewResult.conceptTitle}</h4>
                <p className="text-xs text-slate-300 mt-1">{previewResult.conceptDescription}</p>
              </div>

              {/* Tasks preview list */}
              <div>
                <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Actionable Task Breakdown ({previewResult.tasks?.length} tasks)
                </h5>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {previewResult.tasks?.map((t: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-100">{t.title}</span>
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                          {t.priority}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{t.description}</p>
                      {t.subtasks?.length > 0 && (
                        <div className="pt-1 text-[10px] text-cyan-400 font-mono">
                          ✓ {t.subtasks.length} checklist items included
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-cyan-900/40">
                <button
                  type="button"
                  onClick={() => setPreviewResult(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:text-white"
                >
                  Edit Prompt
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAndAdd}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 font-black text-xs shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:brightness-110 flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Apply Concept & Tasks to Workspace
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
