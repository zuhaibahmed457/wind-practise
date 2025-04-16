import { EntityType } from '../entities/media.entity';
import { MemoryStoredFile } from 'nestjs-form-data';
export declare class CreateMediaDto {
    file: MemoryStoredFile;
    folder_path: string;
    entity_id: string;
    entity_type: EntityType;
}
