"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSubject = void 0;
const subject_entity_1 = require("../src/modules/subject/entities/subject.entity");
const subjects = [
    'General Inquiry',
    'Technical Support',
    'Account Issues',
    'Partnerships & Collaborations',
    'Job Posting Assistance',
    'Certificate Verification',
    'Billing & Payments',
    'Report a Problem',
    'Feedback & Suggestions',
];
const createSubject = async (AppDataSource) => {
    const subjectRepository = await AppDataSource.getRepository(subject_entity_1.Subject);
    for (const subject of subjects) {
        const isSubjectExist = await subjectRepository.findOne({
            where: {
                name: subject,
            },
        });
        if (!isSubjectExist) {
            const createSubject = subjectRepository.create({
                name: subject,
            });
            await createSubject.save();
        }
    }
    console.log('All Contact-us subjects seeded successfully');
};
exports.createSubject = createSubject;
//# sourceMappingURL=contact-us-subject.seed.js.map