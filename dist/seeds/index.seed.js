"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const typeorm_1 = require("typeorm");
const degree_type_seed_1 = require("./degree-type.seed");
const employment_type_seed_1 = require("./employment-type.seed");
const super_admin_seed_1 = require("./super-admin.seed");
const countries_seed_1 = require("./countries.seed");
const stripe_1 = require("stripe");
const organization_plans_seed_1 = require("./organization-plans.seed");
const technician_plans_seed_1 = require("./technician-plans.seed");
const contact_us_subject_seed_1 = require("./contact-us-subject.seed");
(0, dotenv_1.config)({
    path: `.env.${process.env.NODE_ENV}`,
});
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-01-27.acacia',
});
const AppDataSource = new typeorm_1.DataSource({
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
        await (0, super_admin_seed_1.createSuperAdmin)(AppDataSource);
        await (0, organization_plans_seed_1.createPlansForOrganization)(AppDataSource, stripe);
        await (0, technician_plans_seed_1.createPlansForTechnician)(AppDataSource, stripe);
        await (0, countries_seed_1.createCountries)(AppDataSource);
        await (0, degree_type_seed_1.createDegreeType)(AppDataSource);
        await (0, employment_type_seed_1.createEmploymentType)(AppDataSource);
        await (0, contact_us_subject_seed_1.createSubject)(AppDataSource);
        console.log('Seeding complete!');
    }
    catch (error) {
        console.log('Error Seeding Industries ', error);
    }
    finally {
        AppDataSource.destroy();
        console.log('Database connection closed');
    }
};
seed();
//# sourceMappingURL=index.seed.js.map