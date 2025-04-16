import { Subject } from 'src/modules/subject/entities/subject.entity';
import { DataSource } from 'typeorm';

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

export const createSubject = async (AppDataSource: DataSource) => {
  const subjectRepository = await AppDataSource.getRepository(Subject);

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
