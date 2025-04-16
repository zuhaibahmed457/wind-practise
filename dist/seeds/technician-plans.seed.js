"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPlansForTechnician = void 0;
const plan_entity_1 = require("../src/modules/plans/entities/plan.entity");
const technicianPlans = [
    {
        name: 'Free Plan',
        description: 'Best for beginners to showcase their portfolio',
        type: plan_entity_1.PlanType.FREE,
        number_of_certificates_allowed: 5,
        free_duration: 5,
        features: [
            `Upload & Manage Portfolio`,
            `Upload up to 5 Certificates`,
            `Apply to Job Posts`,
            `Basic Profile Sharing`,
            `Certificate Expiry Notification (In-App Only)`,
            `Limited Cloud Storage (50MB)`,
        ],
        for: plan_entity_1.PlanFor.TECHNICIAN,
    },
    {
        name: 'Monthly Plan',
        description: 'Ideal for professionals who want more features',
        type: plan_entity_1.PlanType.MONTHLY,
        number_of_certificates_allowed: 50,
        price: 199,
        features: [
            `Upload & Manage Portfolio`,
            `Upload up to 50 Certificates`,
            `Apply to Unlimited Job Posts`,
            `Profile Sharing with View Requests`,
            `Certificate Expiry Notifications (Email & In-App)`,
            `Increased Cloud Storage (5GB)`,
            `Priority Support`,
        ],
        for: plan_entity_1.PlanFor.TECHNICIAN,
    },
    {
        name: 'Yearly Plan',
        description: 'Best for expert technicians and full-time professionals',
        type: plan_entity_1.PlanType.YEARLY,
        number_of_certificates_allowed: 500,
        price: 999,
        features: [
            `Unlimited Portfolio & Certificate Uploads`,
            `Apply to Unlimited Job Posts`,
            `Profile Sharing with Direct Access`,
            `Advanced Certificate Management + Auto Expiry Alerts`,
            `API Access for Third-Party Integration`,
            `Unlimited Cloud Storage`,
            `Premium Support (24/7)`,
        ],
        for: plan_entity_1.PlanFor.TECHNICIAN,
    },
];
const createPlansForTechnician = async (AppDateSource, stripe) => {
    const planRepository = AppDateSource.getRepository(plan_entity_1.Plan);
    for (const plan of technicianPlans) {
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
    console.log('All plans for technician seeded successfully');
};
exports.createPlansForTechnician = createPlansForTechnician;
//# sourceMappingURL=technician-plans.seed.js.map