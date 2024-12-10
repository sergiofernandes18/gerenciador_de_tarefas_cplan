import { create } from 'zustand';
import { Comment } from '../types';
import {
  createComment,
  updateComment as updateFirebaseComment,
  deleteComment as deleteFirebaseComment,
  getCommentsByTask
} from '../services/firebase/comments';

interface CommentState {
  comments: Comment[];
  addComment: (comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'updatedBy'>) => Promise<void>;
  updateComment: (id: string, content: string, userId: string) => Promise<void>;
  deleteComment: (id: string) => Promise<void>;
  getCommentsByTaskId: (taskId: string) => Comment[];
  fetchComments: (taskId: string) => Promise<void>;
}

export const useCommentStore = create<CommentState>((set, get) => ({
  comments: [],
  addComment: async (commentData) => {
    const comment = await createComment({
      ...commentData,
      createdAt: new Date().toISOString(),
      updatedAt: null,
      updatedBy: null,
    });
    set((state) => ({ comments: [...state.comments, comment] }));
  },
  updateComment: async (id, content, userId) => {
    await updateFirebaseComment(id, content, userId);
    set((state) => ({
      comments: state.comments.map((comment) =>
        comment.id === id
          ? {
              ...comment,
              content,
              updatedAt: new Date().toISOString(),
              updatedBy: userId,
            }
          : comment
      ),
    }));
  },
  deleteComment: async (id) => {
    await deleteFirebaseComment(id);
    set((state) => ({
      comments: state.comments.filter((comment) => comment.id !== id),
    }));
  },
  getCommentsByTaskId: (taskId) => {
    return get().comments.filter((comment) => comment.taskId === taskId);
  },
  fetchComments: async (taskId) => {
    const comments = await getCommentsByTask(taskId);
    set({ comments });
  },
}));