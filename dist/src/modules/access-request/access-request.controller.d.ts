import { AccessRequestService } from './access-request.service';
import { CreateAccessRequestDto } from './dto/create-access-request.dto';
import { User } from '../users/entities/user.entity';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { GetAllAccessRequestDto } from './dto/get-all-access-request.dto';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { ManageAccessRequestDto } from './dto/manage-access-request.dto';
import { ViewAccessRequestDto } from './dto/view-access-request.dto';
export declare class AccessRequestController {
    private readonly accessRequestService;
    constructor(accessRequestService: AccessRequestService);
    create(createAccessRequestDto: CreateAccessRequestDto): Promise<IResponse>;
    viewAccessRequest(viewAccessRequestDto: ViewAccessRequestDto): Promise<IResponse>;
    findAll(getAllAccessRequestDto: GetAllAccessRequestDto, currentUser: User): Promise<IResponse>;
    findOne(paramIdDto: ParamIdDto, currentUser: User): Promise<IResponse>;
    manageStatus(paramIdDto: ParamIdDto, currentUser: User, manageAccessRequestDto: ManageAccessRequestDto): Promise<IResponse>;
    remove(paramIdDto: ParamIdDto, currentUser: User): Promise<IResponse>;
}
