import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import { IsNull, Repository } from 'typeorm';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';

@Injectable()
export class PublicProfileService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async viewPublicProfile({ id }: ParamIdDto) {
    const user = await this.userRepo.findOne({
      where: {
        role: UserRole.TECHNICIAN,
        deleted_at: IsNull(),
        profile_detail: {
          id,
        },
      },
      relations: {
        profile_detail: {
            skills: true,
            educations: {
              degree_type: true
            }
        }
      }
    });

    if(!user) throw new NotFoundException('Profile not found');

    return user;
  }
}
