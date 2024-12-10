import React from 'react';
import { useAuthStore } from '../store/authStore';
import { LogOut } from 'lucide-react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { ManagementPanel } from './ManagementPanel';
import { ActionPlans } from './ActionPlans';
import { ActionPlanDetails } from './ActionPlanDetails';

export function Dashboard() {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-semibold">Gestão de Planos de Ação</h1>
              <div className="flex gap-4">
                <NavLink
                  to="/dashboard"
                  end
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900'
                    }`
                  }
                >
                  Painel Gerencial
                </NavLink>
                <NavLink
                  to="/dashboard/action-plans"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900'
                    }`
                  }
                >
                  Planos de Ação
                </NavLink>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Bem-vindo, {user?.name}</span>
              <button
                onClick={logout}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <LogOut size={18} />
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<ManagementPanel />} />
          <Route path="/action-plans" element={<ActionPlans />} />
          <Route path="/action-plans/:id" element={<ActionPlanDetails />} />
        </Routes>
      </main>
    </div>
  );
}