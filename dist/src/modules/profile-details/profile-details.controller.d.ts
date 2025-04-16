import { ProfileDetailsService } from './profile-details.service';
import { UpdateProfileDetailDto } from './dto/update-profile-detail.dto';
import { User } from '../users/entities/user.entity';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { GetAllProfileDetailsDto } from './dto/get-all-profile-details.dto';
export declare class ProfileDetailsController {
    private readonly profileDetailsService;
    constructor(profileDetailsService: ProfileDetailsService);
    findAll(getAllProfileDetailsDto: GetAllProfileDetailsDto, currentUser: User): Promise<IResponse>;
    update(updateProfileDetailDto: UpdateProfileDetailDto, currentUser: User): Promise<IResponse>;
}
