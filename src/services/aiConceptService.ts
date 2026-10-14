import { GoogleGenAI } from '@google/genai';
import { Task, Priority, Category, Concept } from '../types';

interface ConceptDecompositionResult {
  conceptTitle: string;
  conceptDescription: string;
  category: Category;
  tasks: Array<{
    title: string;
    description: string;
    priority: Priority;
    estimatedMinutes: number;
    subtasks: string[];
    tags: string[];
  }>;
  neuralNodes: Array<{
    label: string;
    type: 'core' | 'milestone' | 'task';
    description?: string;
  }>;
}

export async function generateConceptBreakdown(
  prompt: string,
  targetCategory: Category = 'Work'
): Promise<ConceptDecompositionResult> {
  const apiKey = (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
                 (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) ||
                 '';

  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `You are Concept AI, an elite productivity architect and neural task decomposition engine. 
Break down the user's high-level goal, project, or study concept into an actionable, structured execution plan.
Return ONLY valid JSON matching this structure:
{
  "conceptTitle": "Concise concept name",
  "conceptDescription": "Clear 2-sentence summary of the concept strategy",
  "category": "${targetCategory}",
  "tasks": [
    {
      "title": "Action-oriented task title",
      "description": "Details on how to execute",
      "priority": "urgent" | "high" | "medium" | "low",
      "estimatedMinutes": 45,
      "subtasks": ["subtask 1", "subtask 2", "subtask 3"],
      "tags": ["tag1", "tag2"]
    }
  ],
  "neuralNodes": [
    { "label": "Core Foundation", "type": "core", "description": "Anchor milestone" },
    { "label": "Execution Track 1", "type": "milestone", "description": "Key milestone" },
    { "label": "Execution Track 2", "type": "milestone", "description": "Key milestone" },
    { "label": "Deliverable Node", "type": "task", "description": "Target outcome" }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text) as ConceptDecompositionResult;
        return parsed;
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to intelligent local engine:', err);
    }
  }

  // Intelligent local decomposition engine
  return generateIntelligentLocalBreakdown(prompt, targetCategory);
}

function generateIntelligentLocalBreakdown(prompt: string, category: Category): ConceptDecompositionResult {
  const cleanPrompt = prompt.trim();
  const lower = cleanPrompt.toLowerCase();

  // Custom heuristics based on prompt keywords
  if (lower.includes('exam') || lower.includes('study') || lower.includes('cert') || lower.includes('course') || lower.includes('learn')) {
    return {
      conceptTitle: cleanPrompt,
      conceptDescription: `Structured mastery sprint for "${cleanPrompt}" incorporating active recall, spaced repetition, and practice assessments.`,
      category: 'Study',
      tasks: [
        {
          title: `Audit Curriculum & Syllabus for ${cleanPrompt}`,
          description: 'Map high-yield topics, textbook chapters, and identify personal knowledge blindspots.',
          priority: 'urgent',
          estimatedMinutes: 45,
          subtasks: ['Skim core reference material', 'Highlight high-probability test areas', 'Construct topical cheat-sheet outline'],
          tags: ['Syllabus', 'Audit', 'ActiveRecall'],
        },
        {
          title: 'Deep Focus Block: Flashcards & Core Principles',
          description: 'Create 25 algorithmic/conceptual Anki flashcards for rapid spaced retrieval.',
          priority: 'high',
          estimatedMinutes: 60,
          subtasks: ['Write cloze deletion cards', 'Review 1st review cycle', 'Formulate mnemonics for tricky equations'],
          tags: ['SpacedRepetition', 'Memory', 'DeepWork'],
        },
        {
          title: 'Simulated Timed Practice Sprint',
          description: 'Complete one full-length exam simulation under strict time and distraction-free constraints.',
          priority: 'high',
          estimatedMinutes: 90,
          subtasks: ['Set 90 min timer', 'Solve without looking at notes', 'Mark mistakes with red-amber-green flags'],
          tags: ['Simulation', 'Assessment', 'Speed'],
        },
        {
          title: 'Post-Mortem Error Correction & Synthesis',
          description: 'Deep dive into every missed answer to understand root cognitive misconceptions.',
          priority: 'medium',
          estimatedMinutes: 45,
          subtasks: ['Document error log', 'Cross-reference textbook answers', 'Summarize key takeaways in 1-pager'],
          tags: ['Review', 'Synthesis'],
        },
      ],
      neuralNodes: [
        { label: 'Foundation & Principles', type: 'core', description: 'Core syllabus & theory' },
        { label: 'Active Recall Sprint', type: 'milestone', description: 'Card deck & retrieval' },
        { label: 'Practical Application', type: 'milestone', description: 'Simulated questions' },
        { label: 'Exam Readiness', type: 'task', description: 'Peak mastery validation' },
      ],
    };
  }

  if (lower.includes('launch') || lower.includes('app') || lower.includes('build') || lower.includes('code') || lower.includes('dev') || lower.includes('saas') || lower.includes('api')) {
    return {
      conceptTitle: cleanPrompt,
      conceptDescription: `End-to-end technical sprint for "${cleanPrompt}" covering architecture, MVP implementation, testing, and deployment.`,
      category: 'Tech',
      tasks: [
        {
          title: `Architect Core Schema & Entity Graph for ${cleanPrompt}`,
          description: 'Design database tables, indexes, API contracts, and state management flow.',
          priority: 'urgent',
          estimatedMinutes: 60,
          subtasks: ['Define TypeScript models & DTOs', 'Draft PostgreSQL migration script', 'Document REST/GraphQL routes'],
          tags: ['Architecture', 'Database', 'TechSpec'],
        },
        {
          title: 'Implement Core Feature Logic & Business Rules',
          description: 'Build modular controllers, service layers, and validation sanitizers.',
          priority: 'high',
          estimatedMinutes: 90,
          subtasks: ['Code primary CRUD operations', 'Write input schema validators', 'Integrate error handling middleware'],
          tags: ['Backend', 'Implementation'],
        },
        {
          title: 'Build Responsive Modern Cyber UI Interface',
          description: 'Craft polished, mobile-friendly interface with neon micro-interactions and dark mode.',
          priority: 'high',
          estimatedMinutes: 75,
          subtasks: ['Setup Tailwind layout and cards', 'Add responsive touch interactions', 'Connect state hooks with optimistic UI'],
          tags: ['Frontend', 'UI/UX', 'Tailwind'],
        },
        {
          title: 'Production Hardening, E2E Smoke Test & Deploy',
          description: 'Verify edge cases, security headers, token limits, and continuous deployment pipeline.',
          priority: 'medium',
          estimatedMinutes: 45,
          subtasks: ['Run automated lint and build checks', 'Test on mobile viewport', 'Deploy to production environment'],
          tags: ['DevOps', 'Deployment', 'QA'],
        },
      ],
      neuralNodes: [
        { label: 'System Architecture', type: 'core', description: 'Entity models & contracts' },
        { label: 'Core Service Pipeline', type: 'milestone', description: 'Business logic & APIs' },
        { label: 'Client Interface', type: 'milestone', description: 'Responsive frontend UI' },
        { label: 'Production Launch', type: 'task', description: 'Zero-downtime release' },
      ],
    };
  }

  // General high-yield productivity concept
  return {
    conceptTitle: cleanPrompt,
    conceptDescription: `Systematic decomposition of "${cleanPrompt}" into high-impact milestones, daily execution habits, and measurable output.`,
    category,
    tasks: [
      {
        title: `Define Key Deliverables & Success Metrics for ${cleanPrompt}`,
        description: 'Establish what "done" looks like with 3 quantifiable benchmark results.',
        priority: 'urgent',
        estimatedMinutes: 30,
        subtasks: ['List top 3 non-negotiable outcomes', 'Identify primary constraint/blocker', 'Set target completion deadline'],
        tags: ['Strategy', 'Planning'],
      },
      {
        title: 'Execute Initial High-Leverage Phase',
        description: 'Tackle the hardest 20% of effort that generates 80% of momentum.',
        priority: 'high',
        estimatedMinutes: 60,
        subtasks: ['Remove all phone & notification distractions', 'Work in uninterrupted 60-min sprint', 'Log initial milestone output'],
        tags: ['DeepWork', 'Execution'],
      },
      {
        title: 'Synthesize Feedback & Refine Iteration',
        description: 'Review early results against baseline standards and course-correct.',
        priority: 'medium',
        estimatedMinutes: 45,
        subtasks: ['Assess initial quality metric', 'Eliminate redundant sub-steps', 'Prepare final deliverable packaging'],
        tags: ['Optimization', 'Refinement'],
      },
    ],
    neuralNodes: [
      { label: 'Conceptual Vision', type: 'core', description: 'Strategic objective' },
      { label: 'Core Action Milestone', type: 'milestone', description: 'High leverage execution' },
      { label: 'Quality Verification', type: 'task', description: 'Output perfection' },
    ],
  };
}
