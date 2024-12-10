import React, { useState } from 'react';
import { useTaskStore } from '../store/taskStore';
import { useAuthStore } from '../store/authStore';
import { useActionPlanStore } from '../store/actionPlanStore';

export function TaskForm() {
  const { user, hasPermission } = useAuthStore();
  const { addTask } = useTaskStore();
  const { selectedPlanId } = useActionPlanStore();
  const [formData, setFormData] = useState({
    action: '',
    responsible: '',
    plannedStart: '',
    plannedEnd: '',
    newDeadline: '',
    actualEnd: '',
    progress: 0,
  });

  if (!selectedPlanId || !hasPermission('createTask')) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedPlanId) return;

    addTask({
      ...formData,
      actionPlanId: selectedPlanId,
      createdBy: user.id,
    });
    
    setFormData({
      action: '',
      responsible: '',
      plannedStart: '',
      plannedEnd: '',
      newDeadline: '',
      actualEnd: '',
      progress: 0,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'progress' ? Math.min(100, Math.max(0, Number(value))) : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Nova Ação</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Ação</label>
          <input
            type="text"
            name="action"
            value={formData.action}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Responsável</label>
          <input
            type="text"
            name="responsible"
            value={formData.responsible}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Início Planejado</label>
          <input
            type="date"
            name="plannedStart"
            value={formData.plannedStart}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Término Planejado</label>
          <input
            type="date"
            name="plannedEnd"
            value={formData.plannedEnd}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Novo Prazo</label>
          <input
            type="date"
            name="newDeadline"
            value={formData.newDeadline}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Término Real</label>
          <input
            type="date"
            name="actualEnd"
            value={formData.actualEnd}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Progresso ({formData.progress}%)
          </label>
          <input
            type="range"
            name="progress"
            value={formData.progress}
            onChange={handleChange}
            min="0"
            max="100"
            className="mt-1 block w-full"
            required
          />
        </div>
      </div>
      <button
        type="submit"
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
      >
        Adicionar Ação
      </button>
    </form>
  );
}