import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { createDegreeType } from './degree-type.seed';
import { createEmploymentType } from './employment-type.seed';
import { createSuperAdmin } from './super-admin.seed';
import { createCountries } from './countries.seed';
import Stripe from 'stripe';
import { createPlansForOrganization } from './organization-plans.seed';
import { createPlansForTechnician } from './technician-plans.seed';
import { createSubject } from './contact-us-subject.seed';

config({
  path: `.env.${process.env.NODE_ENV}`,
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-01-27.acacia',
});

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['src/**/*.entity.ts'],
  synchronize: false,
  logging: true,
  ssl: {
    rejectUnauthorized: false,
  },
});

const seed = async () => {
  try {
    console.log('Initializing Database Connection....');
    await AppDataSource.initialize();

    console.log('Database Connected Successfully!');
    await createSuperAdmin(AppDataSource);
    await createPlansForOrganization(AppDataSource, stripe);
    await createPlansForTechnician(AppDataSource, stripe);
    await createCountries(AppDataSource);
    await createDegreeType(AppDataSource);
    await createEmploymentType(AppDataSource);
    await createSubject(AppDataSource);

    console.log('Seeding complete!');
  } catch (error) {
    console.log('Error Seeding Industries ', error);
  } finally {
    AppDataSource.destroy();
    console.log('Database connection closed');
  }
};

seed();
