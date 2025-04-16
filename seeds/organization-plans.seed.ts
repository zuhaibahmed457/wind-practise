import {
  Plan,
  PlanFor,
  PlanType,
} from 'src/modules/plans/entities/plan.entity';
import Stripe from 'stripe';
import { DataSource } from 'typeorm';

const organizationalPlans = [
  {
    name: 'Free Plan',
    description: 'Available for short terms',
    type: PlanType.FREE,
    number_of_employees_allowed: 5,
    free_duration: 5,
    features: [
      `Limited Users`,
      `Short-Term Access`,
      `Basic Certificate Management`,
      `Basic Reporting & Analytics`,
      `Limited Cloud Storage (20MB)`,
    ],
    for: PlanFor.ORGANIZATION,
  },
  {
    name: 'Monthly Plan',
    description: 'Affordable plan for growing teams',
    type: PlanType.MONTHLY,
    number_of_employees_allowed: 50,
    price: 1099,
    features: [
      `Up to 50 Employees`,
      `Advanced Certificate Management`,
      `Custom Reporting & Analytics`,
      `Increased Cloud Storage (10GB)`,
      `Email Notifications`,
    ],
    for: PlanFor.ORGANIZATION,
  },
  {
    name: 'Yearly Plan',
    description: 'Best for enterprises and large organizations',
    type: PlanType.YEARLY,
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
    for: PlanFor.ORGANIZATION,
  },
];

export const createPlansForOrganization = async (
  AppDateSource: DataSource,
  stripe: Stripe,
) => {
  const planRepository = AppDateSource.getRepository(Plan);

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

      if (plan.type !== PlanType.FREE) {
        const stripePlan = await stripe.products.create({
          name: plan.name,
          description: plan.description,
        });

        const interval = {
          [PlanType.MONTHLY]: 'month',
          [PlanType.YEARLY]: 'year',
        };

        const stripePrice = await stripe.prices.create({
          product: stripePlan.id,
          unit_amount: Math.round(plan.price * 100),
          currency: 'EUR',
          recurring: {
            interval: interval[plan.type] as Stripe.Price.Recurring.Interval,
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
