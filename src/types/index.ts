export type Priority = 'urgent' | 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'blocked';
export type Category = 'Work' | 'Study' | 'Personal' | 'Research' | 'Health' | 'Tech';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  conceptId?: string;
  priority: Priority;
  category: Category;
  status: TaskStatus;
  dueDate: string; // YYYY-MM-DD or ISO
  estimatedMinutes: number;
  actualMinutes?: number;
  subtasks: Subtask[];
  tags: string[];
  aiGenerated?: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface ConceptNode {
  id: string;
  label: string;
  type: 'core' | 'milestone' | 'task';
  status?: TaskStatus;
  x: number;
  y: number;
  description?: string;
}

export interface ConceptEdge {
  from: string;
  to: string;
  label?: string;
}

export interface Concept {
  id: string;
  title: string;
  description: string;
  category: Category;
  color: string;
  progress: number;
  nodes: ConceptNode[];
  edges: ConceptEdge[];
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'reminder' | 'deadline' | 'achievement' | 'ai_insight';
  timestamp: string;
  read: boolean;
  taskId?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  streakDays: number;
  productivityScore: number;
  tasksCompleted: number;
  focusMinutesToday: number;
}
