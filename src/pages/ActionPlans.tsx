import React from 'react';
import { ActionPlanForm } from '../components/ActionPlanForm';
import { ActionPlanList } from '../components/ActionPlanList';

export function ActionPlans() {
  return (
    <div className="space-y-6">
      <ActionPlanForm />
      <ActionPlanList />
    </div>
  );
}