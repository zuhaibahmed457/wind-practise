"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmploymentType = void 0;
const employment_type_entity_1 = require("../src/modules/employment-type/entities/employment-type.entity");
const employmentTypes = [
    {
        name: `Part-time`,
        description: `Part-time employment allows workers to work fewer hours than full-time staff and often has flexible schedules. Part-time employees are hired to meet demands outside the constant workflow.`,
    },
    {
        name: `Casual`,
        description: `All the different types of employment we discussed till now involve formal scheduling. Still, if your business has no fixed schedule or requires a commitment to regular work hours, the casual employment option is ideal for you.`,
    },
    {
        name: `Apprenticeship`,
        description: `Apprenticeship is the type of employment suitable for people new to trade industries. Companies offer apprenticeships to workers through structured training programs under experienced professionals.`,
    },
    {
        name: `Contract`,
        description: `Contract employment is common in IT, where individuals are hired for specific projects, tasks, or periods. Contract workers are not part of the traditional workforce and are commonly known as freelancers or independent contractors.`,
    },
    {
        name: `Full-time`,
        description: `The most common type of employment is full-time arrangement. Full-time employees are hired to typically work a standard 35-40 hours per week and have a regular schedule and consistent pay. Such employees are provided the usual work benefits such as health insurance, paid time off, and retirement plans.`,
    },
    {
        name: `Internship`,
        description: `Internships are offered to entry-level professionals and students to gain practical experience in the fields that interest them. It is suitable for various industries and can include positions that provide temporary and unpaid employment, stipends, or college credit. `,
    },
    {
        name: `Traineeship`,
        description: `Traineeships are very similar to apprenticeships, but they are of shorter duration and involve less formal education. This type of employment is suitable for companies that require employees for immediate, short-term needs as traineeship provides practical training in a shorter time frame. `,
    },
];
const createEmploymentType = async (AppDataSource) => {
    const employmentTypeRepository = await AppDataSource.getRepository(employment_type_entity_1.EmploymentType);
    for (const { description, name } of employmentTypes) {
        const isEmploymentTypeExist = await employmentTypeRepository.findOne({
            where: {
                name,
            },
        });
        if (!isEmploymentTypeExist) {
            const createEmploymentType = employmentTypeRepository.create({
                name,
                description,
            });
            await createEmploymentType.save();
        }
    }
    console.log('All Employment Type seeded successfully');
};
exports.createEmploymentType = createEmploymentType;
//# sourceMappingURL=employment-type.seed.js.map