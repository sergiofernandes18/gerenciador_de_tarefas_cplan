import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useActionPlanStore } from '../store/actionPlanStore';
import { useTaskStore } from '../store/taskStore';
import { format } from 'date-fns';
import { Edit2, Trash2, ArrowRight } from 'lucide-react';
import { ActionPlan } from '../types';

export function ActionPlanList() {
  const navigate = useNavigate();
  const { actionPlans, updateActionPlan, deleteActionPlan } = useActionPlanStore();
  const { getTasksByPlanId } = useTaskStore();
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');
  const [editingPlan, setEditingPlan] = useState<ActionPlan | null>(null);

  const filteredPlans = actionPlans.filter(plan => 
    statusFilter === 'all' ? true : plan.status === statusFilter
  );

  const handleStatusChange = (planId: string, newStatus: 'active' | 'completed' | 'cancelled') => {
    updateActionPlan(planId, { status: newStatus });
  };

  const handleDelete = (e: React.MouseEvent, planId: string) => {
    e.stopPropagation();
    if (window.confirm('Tem certeza que deseja excluir este Plano de Ação? Esta ação não pode ser desfeita.')) {
      deleteActionPlan(planId);
    }
  };

  const handleEdit = (e: React.MouseEvent, plan: ActionPlan) => {
    e.stopPropagation();
    setEditingPlan(plan);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;
    
    updateActionPlan(editingPlan.id, {
      title: editingPlan.title,
      description: editingPlan.description,
      startDate: editingPlan.startDate,
      endDate: editingPlan.endDate,
    });
    
    setEditingPlan(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Planos de Ação</h2>
        <div className="flex gap-2">
          {(['all', 'active', 'completed', 'cancelled'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'Todos' : 
               status === 'active' ? 'Em Andamento' :
               status === 'completed' ? 'Concluídos' : 'Cancelados'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlans.map((plan) => {
          const tasks = getTasksByPlanId(plan.id);
          const completedTasks = tasks.filter(task => task.progress === 100).length;
          const totalTasks = tasks.length;
          const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

          return (
            <div
              key={plan.id}
              onClick={() => navigate(`/dashboard/action-plans/${plan.id}`)}
              className="p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 cursor-pointer transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{plan.title}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => handleEdit(e, plan)}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, plan.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{plan.description}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Início: {format(new Date(plan.startDate), 'dd/MM/yyyy')}</span>
                  <span>Fim: {format(new Date(plan.endDate), 'dd/MM/yyyy')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex-1 mr-4">
                    <div className="text-sm text-gray-500 mb-1">
                      Progresso: {progress}%
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <ArrowRight size={20} className="text-gray-400" />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Ações: {totalTasks}</span>
                  <span className="text-gray-500">Concluídas: {completedTasks}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {editingPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Editar Plano de Ação</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Título</label>
                <input
                  type="text"
                  value={editingPlan.title}
                  onChange={(e) => setEditingPlan({ ...editingPlan, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Descrição</label>
                <textarea
                  value={editingPlan.description}
                  onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Data de Início</label>
                <input
                  type="date"
                  value={editingPlan.startDate}
                  onChange={(e) => setEditingPlan({ ...editingPlan, startDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Data de Término</label>
                <input
                  type="date"
                  value={editingPlan.endDate}
                  onChange={(e) => setEditingPlan({ ...editingPlan, endDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                  required
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setEditingPlan(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {filteredPlans.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Nenhum plano de ação encontrado para o status selecionado.
        </div>
      )}
    </div>
  );
}