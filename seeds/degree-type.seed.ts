import { DegreeType } from 'src/modules/degree-type/entities/degree-type.entity';
import { DataSource } from 'typeorm';

const degreeType = [`Bachelor's`, `Matriculations`, `Intermediate`, `Master's`];

export const createDegreeType = async (AppDataSource: DataSource) => {
  const degreeTypeRepository = await AppDataSource.getRepository(DegreeType);

  // Insert each degree type
  for (const name of degreeType) {
    const degreeTypeExist = await degreeTypeRepository.findOne({
      where: {
        name,
      },
    });

    if (!degreeTypeExist) {
      const createDegreeType = degreeTypeRepository.create({
        name,
      });

      await degreeTypeRepository.save(createDegreeType);
    }
  }

  console.log('All Degree-Type seeded successfully');
};
