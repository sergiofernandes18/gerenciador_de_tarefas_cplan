import React, { useState } from 'react';
import { useTaskStore } from '../store/taskStore';
import { useActionPlanStore } from '../store/actionPlanStore';
import { format } from 'date-fns';
import { MessageSquare } from 'lucide-react';
import { TaskCommentModal } from './TaskCommentModal';
import { Task } from '../types';

export function TaskList() {
  const { getTasksByPlanId } = useTaskStore();
  const { selectedPlanId } = useActionPlanStore();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  const tasks = selectedPlanId ? getTasksByPlanId(selectedPlanId) : [];

  if (!selectedPlanId) {
    return null;
  }

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-bold mb-4">Tasks</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsible</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Planned Start</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Planned End</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">New Deadline</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actual End</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comments</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{task.action}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{task.responsible}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {format(new Date(task.plannedStart), 'dd/MM/yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {format(new Date(task.plannedEnd), 'dd/MM/yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {task.newDeadline && format(new Date(task.newDeadline), 'dd/MM/yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {task.actualEnd && format(new Date(task.actualEnd), 'dd/MM/yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 mt-1">{task.progress}%</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedTask(task)}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <MessageSquare size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTask && (
        <TaskCommentModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </>
  );
}