import { IsNotEmpty } from 'class-validator';
import {
  HasExtension,
  HasMimeType,
  IsFile,
  MemoryStoredFile,
} from 'nestjs-form-data';

export class UploadProfileDto {
  @HasExtension(['jpeg', 'png', 'jpg'])
  @HasMimeType(['image/jpeg', 'image/png', 'image/jpg'])
  @IsFile({ message: 'Image must be an image' })
  @IsNotEmpty()
  image: MemoryStoredFile;
}
