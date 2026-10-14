import React, { useState, useEffect } from 'react';
import { initialTasks, initialConcepts, initialProfile, initialNotifications } from './data/initialData';
import { Task, Concept, UserProfile, NotificationItem, TaskStatus } from './types';
import { Header } from './components/Header';
import { Navigation, TabType } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { TaskManager } from './components/TaskManager';
import { ConceptGraphView } from './components/ConceptGraphView';
import { FocusTimer } from './components/FocusTimer';
import { AnalyticsView } from './components/AnalyticsView';
import { ArchitectureSpecView } from './components/ArchitectureSpecView';
import { AIConceptGeneratorModal } from './components/AIConceptGeneratorModal';
import { ConceptAILogo } from './components/ConceptAILogo';
import { Sparkles, Brain, CheckCircle2, Shield, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('concept_ai_tasks');
      return saved ? JSON.parse(saved) : initialTasks;
    } catch {
      return initialTasks;
    }
  });

  const [concepts, setConcepts] = useState<Concept[]>(() => {
    try {
      const saved = localStorage.getItem('concept_ai_concepts');
      return saved ? JSON.parse(saved) : initialConcepts;
    } catch {
      return initialConcepts;
    }
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('concept_ai_profile');
      return saved ? JSON.parse(saved) : initialProfile;
    } catch {
      return initialProfile;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('concept_ai_notifications');
      return saved ? JSON.parse(saved) : initialNotifications;
    } catch {
      return initialNotifications;
    }
  });

  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isAIDecomposeOpen, setIsAIDecomposeOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('concept_ai_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('concept_ai_concepts', JSON.stringify(concepts));
  }, [concepts]);

  useEffect(() => {
    localStorage.setItem('concept_ai_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('concept_ai_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Task Actions
  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: `tsk_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);

    // Add in-app notification
    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'Task Created',
      message: `"${newTask.title}" added with ${newTask.priority} priority.`,
      type: 'reminder',
      timestamp: 'Just now',
      read: false,
      taskId: newTask.id,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));

    // Update productivity score and user metrics on completion
    if (updatedTask.status === 'completed') {
      setProfile((prev) => ({
        ...prev,
        tasksCompleted: prev.tasksCompleted + 1,
        productivityScore: Math.min(100, prev.productivityScore + 1),
      }));
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleToggleTaskComplete = (task: Task) => {
    const isNowCompleted = task.status !== 'completed';
    const updated: Task = {
      ...task,
      status: isNowCompleted ? 'completed' : 'todo',
      completedAt: isNowCompleted ? new Date().toISOString() : undefined,
    };

    if (isNowCompleted) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00f2fe', '#38bdf8', '#2563eb', '#ffffff'],
      });
    }

    handleUpdateTask(updated);
  };

  // AI Concept Breakdown Apply
  const handleApplyConceptAndTasks = (newConcept: Concept, newTasks: Task[]) => {
    setConcepts((prev) => [newConcept, ...prev]);
    setTasks((prev) => [...newTasks, ...prev]);

    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'AI Concept Decomposed',
      message: `Decomposed "${newConcept.title}" into ${newTasks.length} high-leverage tasks & ${newConcept.nodes.length} neural nodes.`,
      type: 'ai_insight',
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);

    // Switch to graph view to visualize
    setActiveTab('graph');
  };

  const handleUpdateNodeStatus = (conceptId: string, nodeId: string, status: TaskStatus) => {
    setConcepts((prev) =>
      prev.map((c) => {
        if (c.id !== conceptId) return c;
        const updatedNodes = c.nodes.map((n) => (n.id === nodeId ? { ...n, status } : n));
        const completedCount = updatedNodes.filter((n) => n.status === 'completed').length;
        const progress = Math.round((completedCount / updatedNodes.length) * 100);
        return { ...c, nodes: updatedNodes, progress };
      })
    );
  };

  const handleLogFocusMinutes = (minutes: number) => {
    setProfile((prev) => ({
      ...prev,
      focusMinutesToday: prev.focusMinutesToday + minutes,
      productivityScore: Math.min(100, prev.productivityScore + 2),
    }));

    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'Deep Flow Session Completed 🎯',
      message: `Successfully logged ${minutes} minutes of distraction-free focus!`,
      type: 'achievement',
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
    <div className="min-h-screen bg-[#040816] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans'] selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Header */}
      <Header
        notifications={notifications}
        profile={profile}
        onOpenAIDecompose={() => setIsAIDecomposeOpen(true)}
        onMarkNotificationRead={handleMarkNotificationRead}
        onUpdateProfile={setProfile}
        onSelectSpecTab={() => setActiveTab('spec')}
      />

      {/* Primary Tab Navigation */}
      <Navigation
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        tasksCount={tasks.filter((t) => t.status !== 'completed').length}
      />

      {/* Main Dynamic View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            tasks={tasks}
            concepts={concepts}
            profile={profile}
            onOpenAIDecompose={() => setIsAIDecomposeOpen(true)}
            onStartFocus={() => setActiveTab('focus')}
            onNavigateTab={setActiveTab}
            onToggleTaskComplete={handleToggleTaskComplete}
          />
        )}

        {activeTab === 'tasks' && (
          <TaskManager
            tasks={tasks}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onOpenAIDecompose={() => setIsAIDecomposeOpen(true)}
          />
        )}

        {activeTab === 'graph' && (
          <ConceptGraphView
            concepts={concepts}
            onOpenAIDecompose={() => setIsAIDecomposeOpen(true)}
            onUpdateNodeStatus={handleUpdateNodeStatus}
          />
        )}

        {activeTab === 'focus' && (
          <FocusTimer
            tasks={tasks}
            onLogFocusMinutes={handleLogFocusMinutes}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            tasks={tasks}
            concepts={concepts}
            profile={profile}
          />
        )}

        {activeTab === 'spec' && <ArchitectureSpecView />}
      </main>

      {/* AI Concept Decomposition Modal */}
      <AIConceptGeneratorModal
        isOpen={isAIDecomposeOpen}
        onClose={() => setIsAIDecomposeOpen(false)}
        onApplyConceptAndTasks={handleApplyConceptAndTasks}
      />

      {/* Bottom Footer */}
      <footer className="border-t border-cyan-900/30 bg-[#02050e] py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ConceptAILogo size="sm" showText={true} animate={false} />
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Intelligent Productivity & Cognitive Workspace</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <button onClick={() => setActiveTab('spec')} className="hover:text-cyan-400 transition-colors">
              ERD & Schema
            </button>
            <span>•</span>
            <button onClick={() => setActiveTab('graph')} className="hover:text-cyan-400 transition-colors">
              Neural Graph
            </button>
            <span>•</span>
            <button onClick={() => setIsAIDecomposeOpen(true)} className="hover:text-cyan-400 transition-colors flex items-center gap-1 text-cyan-400 font-semibold">
              <Sparkles className="w-3 h-3" /> AI Assistant
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
