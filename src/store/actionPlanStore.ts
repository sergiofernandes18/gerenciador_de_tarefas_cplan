import { create } from 'zustand';
import { ActionPlan, FileAttachment } from '../types';
import { 
  createActionPlan,
  updateActionPlan as updateFirebaseActionPlan,
  deleteActionPlan as deleteFirebaseActionPlan,
  getActionPlans
} from '../services/firebase/actionPlans';

interface ActionPlanState {
  actionPlans: ActionPlan[];
  selectedPlanId: string | null;
  addActionPlan: (plan: Omit<ActionPlan, 'id' | 'createdAt' | 'attachments'>) => Promise<void>;
  updateActionPlan: (id: string, updates: Partial<Omit<ActionPlan, 'attachments'>>) => Promise<void>;
  deleteActionPlan: (id: string) => Promise<void>;
  selectPlan: (id: string | null) => void;
  addAttachment: (planId: string, attachment: FileAttachment) => void;
  removeAttachment: (planId: string, attachmentId: string) => void;
  fetchActionPlans: () => Promise<void>;
}

export const useActionPlanStore = create<ActionPlanState>((set, get) => ({
  actionPlans: [],
  selectedPlanId: null,
  addActionPlan: async (planData) => {
    const plan = await createActionPlan({
      ...planData,
      createdAt: new Date().toISOString(),
      attachments: [],
    });
    set((state) => ({ 
      actionPlans: [...state.actionPlans, plan],
      selectedPlanId: plan.id
    }));
  },
  updateActionPlan: async (id, updates) => {
    await updateFirebaseActionPlan(id, updates);
    set((state) => ({
      actionPlans: state.actionPlans.map((plan) =>
        plan.id === id ? { ...plan, ...updates } : plan
      ),
    }));
  },
  deleteActionPlan: async (id) => {
    await deleteFirebaseActionPlan(id);
    set((state) => ({
      actionPlans: state.actionPlans.filter((plan) => plan.id !== id),
      selectedPlanId: state.selectedPlanId === id ? null : state.selectedPlanId,
    }));
  },
  selectPlan: (id) => set({ selectedPlanId: id }),
  addAttachment: (planId, attachment) => {
    set((state) => ({
      actionPlans: state.actionPlans.map((plan) =>
        plan.id === planId
          ? { ...plan, attachments: [...plan.attachments, attachment] }
          : plan
      ),
    }));
  },
  removeAttachment: (planId, attachmentId) => {
    set((state) => ({
      actionPlans: state.actionPlans.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              attachments: plan.attachments.filter((att) => att.id !== attachmentId),
            }
          : plan
      ),
    }));
  },
  fetchActionPlans: async () => {
    const plans = await getActionPlans();
    set({ actionPlans: plans });
  },
}));