export type PlanType = 'free' | 'basic' | 'pro' | 'business' | 'enterprise';

export interface PlanLimit {
    products: number;
    users: number;
    features: string[];
    price: number;
    label: string;
}

export const PLAN_LIMITS: Record<PlanType, PlanLimit> = {
    free: {
        products: 5,
        users: 1,
        features: ['basic'],
        price: 0,
        label: 'Gratis (Prueba)'
    },
    basic: {
        products: 30,
        users: 1,
        features: ['pos', 'export', 'reports_m'],
        price: 10,
        label: 'Básico'
    },
    pro: {
        products: 100,
        users: 3,
        features: ['pos_adv', 'reports_w', 'export_pdf'],
        price: 20,
        label: 'Pro'
    },
    business: {
        products: 300,
        users: 10,
        features: ['all_adv', 'support_chat'],
        price: 30,
        label: 'Business'
    },
    enterprise: {
        products: Infinity,
        users: Infinity,
        features: ['api', 'manager'],
        price: 50,
        label: 'Enterprise'
    }
};

export function getPlanLimit(plan: string | null | undefined): PlanLimit {
    const p = (plan?.toLowerCase() || 'free') as PlanType;
    return PLAN_LIMITS[p] || PLAN_LIMITS.free;
}
