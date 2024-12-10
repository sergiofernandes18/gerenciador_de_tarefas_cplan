import { create } from 'zustand';
import { Task, FileAttachment } from '../types';
import {
  createTask,
  updateTask as updateFirebaseTask,
  deleteTask as deleteFirebaseTask,
  getTasks as getFirebaseTasks
} from '../services/firebase/tasks';

interface TaskState {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'attachments'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Omit<Task, 'attachments'>>) => Promise<void>;
  getTasksByPlanId: (planId: string) => Task[];
  addAttachment: (taskId: string, attachment: FileAttachment) => void;
  removeAttachment: (taskId: string, attachmentId: string) => void;
  fetchTasks: (actionPlanId: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  addTask: async (taskData) => {
    const task = await createTask({
      ...taskData,
      createdAt: new Date().toISOString(),
      attachments: [],
    });
    set((state) => ({ tasks: [...state.tasks, task] }));
  },
  updateTask: async (id, updates) => {
    await updateFirebaseTask(id, updates);
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      ),
    }));
  },
  getTasksByPlanId: (planId) => {
    return get().tasks.filter((task) => task.actionPlanId === planId);
  },
  addAttachment: (taskId, attachment) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? { ...task, attachments: [...task.attachments, attachment] }
          : task
      ),
    }));
  },
  removeAttachment: (taskId, attachmentId) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              attachments: task.attachments.filter((att) => att.id !== attachmentId),
            }
          : task
      ),
    }));
  },
  fetchTasks: async (actionPlanId) => {
    const tasks = await getFirebaseTasks(actionPlanId);
    set({ tasks });
  },
}));