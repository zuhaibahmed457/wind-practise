import { User } from 'src/modules/users/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Certificate } from './certificate.entity';

@Entity('certificate_history')
export class CertificateHistory extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  issuing_authority: string;

  @Column()
  issuing_date: Date;

  @Column()
  expiration_date: Date;

  @Column()
  notification_date: Date; // ** When the date reaches will start notifying the created_by => when organization or user => when technician

  @Column()
  certificate_url: string;

  @CreateDateColumn()
  modified_at: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'modified_by_id' })
  modified_by: User;

  @ManyToOne(() => Certificate, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'certificate_id' })
  certificate: Certificate;
}
