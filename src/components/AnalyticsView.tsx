import React from 'react';
import { Task, Concept, UserProfile } from '../types';
import { TrendingUp, Award, Flame, CheckCircle2, Clock, Calendar, PieChart, Activity, Zap, Sparkles } from 'lucide-react';

interface AnalyticsViewProps {
  tasks: Task[];
  concepts: Concept[];
  profile: UserProfile;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ tasks, concepts, profile }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
  const todoTasks = tasks.filter((t) => t.status === 'todo').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Category distribution
  const categories = ['Tech', 'Work', 'Study', 'Personal', 'Health', 'Research'];
  const categoryCounts = categories.map((cat) => ({
    name: cat,
    count: tasks.filter((t) => t.category === cat).length,
  }));

  // Heatmap generation (last 28 days mock activity grid)
  const heatmapDays = Array.from({ length: 28 }).map((_, i) => {
    const day = 28 - i;
    const intensity = (i * 7 + 3) % 5; // 0 to 4
    return { day, intensity };
  });

  return (
    <div className="space-y-6">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Productivity Score */}
        <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Productivity Index
            </span>
            <span className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/30 text-cyan-400">
              <Zap className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-white font-mono drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
              {profile.productivityScore}
            </span>
            <span className="text-xs font-semibold text-cyan-400">/ 100 PTS</span>
          </div>
          <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full"
              style={{ width: `${profile.productivityScore}%` }}
            />
          </div>
        </div>

        {/* Completion Rate */}
        <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Execution Velocity
            </span>
            <span className="p-2 rounded-xl bg-emerald-950 border border-emerald-500/30 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-white font-mono">
              {completionRate}%
            </span>
            <span className="text-xs font-semibold text-emerald-400">
              {completedTasks}/{totalTasks} done
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* Active Streak */}
        <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Daily Streak
            </span>
            <span className="p-2 rounded-xl bg-amber-950 border border-amber-500/30 text-amber-400">
              <Flame className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-white font-mono">
              {profile.streakDays}
            </span>
            <span className="text-xs font-semibold text-amber-400">DAYS HOT 🔥</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Keep crushing daily tasks to hit 30-day mastery badge.
          </p>
        </div>

        {/* Deep Focus Time */}
        <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Focus Time Today
            </span>
            <span className="p-2 rounded-xl bg-blue-950 border border-blue-500/30 text-blue-400">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-white font-mono">
              {profile.focusMinutesToday}
            </span>
            <span className="text-xs font-semibold text-blue-400">MINUTES</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Equivalent to 5.4 Pomodoro cycles of deep flow.
          </p>
        </div>
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Heatmap & Activity */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-cyan-500/20 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                28-Day Neuro-Productivity Heatmap
              </h3>
              <p className="text-xs text-slate-400">Consistent task execution across cognitive cycles</p>
            </div>
            <span className="text-xs font-mono text-cyan-400">48 Completed</span>
          </div>

          {/* Grid visual */}
          <div className="grid grid-cols-7 gap-2 pt-2">
            {heatmapDays.map((h, idx) => {
              const bgClass =
                h.intensity === 4
                  ? 'bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.6)]'
                  : h.intensity === 3
                  ? 'bg-cyan-500/80'
                  : h.intensity === 2
                  ? 'bg-cyan-600/50'
                  : h.intensity === 1
                  ? 'bg-cyan-900/40'
                  : 'bg-slate-800/40';

              return (
                <div
                  key={idx}
                  title={`Day ${h.day}: Intensity level ${h.intensity}`}
                  className={`h-9 rounded-lg ${bgClass} border border-cyan-500/10 flex items-center justify-center text-[10px] font-mono text-slate-300 font-semibold transition-transform hover:scale-105 cursor-pointer`}
                >
                  {h.day}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            <span>Mon • Wed • Fri rhythm peak</span>
            <div className="flex items-center gap-1.5">
              <span>Less</span>
              <div className="w-3 h-3 rounded bg-slate-800" />
              <div className="w-3 h-3 rounded bg-cyan-900/50" />
              <div className="w-3 h-3 rounded bg-cyan-600/60" />
              <div className="w-3 h-3 rounded bg-cyan-400" />
              <span>More</span>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-cyan-400" />
              Domain Allocation
            </h3>
            <span className="text-xs text-slate-400">{categories.length} Categories</span>
          </div>

          <div className="space-y-3">
            {categoryCounts.map((cat) => {
              const pct = totalTasks > 0 ? Math.round((cat.count / totalTasks) * 100) : 0;
              return (
                <div key={cat.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{cat.name}</span>
                    <span className="font-mono text-cyan-400">{cat.count} tasks ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-cyan-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
