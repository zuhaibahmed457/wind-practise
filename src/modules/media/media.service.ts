import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Media, MediaType } from './entities/media.entity';
import { Repository } from 'typeorm';
import { S3Service } from '../s3/s3.service';
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard';
import { mediaSize } from 'src/utils/media-file-size';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';

@Injectable()
@UseGuards(AuthenticationGuard)
export class MediaService {
  constructor(
    @InjectRepository(Media) private readonly mediaRepo: Repository<Media>,
    private readonly s3Service: S3Service,
  ) {}

  async createMedia(createMediaDto: CreateMediaDto) {
    const { entity_id, entity_type, file, folder_path } = createMediaDto;

    const fileType = file.mimeType.split('/')[0];

    let type: MediaType;

    if (fileType === MediaType.IMAGE) {
      if (file.size > mediaSize.IMAGE_SIZE_LIMIT) {
        throw new BadRequestException('Image size should not exceed 10MB');
      }
      type = MediaType.IMAGE;
    }

    if (fileType === MediaType.VIDEO) {
      if (file.size > mediaSize.VIDEO_SIZE_LIMIT) {
        throw new BadRequestException('Video size should not exceed 100MB');
      }
      type = MediaType.VIDEO;
    }

    if (fileType === 'application' && file.mimeType.includes('pdf')) {
      type = MediaType.PDF;
    }

    const url = await this.s3Service.uploadFile(file, folder_path);
    const media = this.mediaRepo.create({
      type,
      url,
      entity_id,
      entity_type,
    });

    return await media.save();
  }

  async deleteMedia({ id }: ParamIdDto) {
    const media = await this.mediaRepo.findOne({
      where: {
        id,
      },
    });

    if (!media) throw new NotFoundException('Media not found');

    await this.s3Service.deleteFile(media?.url);

    await this.mediaRepo.delete(media?.id);
  }

  async deleteMultipleFiles({ id }: ParamIdDto) {
    const media = await this.mediaRepo.find({
      where: {
        entity_id: id,
      },
    });

    if (media.length) {
      const fileUrls = media.map((item) => item.url);
      await this.s3Service.deleteMultipleFiles(fileUrls);
      await this.mediaRepo.delete({
        entity_id: id,
      });

      return;
    }
  }
}
