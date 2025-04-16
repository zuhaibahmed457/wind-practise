import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class RequestResponseTime extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  request_time: Date;

  @Column()
  response_time: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  duration: number;

  @Column()
  request: string;

  @Column()
  response: string;

  @CreateDateColumn()
  created_at: Date;
}
