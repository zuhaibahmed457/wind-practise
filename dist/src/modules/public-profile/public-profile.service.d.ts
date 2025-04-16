import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
export declare class PublicProfileService {
    private readonly userRepo;
    constructor(userRepo: Repository<User>);
    viewPublicProfile({ id }: ParamIdDto): Promise<User>;
}
