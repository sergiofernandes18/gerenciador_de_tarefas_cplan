import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useActionPlanStore } from '../store/actionPlanStore';
import { TaskForm } from '../components/TaskForm';
import { TaskList } from '../components/TaskList';
import { ReportGenerator } from '../components/ReportGenerator';
import { ArrowLeft } from 'lucide-react';

export function ActionPlanDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { actionPlans } = useActionPlanStore();
  const actionPlan = actionPlans.find(plan => plan.id === id);

  if (!actionPlan) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Plano de ação não encontrado.</p>
        <button
          onClick={() => navigate('/dashboard/action-plans')}
          className="mt-4 text-blue-500 hover:text-blue-600"
        >
          Voltar para lista de planos
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard/action-plans')}
            className="text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">{actionPlan.title}</h1>
            <p className="text-gray-500">{actionPlan.description}</p>
          </div>
        </div>
      </div>
      <ReportGenerator />
      <TaskForm />
      <TaskList />
    </div>
  );
}