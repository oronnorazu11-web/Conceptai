import React, { useState } from 'react';
import { Database, Layers, GitBranch, Code, CheckCircle2, Copy, Check, Shield, Server, Cpu, Smartphone, Globe, Sparkles } from 'lucide-react';
import { ConceptAILogo } from './ConceptAILogo';

export const ArchitectureSpecView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'erd' | 'architecture' | 'roadmap' | 'snippets'>('erd');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const schemaTables = [
    {
      name: 'users',
      description: 'Core authenticated user profile and productivity metrics',
      fields: [
        { name: 'id', type: 'UUID', key: 'PK', desc: 'Unique user identifier' },
        { name: 'email', type: 'VARCHAR(255)', key: 'UNIQUE', desc: 'Verified email address' },
        { name: 'name', type: 'VARCHAR(128)', key: '', desc: 'Full display name' },
        { name: 'avatar_url', type: 'TEXT', key: '', desc: 'Profile photo URL' },
        { name: 'role', type: 'VARCHAR(32)', key: '', desc: 'e.g. Student, Engineer, Pro' },
        { name: 'streak_days', type: 'INTEGER', key: '', desc: 'Continuous active day count' },
        { name: 'productivity_score', type: 'INTEGER', key: '', desc: 'Calculated 0-100 index' },
        { name: 'created_at', type: 'TIMESTAMPTZ', key: '', desc: 'Account registration time' },
        { name: 'updated_at', type: 'TIMESTAMPTZ', key: '', desc: 'Last record modification' },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_users_email ON users(email);'],
    },
    {
      name: 'concepts',
      description: 'High-level goals, master projects, or academic subjects to be decomposed',
      fields: [
        { name: 'id', type: 'UUID', key: 'PK', desc: 'Concept identifier' },
        { name: 'user_id', type: 'UUID', key: 'FK -> users.id', desc: 'Owner reference' },
        { name: 'title', type: 'VARCHAR(255)', key: '', desc: 'Core concept/project title' },
        { name: 'description', type: 'TEXT', key: '', desc: 'Detailed conceptual background' },
        { name: 'category', type: 'VARCHAR(40)', key: '', desc: 'Work, Study, Personal, Health, Tech' },
        { name: 'color', type: 'VARCHAR(16)', key: '', desc: 'Hex theme color code' },
        { name: 'progress', type: 'NUMERIC(5,2)', key: '', desc: 'Percentage of completed nodes/tasks' },
        { name: 'created_at', type: 'TIMESTAMPTZ', key: '', desc: 'Creation timestamp' },
      ],
      indexes: [
        'CREATE INDEX idx_concepts_user ON concepts(user_id);',
        'CREATE INDEX idx_concepts_category ON concepts(category);',
      ],
    },
    {
      name: 'tasks',
      description: 'Actionable granular units of work with Eisenhower prioritization',
      fields: [
        { name: 'id', type: 'UUID', key: 'PK', desc: 'Task identifier' },
        { name: 'concept_id', type: 'UUID', key: 'FK -> concepts.id', desc: 'Optional parent concept' },
        { name: 'user_id', type: 'UUID', key: 'FK -> users.id', desc: 'Assignee / Creator' },
        { name: 'title', type: 'VARCHAR(255)', key: '', desc: 'Action-oriented task headline' },
        { name: 'description', type: 'TEXT', key: '', desc: 'Execution guidelines' },
        { name: 'priority', type: 'ENUM', key: '', desc: "'urgent' | 'high' | 'medium' | 'low'" },
        { name: 'category', type: 'VARCHAR(40)', key: '', desc: 'Taxonomy grouping' },
        { name: 'status', type: 'ENUM', key: '', desc: "'todo' | 'in_progress' | 'completed' | 'blocked'" },
        { name: 'due_date', type: 'DATE', key: '', desc: 'Target deadline' },
        { name: 'estimated_mins', type: 'INTEGER', key: '', desc: 'Estimated focus effort' },
        { name: 'actual_mins', type: 'INTEGER', key: '', desc: 'Tracked time logged' },
        { name: 'ai_generated', type: 'BOOLEAN', key: '', desc: 'Flag if produced by Concept AI' },
        { name: 'created_at', type: 'TIMESTAMPTZ', key: '', desc: 'Creation time' },
        { name: 'completed_at', type: 'TIMESTAMPTZ', key: '', desc: 'Completion time' },
      ],
      indexes: [
        'CREATE INDEX idx_tasks_user_status ON tasks(user_id, status);',
        'CREATE INDEX idx_tasks_due_date ON tasks(due_date);',
        'CREATE INDEX idx_tasks_concept ON tasks(concept_id);',
      ],
    },
    {
      name: 'subtasks',
      description: 'Micro-checklist items nested under parent tasks',
      fields: [
        { name: 'id', type: 'UUID', key: 'PK', desc: 'Subtask identifier' },
        { name: 'task_id', type: 'UUID', key: 'FK -> tasks.id', desc: 'Parent task link (CASCADE delete)' },
        { name: 'title', type: 'VARCHAR(255)', key: '', desc: 'Checklist step' },
        { name: 'completed', type: 'BOOLEAN', key: '', desc: 'Toggle status' },
        { name: 'sort_order', type: 'INTEGER', key: '', desc: 'Sequence position' },
      ],
      indexes: ['CREATE INDEX idx_subtasks_task_id ON subtasks(task_id);'],
    },
    {
      name: 'concept_nodes & edges',
      description: 'Neural mind-map representation linking concepts to tasks and milestones',
      fields: [
        { name: 'id', type: 'UUID', key: 'PK', desc: 'Node identifier' },
        { name: 'concept_id', type: 'UUID', key: 'FK -> concepts.id', desc: 'Belonging concept canvas' },
        { name: 'label', type: 'VARCHAR(128)', key: '', desc: 'Displayed node label' },
        { name: 'node_type', type: 'ENUM', key: '', desc: "'core' | 'milestone' | 'task'" },
        { name: 'pos_x', type: 'INTEGER', key: '', desc: 'Canvas X coordinate' },
        { name: 'pos_y', type: 'INTEGER', key: '', desc: 'Canvas Y coordinate' },
        { name: 'task_id', type: 'UUID', key: 'FK -> tasks.id', desc: 'Nullable linked execution task' },
      ],
      indexes: ['CREATE INDEX idx_nodes_concept ON concept_nodes(concept_id);'],
    },
    {
      name: 'focus_sessions',
      description: 'Telemetry logs for Pomodoro and deep work cycles',
      fields: [
        { name: 'id', type: 'UUID', key: 'PK', desc: 'Session identifier' },
        { name: 'user_id', type: 'UUID', key: 'FK -> users.id', desc: 'User reference' },
        { name: 'task_id', type: 'UUID', key: 'FK -> tasks.id', desc: 'Optional associated task' },
        { name: 'duration_minutes', type: 'INTEGER', key: '', desc: 'Time spent in flow state' },
        { name: 'mode', type: 'VARCHAR(32)', key: '', desc: 'pomodoro, deep_work, sprint' },
        { name: 'completed', type: 'BOOLEAN', key: '', desc: 'Full cycle completed' },
        { name: 'logged_at', type: 'TIMESTAMPTZ', key: '', desc: 'Timestamp' },
      ],
      indexes: ['CREATE INDEX idx_focus_user_date ON focus_sessions(user_id, logged_at);'],
    },
  ];

  const postgresDDL = `-- Concept AI Core Schema Definition (PostgreSQL 16+)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enumerations
CREATE TYPE task_priority AS ENUM ('urgent', 'high', 'medium', 'low');
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'completed', 'blocked');
CREATE TYPE node_type AS ENUM ('core', 'milestone', 'task');

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(128) NOT NULL,
    avatar_url TEXT,
    role VARCHAR(32) DEFAULT 'Scholar / Builder',
    streak_days INT DEFAULT 0,
    productivity_score INT DEFAULT 85,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Concepts Table
CREATE TABLE concepts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(40) NOT NULL DEFAULT 'Work',
    color VARCHAR(16) DEFAULT '#06b6d4',
    progress NUMERIC(5,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Tasks Table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    concept_id UUID REFERENCES concepts(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority task_priority NOT NULL DEFAULT 'medium',
    category VARCHAR(40) NOT NULL DEFAULT 'Work',
    status task_status NOT NULL DEFAULT 'todo',
    due_date DATE NOT NULL,
    estimated_mins INT DEFAULT 45,
    actual_mins INT DEFAULT 0,
    ai_generated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMPTZ
);

-- Subtasks Table
CREATE TABLE subtasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0
);

-- Indexes for lightning fast queries
CREATE INDEX idx_tasks_user_status ON tasks(user_id, status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_concepts_user ON concepts(user_id);
`;

  const nodeExpressSnippet = `// controllers/conceptController.ts
import { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { db } from '../db';
import { concepts, tasks, subtasks } from '../db/schema';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function decomposeConcept(req: Request, res: Response) {
  const { goalPrompt, category = 'Work', userId } = req.body;

  try {
    const systemPrompt = \`Decompose this goal into a high-priority task tree: \${goalPrompt}. Output JSON with title, description, tasks [title, priority, estMinutes, subtasks[]].\`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: systemPrompt,
      config: { responseMimeType: 'application/json' }
    });

    const parsed = JSON.parse(response.text!);

    // Transactional save to PostgreSQL
    const result = await db.transaction(async (tx) => {
      const [newConcept] = await tx.insert(concepts).values({
        userId,
        title: parsed.conceptTitle || goalPrompt,
        description: parsed.conceptDescription,
        category,
      }).returning();

      for (const t of parsed.tasks) {
        const [newTask] = await tx.insert(tasks).values({
          userId,
          conceptId: newConcept.id,
          title: t.title,
          description: t.description,
          priority: t.priority || 'medium',
          category,
          dueDate: new Date(Date.now() + 86400000 * 3),
          estimatedMins: t.estimatedMinutes || 45,
          aiGenerated: true,
        }).returning();

        if (t.subtasks?.length) {
          await tx.insert(subtasks).values(
            t.subtasks.map((st: string, idx: number) => ({
              taskId: newTask.id,
              title: st,
              sortOrder: idx,
            }))
          );
        }
      }
      return newConcept;
    });

    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
}
`;

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl glass-panel p-6 sm:p-8 border border-cyan-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-400/30 text-cyan-300 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Technical Architecture Blueprint
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Concept AI System Design & Entity Model
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Comprehensive architectural blueprint, relational entity-relationship schema, cross-platform
              data contracts, and 6-phase engineering roadmap designed for ultra-low latency mobile & web scale.
            </p>
          </div>

          <div className="hidden lg:block shrink-0">
            <ConceptAILogo size="badge" showText={false} className="p-4 rounded-2xl scale-75 origin-top-right" />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-cyan-900/40 pb-3">
          <button
            onClick={() => setActiveTab('erd')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'erd'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Database className="w-4 h-4 text-cyan-400" />
            1. Entity Relationship Model (ERD)
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'architecture'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-4 h-4 text-cyan-400" />
            2. System Architecture
          </button>

          <button
            onClick={() => setActiveTab('roadmap')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'roadmap'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <GitBranch className="w-4 h-4 text-cyan-400" />
            3. Development Roadmap
          </button>

          <button
            onClick={() => setActiveTab('snippets')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'snippets'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Code className="w-4 h-4 text-cyan-400" />
            4. Production Code Snippets
          </button>
        </div>
      </div>

      {/* TAB 1: ERD & DATABASE SCHEMA */}
      {activeTab === 'erd' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-cyan-400" />
                Relational Entity Relationship Schema (PostgreSQL / Firestore)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Optimized 3rd Normal Form schema with foreign key cascades, compound indexes for fast status filtering, and sub-10ms response times.
              </p>
            </div>
            <button
              onClick={() => handleCopy('ddl', postgresDDL)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-cyan-950 border border-cyan-400/40 text-cyan-300 text-xs font-semibold hover:bg-cyan-900/60 transition-all self-start sm:self-auto"
            >
              {copiedKey === 'ddl' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              {copiedKey === 'ddl' ? 'Copied DDL!' : 'Copy PostgreSQL DDL'}
            </button>
          </div>

          {/* Schema Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {schemaTables.map((table) => (
              <div
                key={table.name}
                className="rounded-xl glass-panel border border-cyan-500/20 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="px-4 py-3 bg-gradient-to-r from-cyan-950/80 to-blue-950/60 border-b border-cyan-900/40 flex items-center justify-between">
                    <span className="font-mono text-cyan-300 font-bold text-sm tracking-wide">
                      {table.name}
                    </span>
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      Table
                    </span>
                  </div>
                  <div className="p-3 text-[11px] text-slate-400 border-b border-slate-800/80 bg-slate-950/30">
                    {table.description}
                  </div>

                  {/* Fields list */}
                  <div className="divide-y divide-slate-800/60 text-xs">
                    {table.fields.map((f) => (
                      <div key={f.name} className="px-3.5 py-2 flex items-center justify-between gap-2 hover:bg-cyan-500/5 transition-colors">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-mono text-slate-200 font-medium truncate">{f.name}</span>
                          {f.key && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              {f.key}
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-[11px] text-cyan-400/90 shrink-0">{f.type}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Indexes footer */}
                <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
                  <span className="text-cyan-400 font-semibold">Indexed:</span> {table.indexes.join(' ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: SYSTEM ARCHITECTURE */}
      {activeTab === 'architecture' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              End-to-End System Architecture
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Multi-tiered microservice-ready topology with edge CDN caching, client offline-first local storage, and AI reasoning agent workers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Tier 1: Client */}
            <div className="p-5 rounded-xl glass-panel border border-cyan-500/20 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-cyan-950 border border-cyan-400/30 flex items-center justify-center text-cyan-400 mb-3">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white text-sm mb-1">1. Presentation Tier</h4>
                <p className="text-xs text-slate-400 mb-3">Cross-platform Web & Mobile Clients</p>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>React 19 + Tailwind CSS v4</li>
                  <li>Flutter / React Native wrapper</li>
                  <li>PWA offline service worker cache</li>
                  <li>Optimistic UI with local-first sync</li>
                  <li>Neural Mind-Map SVG/Canvas engine</li>
                </ul>
              </div>
              <div className="mt-4 pt-3 border-t border-cyan-900/40 text-[11px] text-cyan-400 font-mono">
                Protocol: HTTPS / WSS
              </div>
            </div>

            {/* Tier 2: Gateway */}
            <div className="p-5 rounded-xl glass-panel border border-cyan-500/20 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-blue-950 border border-blue-400/30 flex items-center justify-center text-blue-400 mb-3">
                  <Globe className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white text-sm mb-1">2. Gateway & Auth</h4>
                <p className="text-xs text-slate-400 mb-3">API Routing, Auth & Rate Limiting</p>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>Express / Fastify Edge Gateway</li>
                  <li>Firebase Auth / Google OAuth 2.0</li>
                  <li>JWT Bearer token validation</li>
                  <li>Redis token bucket rate limiter</li>
                  <li>CORS & Security headers</li>
                </ul>
              </div>
              <div className="mt-4 pt-3 border-t border-cyan-900/40 text-[11px] text-blue-400 font-mono">
                Latency: &lt; 15ms
              </div>
            </div>

            {/* Tier 3: Core Engine */}
            <div className="p-5 rounded-xl glass-panel border border-cyan-500/20 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-indigo-950 border border-indigo-400/30 flex items-center justify-center text-indigo-400 mb-3">
                  <Server className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white text-sm mb-1">3. Core Services</h4>
                <p className="text-xs text-slate-400 mb-3">Business Logic & Real-time Sync</p>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>Task & Concept graph orchestration</li>
                  <li>WebSocket event dispatcher</li>
                  <li>Eisenhower priority engine</li>
                  <li>Focus telemetry aggregator</li>
                  <li>BullMQ background cron workers</li>
                </ul>
              </div>
              <div className="mt-4 pt-3 border-t border-cyan-900/40 text-[11px] text-indigo-400 font-mono">
                Cluster: Node.js / Docker
              </div>
            </div>

            {/* Tier 4: AI & Persistence */}
            <div className="p-5 rounded-xl glass-panel border border-cyan-500/20 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-purple-950 border border-purple-400/30 flex items-center justify-center text-purple-400 mb-3">
                  <Cpu className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white text-sm mb-1">4. AI Agent & Storage</h4>
                <p className="text-xs text-slate-400 mb-3">Intelligence & Persistent State</p>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>Gemini 2.5 Flash decomposition model</li>
                  <li>PostgreSQL 16 with pgvector</li>
                  <li>Firestore multi-device synchronization</li>
                  <li>Cloud Storage for attachments</li>
                  <li>Automated daily snapshot backups</li>
                </ul>
              </div>
              <div className="mt-4 pt-3 border-t border-cyan-900/40 text-[11px] text-purple-400 font-mono">
                Storage: ACID Compliant
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DEVELOPMENT ROADMAP */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-cyan-400" />
              Step-by-Step Development Roadmap
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Phased production trajectory from inception to global distribution.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                phase: 'Phase 1: Foundation & Identity',
                timeline: 'Week 1',
                badge: 'Complete in Applet',
                tasks: [
                  'Brand identity and vector logo matching Concept AI reference image.',
                  'Data contract definition (TypeScript types, ER diagrams, DDL scripts).',
                  'Client boilerplate with Tailwind CSS dark space theme and custom neon styling.',
                ],
              },
              {
                phase: 'Phase 2: Task Engine & Eisenhower Priority Matrix',
                timeline: 'Week 2',
                badge: 'Active & Interactive',
                tasks: [
                  'Full task CRUD with status transitions (Todo -> In Progress -> Completed).',
                  'Priority classifications (Urgent, High, Medium, Low) and category filtering.',
                  'Subtask checklist toggle with automatic progress calculation and confetti celebrations.',
                ],
              },
              {
                phase: 'Phase 3: AI Concept Decomposition & Neural Graph',
                timeline: 'Week 3-4',
                badge: 'Active & Interactive',
                tasks: [
                  'Gemini 2.5 Flash prompt orchestration for zero-shot goal decomposition.',
                  'Interactive Concept Mind-Map Canvas representing brain neural pathways.',
                  'Bidirectional conversion between concept nodes and actionable task tickets.',
                ],
              },
              {
                phase: 'Phase 4: Focus Timer & Deep Work Analytics',
                timeline: 'Week 5',
                badge: 'Active & Interactive',
                tasks: [
                  'Pomodoro and ultradian cycle timer with ambient sound generators.',
                  'Productivity score calculation algorithm based on completion velocity and focus minutes.',
                  'Interactive activity heatmap and category breakdown charts.',
                ],
              },
              {
                phase: 'Phase 5: Real-time Notifications & Mobile App Wrapper',
                timeline: 'Week 6-7',
                badge: 'Active & Interactive',
                tasks: [
                  'Notification center with alert sounds, due date badges, and AI strategic briefs.',
                  'Mobile responsiveness, bottom drawer navigation, touch gestures.',
                  'PWA manifest and Capacitor / React Native export configurations.',
                ],
              },
              {
                phase: 'Phase 6: Multi-Tenant Cloud & Vector Memory',
                timeline: 'Week 8+',
                badge: 'Production Target',
                tasks: [
                  'pgvector semantic search over all historical notes and tasks.',
                  'Team collaboration workspaces with real-time cursor presence.',
                  'Calendar two-way sync (Google Calendar, Outlook, Apple Calendar).',
                ],
              },
            ].map((p, idx) => (
              <div key={idx} className="p-5 rounded-xl glass-panel border border-cyan-500/20 hover:border-cyan-400/40 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h4 className="font-bold text-white text-base">{p.phase}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-mono">{p.timeline}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                      {p.badge}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                  {p.tasks.map((t, tidx) => (
                    <div key={tidx} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PRODUCTION CODE SNIPPETS */}
      {activeTab === 'snippets' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Code className="w-5 h-5 text-cyan-400" />
                Production-Ready Code Snippets
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Modular backend controllers, Gemini reasoning pipelines, and clean TypeScript service patterns.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Snippet 1 */}
            <div className="rounded-xl glass-panel border border-cyan-500/20 overflow-hidden flex flex-col">
              <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono font-semibold text-slate-200">schema.sql (PostgreSQL)</span>
                </div>
                <button
                  onClick={() => handleCopy('snip_sql', postgresDDL)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  {copiedKey === 'snip_sql' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy
                </button>
              </div>
              <pre className="p-4 text-xs font-mono text-cyan-300/90 bg-slate-950/90 overflow-x-auto max-h-96 leading-relaxed">
                {postgresDDL}
              </pre>
            </div>

            {/* Snippet 2 */}
            <div className="rounded-xl glass-panel border border-cyan-500/20 overflow-hidden flex flex-col">
              <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono font-semibold text-slate-200">conceptController.ts (Express + Gemini)</span>
                </div>
                <button
                  onClick={() => handleCopy('snip_controller', nodeExpressSnippet)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  {copiedKey === 'snip_controller' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy
                </button>
              </div>
              <pre className="p-4 text-xs font-mono text-sky-300/90 bg-slate-950/90 overflow-x-auto max-h-96 leading-relaxed">
                {nodeExpressSnippet}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
