import React, { useState } from 'react';
import { Task, Priority, Category, TaskStatus, Subtask } from '../types';
import { CheckCircle2, Circle, Clock, Tag, Plus, Filter, Sparkles, AlertCircle, ChevronDown, ChevronRight, Trash2, Calendar, CheckSquare, Grid3X3, List, Columns } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TaskManagerProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenAIDecompose: () => void;
}

export const TaskManager: React.FC<TaskManagerProps> = ({
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onOpenAIDecompose,
}) => {
  const [viewMode, setViewMode] = useState<'matrix' | 'board' | 'list'>('board');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  // Quick Task Input state
  const [quickTitle, setQuickTitle] = useState('');
  const [quickCategory, setQuickCategory] = useState<Category>('Work');
  const [quickPriority, setQuickPriority] = useState<Priority>('medium');

  const filteredTasks = tasks.filter((task) => {
    const matchesCategory = selectedCategory === 'all' || task.category === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesPriority && matchesSearch;
  });

  const handleToggleSubtask = (task: Task, subtaskId: string) => {
    const updatedSubtasks = task.subtasks.map((st) =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    const allDone = updatedSubtasks.length > 0 && updatedSubtasks.every((st) => st.completed);
    
    if (allDone && task.status !== 'completed') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#00f2fe', '#38bdf8', '#10b981'],
      });
    }

    onUpdateTask({
      ...task,
      subtasks: updatedSubtasks,
      status: allDone ? 'completed' : task.status,
    });
  };

  const handleStatusChange = (task: Task, newStatus: TaskStatus) => {
    if (newStatus === 'completed' && task.status !== 'completed') {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00f2fe', '#38bdf8', '#2563eb', '#ffffff'],
      });
    }

    onUpdateTask({
      ...task,
      status: newStatus,
      completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined,
    });
  };

  const handleCreateQuickTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    onAddTask({
      title: quickTitle.trim(),
      description: 'Quick capture task',
      category: quickCategory,
      priority: quickPriority,
      status: 'todo',
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      estimatedMinutes: 45,
      subtasks: [
        { id: `st_${Date.now()}_1`, title: 'Initial action item', completed: false },
      ],
      tags: [quickCategory],
    });

    setQuickTitle('');
  };

  const priorityColors = {
    urgent: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    high: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    medium: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    low: 'bg-slate-700/40 text-slate-300 border-slate-600',
  };

  return (
    <div className="space-y-6">
      {/* Quick Task Capture Bar */}
      <form
        onSubmit={handleCreateQuickTask}
        className="glass-panel p-3.5 rounded-2xl border border-cyan-500/25 flex flex-wrap sm:flex-nowrap items-center gap-3 shadow-[0_0_25px_rgba(6,182,212,0.12)]"
      >
        <div className="flex-1 min-w-[200px] flex items-center gap-2 px-3 py-2 bg-slate-900/80 rounded-xl border border-cyan-900/60 focus-within:border-cyan-400">
          <Plus className="w-4 h-4 text-cyan-400 shrink-0" />
          <input
            type="text"
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            placeholder="Quick capture a task or execution goal..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
          />
        </div>

        <select
          value={quickCategory}
          onChange={(e) => setQuickCategory(e.target.value as Category)}
          className="bg-slate-900 text-xs text-cyan-300 rounded-xl px-3 py-2.5 border border-cyan-900/60 focus:outline-none"
        >
          {['Work', 'Study', 'Personal', 'Research', 'Health', 'Tech'].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={quickPriority}
          onChange={(e) => setQuickPriority(e.target.value as Priority)}
          className="bg-slate-900 text-xs text-cyan-300 rounded-xl px-3 py-2.5 border border-cyan-900/60 focus:outline-none"
        >
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <button
          type="submit"
          disabled={!quickTitle.trim()}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:brightness-110 disabled:opacity-40 transition-all shrink-0"
        >
          Add Task
        </button>

        <button
          type="button"
          onClick={onOpenAIDecompose}
          className="px-3.5 py-2.5 rounded-xl bg-cyan-950 border border-cyan-400/40 text-cyan-300 font-semibold text-xs flex items-center gap-1.5 hover:bg-cyan-900/60 transition-all shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          AI Decompose
        </button>
      </form>

      {/* Filter & View Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-panel p-3.5 rounded-xl border border-cyan-900/40">
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Tabs */}
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedCategory === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Categories
          </button>
          {['Tech', 'Work', 'Study', 'Personal', 'Health'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* View Layout Mode Toggles */}
        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-cyan-900/60">
          <button
            onClick={() => setViewMode('board')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'board'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            Board
          </button>
          <button
            onClick={() => setViewMode('matrix')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'matrix'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Grid3X3 className="w-3.5 h-3.5" />
            Eisenhower Matrix
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'list'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            List
          </button>
        </div>
      </div>

      {/* VIEW 1: KANBAN BOARD VIEW */}
      {viewMode === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { id: 'todo', title: 'To Do', count: filteredTasks.filter((t) => t.status === 'todo').length, color: 'text-slate-300' },
            { id: 'in_progress', title: 'In Progress', count: filteredTasks.filter((t) => t.status === 'in_progress').length, color: 'text-cyan-400' },
            { id: 'completed', title: 'Completed', count: filteredTasks.filter((t) => t.status === 'completed').length, color: 'text-emerald-400' },
          ].map((col) => {
            const columnTasks = filteredTasks.filter((t) => t.status === col.id);
            return (
              <div key={col.id} className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-cyan-900/40 px-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${col.color}`}>{col.title}</span>
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-[11px] font-mono font-bold flex items-center justify-center text-slate-300">
                      {col.count}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 min-h-[300px]">
                  {columnTasks.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                      No tasks in this lane
                    </div>
                  ) : (
                    columnTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        isExpanded={expandedTaskId === task.id}
                        onToggleExpand={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                        onToggleSubtask={(subId) => handleToggleSubtask(task, subId)}
                        onStatusChange={(status) => handleStatusChange(task, status)}
                        onDelete={() => onDeleteTask(task.id)}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: EISENHOWER PRIORITY MATRIX */}
      {viewMode === 'matrix' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Quadrant 1: Urgent & High Impact */}
          <div className="glass-panel p-5 rounded-2xl border border-rose-500/30 space-y-3">
            <div className="flex items-center justify-between border-b border-rose-500/20 pb-2">
              <div>
                <h4 className="text-sm font-black text-rose-300 uppercase tracking-wide">
                  Q1: Urgent & Critical
                </h4>
                <p className="text-[11px] text-slate-400">Execute immediately in deep work blocks</p>
              </div>
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-rose-500/20 text-rose-300">
                {filteredTasks.filter((t) => t.priority === 'urgent').length} tasks
              </span>
            </div>
            <div className="space-y-2.5">
              {filteredTasks
                .filter((t) => t.priority === 'urgent')
                .map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    compact
                    isExpanded={expandedTaskId === task.id}
                    onToggleExpand={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                    onToggleSubtask={(subId) => handleToggleSubtask(task, subId)}
                    onStatusChange={(status) => handleStatusChange(task, status)}
                    onDelete={() => onDeleteTask(task.id)}
                  />
                ))}
            </div>
          </div>

          {/* Quadrant 2: High Leverage / Strategic */}
          <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
              <div>
                <h4 className="text-sm font-black text-amber-300 uppercase tracking-wide">
                  Q2: High Leverage & Strategic
                </h4>
                <p className="text-[11px] text-slate-400">Schedule & master for long-term compound growth</p>
              </div>
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-500/20 text-amber-300">
                {filteredTasks.filter((t) => t.priority === 'high').length} tasks
              </span>
            </div>
            <div className="space-y-2.5">
              {filteredTasks
                .filter((t) => t.priority === 'high')
                .map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    compact
                    isExpanded={expandedTaskId === task.id}
                    onToggleExpand={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                    onToggleSubtask={(subId) => handleToggleSubtask(task, subId)}
                    onStatusChange={(status) => handleStatusChange(task, status)}
                    onDelete={() => onDeleteTask(task.id)}
                  />
                ))}
            </div>
          </div>

          {/* Quadrant 3: Medium Priority / Operations */}
          <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
              <div>
                <h4 className="text-sm font-black text-cyan-300 uppercase tracking-wide">
                  Q3: Medium / Daily Operations
                </h4>
                <p className="text-[11px] text-slate-400">Batch process in afternoon rhythm</p>
              </div>
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300">
                {filteredTasks.filter((t) => t.priority === 'medium').length} tasks
              </span>
            </div>
            <div className="space-y-2.5">
              {filteredTasks
                .filter((t) => t.priority === 'medium')
                .map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    compact
                    isExpanded={expandedTaskId === task.id}
                    onToggleExpand={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                    onToggleSubtask={(subId) => handleToggleSubtask(task, subId)}
                    onStatusChange={(status) => handleStatusChange(task, status)}
                    onDelete={() => onDeleteTask(task.id)}
                  />
                ))}
            </div>
          </div>

          {/* Quadrant 4: Low Priority / Backlog */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-700/50 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-700/50 pb-2">
              <div>
                <h4 className="text-sm font-black text-slate-300 uppercase tracking-wide">
                  Q4: Low / Backlog & Exploration
                </h4>
                <p className="text-[11px] text-slate-400">Exploratory research and optional tasks</p>
              </div>
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-800 text-slate-400">
                {filteredTasks.filter((t) => t.priority === 'low').length} tasks
              </span>
            </div>
            <div className="space-y-2.5">
              {filteredTasks
                .filter((t) => t.priority === 'low')
                .map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    compact
                    isExpanded={expandedTaskId === task.id}
                    onToggleExpand={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                    onToggleSubtask={(subId) => handleToggleSubtask(task, subId)}
                    onStatusChange={(status) => handleStatusChange(task, status)}
                    onDelete={() => onDeleteTask(task.id)}
                  />
                ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: CLEAN LIST VIEW */}
      {viewMode === 'list' && (
        <div className="glass-panel rounded-2xl border border-cyan-500/20 divide-y divide-slate-800/80 overflow-hidden">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              listView
              isExpanded={expandedTaskId === task.id}
              onToggleExpand={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
              onToggleSubtask={(subId) => handleToggleSubtask(task, subId)}
              onStatusChange={(status) => handleStatusChange(task, status)}
              onDelete={() => onDeleteTask(task.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Reusable Task Card Component
interface TaskCardProps {
  task: Task;
  compact?: boolean;
  listView?: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onToggleSubtask: (subtaskId: string) => void;
  onStatusChange: (status: TaskStatus) => void;
  onDelete: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  compact = false,
  listView = false,
  isExpanded,
  onToggleExpand,
  onToggleSubtask,
  onStatusChange,
  onDelete,
}) => {
  const isDone = task.status === 'completed';
  const completedSubtasksCount = task.subtasks.filter((st) => st.completed).length;

  const priorityBadge = {
    urgent: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    high: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    medium: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    low: 'bg-slate-700/40 text-slate-300 border-slate-600',
  }[task.priority];

  if (listView) {
    return (
      <div className="p-4 hover:bg-cyan-500/5 transition-colors">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => onStatusChange(isDone ? 'todo' : 'completed')}
              className="text-slate-400 hover:text-cyan-400 transition-colors shrink-0"
            >
              {isDone ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <Circle className="w-5 h-5" />
              )}
            </button>
            <div className="min-w-0">
              <span className={`text-sm font-semibold truncate block ${isDone ? 'line-through text-slate-500' : 'text-white'}`}>
                {task.title}
              </span>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                <span className="font-medium text-cyan-400">{task.category}</span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {task.estimatedMinutes}m
                </span>
                <span>•</span>
                <span className="font-mono text-[11px]">Due: {task.dueDate}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${priorityBadge}`}>
              {task.priority}
            </span>
            <button
              onClick={onToggleExpand}
              className="p-1.5 text-slate-400 hover:text-cyan-300 transition-colors"
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
              title="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expanded subtask view */}
        {isExpanded && (
          <div className="mt-3 pl-8 pr-2 pt-3 border-t border-slate-800 space-y-2">
            <p className="text-xs text-slate-300 mb-2">{task.description}</p>
            <div className="space-y-1.5">
              {task.subtasks.map((st) => (
                <label key={st.id} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={st.completed}
                    onChange={() => onToggleSubtask(st.id)}
                    className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                  />
                  <span className={st.completed ? 'line-through text-slate-500' : ''}>{st.title}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`glass-panel p-4 rounded-xl border transition-all duration-200 ${
        isDone
          ? 'border-emerald-500/30 opacity-75'
          : 'border-cyan-500/20 hover:border-cyan-400/40 shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <button
            onClick={() => onStatusChange(isDone ? 'todo' : 'completed')}
            className="mt-0.5 text-slate-400 hover:text-cyan-400 transition-colors shrink-0"
          >
            {isDone ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <Circle className="w-4 h-4" />
            )}
          </button>
          <div className="min-w-0">
            <h5
              onClick={onToggleExpand}
              className={`text-xs font-bold leading-snug cursor-pointer ${
                isDone ? 'line-through text-slate-500' : 'text-slate-100 hover:text-cyan-300'
              }`}
            >
              {task.title}
            </h5>
            {!compact && (
              <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                {task.description}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={onDelete}
          className="text-slate-500 hover:text-rose-400 p-1 shrink-0"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Meta tags and priority badge */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${priorityBadge}`}>
            {task.priority}
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-900 border border-slate-800 text-cyan-400">
            {task.category}
          </span>
          {task.aiGenerated && (
            <span className="flex items-center gap-0.5 text-[9px] font-mono text-cyan-400 bg-cyan-950/70 border border-cyan-500/30 px-1.5 py-0.5 rounded">
              <Sparkles className="w-2.5 h-2.5" /> AI
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px]">
          <span className="flex items-center gap-0.5 text-slate-400">
            <Clock className="w-3 h-3 text-slate-500" />
            {task.estimatedMinutes}m
          </span>
        </div>
      </div>

      {/* Subtasks Progress or Checklist */}
      {task.subtasks.length > 0 && (
        <div className="mt-2.5 pt-2 border-t border-slate-800/60">
          <button
            onClick={onToggleExpand}
            className="w-full flex items-center justify-between text-[11px] text-slate-400 hover:text-cyan-300"
          >
            <span className="flex items-center gap-1">
              <CheckSquare className="w-3 h-3 text-cyan-400" />
              Checklist ({completedSubtasksCount}/{task.subtasks.length})
            </span>
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {isExpanded && (
            <div className="mt-2 space-y-1.5 pl-1">
              {task.subtasks.map((st) => (
                <label
                  key={st.id}
                  className="flex items-center gap-2 text-[11px] text-slate-300 cursor-pointer hover:text-white"
                >
                  <input
                    type="checkbox"
                    checked={st.completed}
                    onChange={() => onToggleSubtask(st.id)}
                    className="rounded border-slate-700 text-cyan-500 focus:ring-0 w-3 h-3"
                  />
                  <span className={st.completed ? 'line-through text-slate-500' : ''}>
                    {st.title}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
