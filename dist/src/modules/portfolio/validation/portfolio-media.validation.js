"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortfolioMediaValidation = PortfolioMediaValidation;
const common_1 = require("@nestjs/common");
const media_entity_1 = require("../../media/entities/media.entity");
async function PortfolioMediaValidation(fileType, entity_id, entity_type, mediaRepo) {
    const noOfMedia = await mediaRepo.count({
        where: {
            entity_id,
        },
    });
    if (noOfMedia > 9) {
        throw new common_1.BadRequestException('Limit exceeded');
    }
    if (fileType === 'video') {
        const isAnyVideoExist = await mediaRepo.count({
            where: {
                type: media_entity_1.MediaType.VIDEO,
                entity_id,
            },
        });
        if (isAnyVideoExist)
            throw new common_1.BadRequestException('Only one video allowed');
    }
}
//# sourceMappingURL=portfolio-media.validation.js.map