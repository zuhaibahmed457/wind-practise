import { UpdateProfileDetailDto } from './dto/update-profile-detail.dto';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { ProfileDetails } from './entities/profile-details.entity';
import { GetAllProfileDetailsDto } from './dto/get-all-profile-details.dto';
export declare class ProfileDetailsService {
    private readonly userRepo;
    private readonly profileDetailsRepo;
    constructor(userRepo: Repository<User>, profileDetailsRepo: Repository<ProfileDetails>);
    getProfileDetails(getAllProfileDetailsDto: GetAllProfileDetailsDto, currentUser: User): Promise<ProfileDetails>;
    updateProfileDetails(updateProfileDetailDto: UpdateProfileDetailDto, currentUser: User): Promise<ProfileDetails>;
}
