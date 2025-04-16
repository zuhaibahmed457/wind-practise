import { Injectable } from '@nestjs/common';
import { UpdateProfileDetailDto } from './dto/update-profile-detail.dto';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { ProfileDetails } from './entities/profile-details.entity';
import { GetAllProfileDetailsDto } from './dto/get-all-profile-details.dto';
import { Country } from '../country/entities/country.entity';

@Injectable()
export class ProfileDetailsService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(ProfileDetails)
    private readonly profileDetailsRepo: Repository<ProfileDetails>,
  ) {}

  async getProfileDetails(
    getAllProfileDetailsDto: GetAllProfileDetailsDto,
    currentUser: User,
  ) {
    const { profile_details_id } = getAllProfileDetailsDto;
    const query = this.profileDetailsRepo
      .createQueryBuilder('profile')
      .leftJoinAndMapOne('profile.country', Country, 'country', 'profile.country = country.name')
      .leftJoinAndSelect('profile.user', 'user')
      .where('user.id = :user_id', { user_id: currentUser?.id });

    if (profile_details_id) {
      query.where(
        'profile.id = :profile_details_id AND profile.deleted_at IS NULL',
        { profile_details_id },
      );
    }

    return await query.getOne();
  }

  async updateProfileDetails(
    updateProfileDetailDto: UpdateProfileDetailDto,
    currentUser: User,
  ) {
    const { first_name, last_name, phone_no } = updateProfileDetailDto;

    const user = await this.userRepo.findOne({
      where: {
        id: currentUser?.id,
      },
    });

    Object.assign(user, { first_name, last_name, phone_no });
    await user.save();

    const profileDetails = await this.profileDetailsRepo.findOne({
      where: {
        user: {
          id: currentUser?.id,
          deleted_at: IsNull(),
        },
      },
    });

    Object.assign(profileDetails, updateProfileDetailDto);

    return await profileDetails.save();
  }
}
