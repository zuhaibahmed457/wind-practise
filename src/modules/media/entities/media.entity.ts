import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  PDF = 'pdf',
}

export enum EntityType {
  PORTFOLIO = 'portfolio',
  USER = 'user',
  SUBSCRIPTION = 'subscription',
  CERTIFICATE = 'certificate',
}

@Entity()
export class Media extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: MediaType,
  })
  type: MediaType;

  @Column()
  url: string;

  @Column()
  entity_id: string;

  @Column({
    type: 'enum',
    enum: EntityType,
  })
  entity_type: EntityType;

  @CreateDateColumn()
  created_at: Date;
}
