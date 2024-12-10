import React, { useState } from 'react';
import { useCommentStore } from '../store/commentStore';
import { useTaskStore } from '../store/taskStore';
import { useFileStore } from '../store/fileStore';
import { useAuthStore } from '../store/authStore';
import { Task, Comment } from '../types';
import { format } from 'date-fns';
import { X, Edit2, Trash2 } from 'lucide-react';
import { FileUploader } from './FileUploader';

interface TaskCommentModalProps {
  task: Task;
  onClose: () => void;
}

export function TaskCommentModal({ task, onClose }: TaskCommentModalProps) {
  const { user } = useAuthStore();
  const { uploadFile, deleteFile } = useFileStore();
  const { addAttachment, removeAttachment } = useTaskStore();
  const { comments, addComment, updateComment, deleteComment, getCommentsByTaskId } = useCommentStore();
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const taskComments = getCommentsByTaskId(task.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    addComment({
      taskId: task.id,
      content: newComment.trim(),
      createdBy: user.id,
    });

    setNewComment('');
  };

  const handleEdit = (comment: Comment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
  };

  const handleUpdate = (commentId: string) => {
    if (!user || !editContent.trim()) return;
    updateComment(commentId, editContent.trim(), user.id);
    setEditingComment(null);
    setEditContent('');
  };

  const handleDelete = (commentId: string) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      deleteComment(commentId);
    }
  };

  const handleFileUpload = async (files: FileList) => {
    if (!user) return;

    for (const file of Array.from(files)) {
      const attachment = await uploadFile(file, user.id);
      addAttachment(task.id, attachment);
    }
  };

  const handleFileDelete = async (fileId: string) => {
    await deleteFile(fileId);
    removeAttachment(task.id, fileId);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Task Details: {task.action}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Attachments</h3>
            <FileUploader
              attachments={task.attachments}
              onUpload={handleFileUpload}
              onDelete={handleFileDelete}
            />
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-3">Comments</h3>
            <div className="space-y-4">
              {taskComments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                  {editingComment === comment.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(comment.id)}
                          className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingComment(null)}
                          className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-gray-900">{comment.content}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Created on {format(new Date(comment.createdAt), 'dd/MM/yyyy HH:mm')}
                            {comment.updatedAt && (
                              <> (Edited on {format(new Date(comment.updatedAt), 'dd/MM/yyyy HH:mm')})</>
                            )}
                          </p>
                        </div>
                        {user?.id === comment.createdBy && (
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => handleEdit(comment)}
                              className="text-blue-500 hover:text-blue-600"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(comment.id)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-2 border rounded-md"
            rows={3}
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300"
          >
            Add Comment
          </button>
        </form>
      </div>
    </div>
  );
}