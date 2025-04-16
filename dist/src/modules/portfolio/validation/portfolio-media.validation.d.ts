import { EntityType, Media } from 'src/modules/media/entities/media.entity';
import { Repository } from 'typeorm';
export declare function PortfolioMediaValidation(fileType: string, entity_id: string, entity_type: EntityType, mediaRepo: Repository<Media>): Promise<void>;
