import React from 'react';
import { useActionPlanStore } from '../store/actionPlanStore';
import { useTaskStore } from '../store/taskStore';
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BarChart3, CheckCircle, XCircle, Clock, PieChart } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export function ManagementPanel() {
  const { actionPlans } = useActionPlanStore();
  const { tasks } = useTaskStore();

  const statusCounts = {
    active: actionPlans.filter(plan => plan.status === 'active').length,
    completed: actionPlans.filter(plan => plan.status === 'completed').length,
    cancelled: actionPlans.filter(plan => plan.status === 'cancelled').length,
  };

  const pieChartData = {
    labels: ['Em Andamento', 'Concluído', 'Cancelado'],
    datasets: [
      {
        data: [statusCounts.active, statusCounts.completed, statusCounts.cancelled],
        backgroundColor: ['#3B82F6', '#10B981', '#EF4444'],
        borderColor: ['#2563EB', '#059669', '#DC2626'],
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  const getTasksForPeriod = (start: Date, end: Date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.plannedStart);
      return taskDate >= start && taskDate <= end;
    });
  };

  const now = new Date();
  const dailyTasks = getTasksForPeriod(startOfDay(now), endOfDay(now));
  const weeklyTasks = getTasksForPeriod(startOfWeek(now), endOfWeek(now));
  const monthlyTasks = getTasksForPeriod(startOfMonth(now), endOfMonth(now));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="text-blue-500" size={24} />
            <h3 className="text-lg font-semibold">Em Andamento</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">{statusCounts.active}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="text-green-500" size={24} />
            <h3 className="text-lg font-semibold">Concluídos</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">{statusCounts.completed}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <XCircle className="text-red-500" size={24} />
            <h3 className="text-lg font-semibold">Cancelados</h3>
          </div>
          <p className="text-3xl font-bold text-red-600">{statusCounts.cancelled}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <PieChart className="text-purple-500" size={24} />
            <h3 className="text-lg font-semibold">Distribuição por Status</h3>
          </div>
          <div className="h-48">
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="text-blue-500" size={24} />
          <h2 className="text-xl font-bold">Visão Geral das Tarefas</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Tarefas do Dia</h3>
            <div className="space-y-2">
              {dailyTasks.map(task => (
                <div key={task.id} className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium">{task.action}</p>
                  <p className="text-sm text-gray-500">
                    {task.responsible} - {task.progress}% concluído
                  </p>
                </div>
              ))}
              {dailyTasks.length === 0 && (
                <p className="text-gray-500">Nenhuma tarefa agendada para hoje</p>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Tarefas da Semana</h3>
            <div className="space-y-2">
              {weeklyTasks.map(task => (
                <div key={task.id} className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium">{task.action}</p>
                  <p className="text-sm text-gray-500">
                    {task.responsible} - {task.progress}% concluído
                  </p>
                </div>
              ))}
              {weeklyTasks.length === 0 && (
                <p className="text-gray-500">Nenhuma tarefa agendada para esta semana</p>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Tarefas do Mês</h3>
            <div className="space-y-2">
              {monthlyTasks.map(task => (
                <div key={task.id} className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium">{task.action}</p>
                  <p className="text-sm text-gray-500">
                    {task.responsible} - {task.progress}% concluído
                  </p>
                </div>
              ))}
              {monthlyTasks.length === 0 && (
                <p className="text-gray-500">Nenhuma tarefa agendada para este mês</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}