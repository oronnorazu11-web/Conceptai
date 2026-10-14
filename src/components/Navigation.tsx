import React from 'react';
import { LayoutDashboard, CheckSquare, Brain, Clock, BarChart3, Layers, Sparkles } from 'lucide-react';

export type TabType = 'dashboard' | 'tasks' | 'graph' | 'focus' | 'analytics' | 'spec';

interface NavigationProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  tasksCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onChangeTab,
  tasksCount,
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Cockpit', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tasks & Matrix', icon: CheckSquare, badge: tasksCount },
    { id: 'graph', label: 'Concept Graph', icon: Brain },
    { id: 'focus', label: 'Focus Sprint', icon: Clock },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'spec', label: 'Architecture & ERD', icon: Layers, highlight: true },
  ];

  return (
    <div className="w-full border-b border-cyan-900/30 bg-[#050a18]/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-3 overflow-x-auto py-2.5 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onChangeTab(tab.id as TabType)}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                    : tab.highlight
                    ? 'text-cyan-400/90 hover:text-cyan-200 hover:bg-cyan-950/40 border border-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                      isActive ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
                {tab.highlight && !isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
