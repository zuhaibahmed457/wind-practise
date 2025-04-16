import { IsNotEmpty, IsUUID } from 'class-validator';

export class ApplyJobApplicantDto {
  @IsUUID('all', { message: 'Invalid Id' })
  @IsNotEmpty()
  job_post_id: string;
}
