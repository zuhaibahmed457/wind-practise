import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { EntityType } from '../entities/media.entity';
import { IsFile, MemoryStoredFile } from 'nestjs-form-data';

export class CreateMediaDto {
  @IsFile({ message: 'must be a file' })
  @IsNotEmpty()
  file: MemoryStoredFile;

  @IsNotEmpty()
  folder_path: string;

  @IsUUID('all', { message: 'Invalid id' })
  @IsNotEmpty()
  entity_id: string;

  @IsEnum(EntityType)
  @IsNotEmpty()
  entity_type: EntityType;
}
