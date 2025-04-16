import { CreateMediaDto } from './dto/create-media.dto';
import { Media } from './entities/media.entity';
import { Repository } from 'typeorm';
import { S3Service } from '../s3/s3.service';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
export declare class MediaService {
    private readonly mediaRepo;
    private readonly s3Service;
    constructor(mediaRepo: Repository<Media>, s3Service: S3Service);
    createMedia(createMediaDto: CreateMediaDto): Promise<Media>;
    deleteMedia({ id }: ParamIdDto): Promise<void>;
    deleteMultipleFiles({ id }: ParamIdDto): Promise<void>;
}
