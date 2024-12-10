export type UserRole = 'admin' | 'manager' | 'user';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface FileAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  createdAt: string;
  createdBy: string;
}

export interface ActionPlan {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'cancelled';
  createdBy: string;
  createdAt: string;
  attachments: FileAttachment[];
}

export interface Task {
  id: string;
  actionPlanId: string;
  action: string;
  responsible: string;
  plannedStart: string;
  plannedEnd: string;
  newDeadline: string;
  actualEnd: string;
  progress: number;
  createdBy: string;
  createdAt: string;
  attachments: FileAttachment[];
}

export interface Comment {
  id: string;
  taskId: string;
  content: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string | null;
  updatedBy: string | null;
}

export interface CommentAction {
  type: 'create' | 'update' | 'delete';
  userId: string;
  timestamp: string;
}