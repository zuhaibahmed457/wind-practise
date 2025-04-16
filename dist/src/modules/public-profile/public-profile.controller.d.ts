import { PublicProfileService } from './public-profile.service';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { IResponse } from 'src/shared/interfaces/response.interface';
export declare class PublicProfileController {
    private readonly publicProfileService;
    constructor(publicProfileService: PublicProfileService);
    getPublicProfile(paramIdDto: ParamIdDto): Promise<IResponse>;
}
