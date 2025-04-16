import { BadRequestException } from '@nestjs/common';
import { EntityType, Media, MediaType } from 'src/modules/media/entities/media.entity';
import { Repository } from 'typeorm';

export async function PortfolioMediaValidation(
  fileType: string,
  entity_id: string,
  entity_type: EntityType,
  mediaRepo: Repository<Media>,
) {
    const noOfMedia = await mediaRepo.count({
      where: {
        entity_id,
      },
    });

    if (noOfMedia > 9) {
      throw new BadRequestException('Limit exceeded');
    }


  if (fileType === 'video') {
    const isAnyVideoExist = await mediaRepo.count({
      where: {
        type: MediaType.VIDEO,
        entity_id,
      },
    });

    if (isAnyVideoExist)
      throw new BadRequestException('Only one video allowed');
  }
}
