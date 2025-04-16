import { DesignationService } from './designation.service';
import { CreateDesignationDto } from './dto/create-designation.dto';
import { UpdateDesignationDto } from './dto/update-designation.dto';
import { User } from '../users/entities/user.entity';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { GetAllDesignationDto } from './dto/get-all-designation.dto';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { DesignationManageStatusDto } from './dto/designation-status.dto';
export declare class DesignationController {
    private readonly designationService;
    constructor(designationService: DesignationService);
    create(createDesignationDto: CreateDesignationDto, currentUser: User): Promise<IResponse>;
    findAll(getAllDesignationDto: GetAllDesignationDto, currentUser: User): Promise<IResponse>;
    findOne(paramIdDto: ParamIdDto, currentUser: User): Promise<IResponse>;
    update(paramIdDto: ParamIdDto, updateDesignationDto: UpdateDesignationDto, currentUser: User): Promise<IResponse>;
    manage_status(paramDto: ParamIdDto, manageStatusDto: DesignationManageStatusDto, currentUser: User): Promise<IResponse>;
    remove(paramIdDto: ParamIdDto, currentUser: User): Promise<IResponse>;
}
