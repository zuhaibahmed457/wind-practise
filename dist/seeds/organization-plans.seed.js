"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPlansForOrganization = void 0;
const plan_entity_1 = require("../src/modules/plans/entities/plan.entity");
const organizationalPlans = [
    {
        name: 'Free Plan',
        description: 'Available for short terms',
        type: plan_entity_1.PlanType.FREE,
        number_of_employees_allowed: 5,
        free_duration: 5,
        features: [
            `Limited Users`,
            `Short-Term Access`,
            `Basic Certificate Management`,
            `Basic Reporting & Analytics`,
            `Limited Cloud Storage (20MB)`,
        ],
        for: plan_entity_1.PlanFor.ORGANIZATION,
    },
    {
        name: 'Monthly Plan',
        description: 'Affordable plan for growing teams',
        type: plan_entity_1.PlanType.MONTHLY,
        number_of_employees_allowed: 50,
        price: 1099,
        features: [
            `Up to 50 Employees`,
            `Advanced Certificate Management`,
            `Custom Reporting & Analytics`,
            `Increased Cloud Storage (10GB)`,
            `Email Notifications`,
        ],
        for: plan_entity_1.PlanFor.ORGANIZATION,
    },
    {
        name: 'Yearly Plan',
        description: 'Best for enterprises and large organizations',
        type: plan_entity_1.PlanType.YEARLY,
        number_of_employees_allowed: 500,
        price: 2099,
        features: [
            `Unlimited Employees`,
            `Advanced Certificate Management + Auto Expiry Alerts`,
            `Custom Branding & White Labeling`,
            `API Access for Integrations`,
            `Unlimited Cloud Storage`,
            `Premium Customer Support (24/7)`,
            `AI-Powered Insights & Predictive Analytics`,
        ],
        for: plan_entity_1.PlanFor.ORGANIZATION,
    },
];
const createPlansForOrganization = async (AppDateSource, stripe) => {
    const planRepository = AppDateSource.getRepository(plan_entity_1.Plan);
    for (const plan of organizationalPlans) {
        const planAlreadyExist = await planRepository.findOne({
            where: {
                name: plan.name,
                for: plan.for,
            },
        });
        if (!planAlreadyExist) {
            const newPlan = planRepository.create({
                ...plan,
            });
            if (plan.type !== plan_entity_1.PlanType.FREE) {
                const stripePlan = await stripe.products.create({
                    name: plan.name,
                    description: plan.description,
                });
                const interval = {
                    [plan_entity_1.PlanType.MONTHLY]: 'month',
                    [plan_entity_1.PlanType.YEARLY]: 'year',
                };
                const stripePrice = await stripe.prices.create({
                    product: stripePlan.id,
                    unit_amount: Math.round(plan.price * 100),
                    currency: 'EUR',
                    recurring: {
                        interval: interval[plan.type],
                        interval_count: 1,
                    },
                });
                newPlan.stripe_product_id = stripePlan.id;
                newPlan.stripe_price_id = stripePrice.id;
            }
            await newPlan.save();
        }
    }
    console.log('All plans for organization seeded successfully');
};
exports.createPlansForOrganization = createPlansForOrganization;
//# sourceMappingURL=organization-plans.seed.js.map