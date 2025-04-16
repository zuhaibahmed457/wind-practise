"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDegreeType = void 0;
const degree_type_entity_1 = require("../src/modules/degree-type/entities/degree-type.entity");
const degreeType = [`Bachelor's`, `Matriculations`, `Intermediate`, `Master's`];
const createDegreeType = async (AppDataSource) => {
    const degreeTypeRepository = await AppDataSource.getRepository(degree_type_entity_1.DegreeType);
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
exports.createDegreeType = createDegreeType;
//# sourceMappingURL=degree-type.seed.js.map