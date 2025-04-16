import { IsNotEmpty } from 'class-validator';
import {
  HasExtension,
  HasMimeType,
  IsFile,
  MemoryStoredFile,
} from 'nestjs-form-data';

export class UploadMediaDto {
  @HasExtension(['jpeg', 'png', 'jpg', 'mp4', 'mpeg', 'mov', 'avi'])
  @HasMimeType([
    'image/jpeg',
    'image/png',
    'image/jpg',
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'video/x-msvideo',
  ])
  @IsFile({ message: 'must be a file' })
  @IsNotEmpty()
  file: MemoryStoredFile;
}
