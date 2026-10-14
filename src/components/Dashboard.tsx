import React from 'react';
import { Task, Concept, UserProfile } from '../types';
import { ConceptAILogo, LogoIcon } from './ConceptAILogo';
import { Sparkles, ArrowRight, CheckCircle2, Clock, Flame, Zap, Brain, Layers, Play, Calendar } from 'lucide-react';

interface DashboardProps {
  tasks: Task[];
  concepts: Concept[];
  profile: UserProfile;
  onOpenAIDecompose: () => void;
  onStartFocus: () => void;
  onNavigateTab: (tab: any) => void;
  onToggleTaskComplete: (task: Task) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  tasks,
  concepts,
  profile,
  onOpenAIDecompose,
  onStartFocus,
  onNavigateTab,
  onToggleTaskComplete,
}) => {
  const urgentTasks = tasks.filter((t) => (t.priority === 'urgent' || t.priority === 'high') && t.status !== 'completed');
  const activeConcept = concepts[0];

  return (
    <div className="space-y-6">
      {/* Hero Brand & AI Daily Strategy Cockpit */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.15)]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Autonomous Cognitive Workspace
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Turn Raw Concepts Into Structured Execution.
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Welcome back, <strong className="text-white">{profile.name}</strong>. Concept AI analyzed your
              active concepts and prepared your highest leverage action items for today.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenAIDecompose}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-600 text-slate-950 font-black text-xs shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                Decompose New Concept
              </button>

              <button
                onClick={onStartFocus}
                className="px-4 py-2.5 rounded-xl bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 font-bold text-xs hover:bg-cyan-900/60 transition-all flex items-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Start Focus Sprint (25m)
              </button>

              <button
                onClick={() => onNavigateTab('spec')}
                className="px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-300 font-semibold text-xs hover:text-white hover:border-slate-500 transition-all flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                Architecture & Schema
              </button>
            </div>
          </div>

          {/* Reference Image Replica Badge */}
          <div className="shrink-0 hidden md:block">
            <div className="relative p-6 rounded-3xl bg-[#060b1c] border-2 border-cyan-400/40 shadow-[0_0_35px_rgba(6,182,212,0.3)] flex flex-col items-center">
              <LogoIcon width={100} height={100} animate={true} />
              <div className="mt-2 text-center">
                <span className="text-cyan-100 font-medium text-lg block">Concept</span>
                <span className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  AI
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: High Priority Tasks & Active Concept Graph Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Urgent Daily Execution Queue */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-cyan-500/20 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-cyan-900/40">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <h3 className="font-bold text-base text-white">Critical Execution Queue</h3>
            </div>
            <button
              onClick={() => onNavigateTab('tasks')}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              View Matrix <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {urgentTasks.slice(0, 4).map((task) => (
              <div
                key={task.id}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-start justify-between gap-3 group"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <button
                    onClick={() => onToggleTaskComplete(task)}
                    className="mt-0.5 text-slate-400 hover:text-cyan-400 transition-colors shrink-0"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {task.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{task.description}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2">
                      <span className="text-cyan-400 font-medium">{task.category}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" /> {task.estimatedMinutes} min
                      </span>
                      <span>•</span>
                      <span className="font-mono text-slate-400">Due: {task.dueDate}</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border shrink-0 ${
                    task.priority === 'urgent'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}
                >
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Active Concept Spotlight */}
        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-cyan-900/40">
              <span className="text-xs uppercase font-mono text-cyan-400 tracking-wider flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5" /> Active Concept Map
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                {activeConcept?.category}
              </span>
            </div>

            <div className="mt-4">
              <h4 className="text-base font-extrabold text-white">{activeConcept?.title}</h4>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed line-clamp-3">
                {activeConcept?.description}
              </p>

              {/* Progress bar */}
              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Neural Completion</span>
                  <span className="font-mono text-cyan-400 font-bold">{activeConcept?.progress}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full"
                    style={{ width: `${activeConcept?.progress}%` }}
                  />
                </div>
              </div>

              {/* Node highlights */}
              <div className="mt-5 space-y-2">
                <label className="text-[11px] uppercase font-semibold text-slate-400 tracking-wider">
                  Key Synaptic Nodes
                </label>
                <div className="space-y-1.5">
                  {activeConcept?.nodes.slice(0, 3).map((node) => (
                    <div
                      key={node.id}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <span className="text-slate-200 truncate">{node.label}</span>
                      <span className="text-[10px] font-mono text-cyan-400">[{node.type}]</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('graph')}
            className="mt-6 w-full py-2.5 rounded-xl bg-cyan-950 border border-cyan-400/40 text-cyan-300 text-xs font-bold hover:bg-cyan-900/60 transition-all flex items-center justify-center gap-2"
          >
            Launch Neural Graph Canvas <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
