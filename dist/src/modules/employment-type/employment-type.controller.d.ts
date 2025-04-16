import { EmploymentTypeService } from './employment-type.service';
import { CreateEmploymentTypeDto } from './dto/create-employment-type.dto';
import { UpdateEmploymentTypeDto } from './dto/update-employment-type.dto';
import { User } from '../users/entities/user.entity';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { GetAllEmploymentTypeDto } from './dto/get-all-employment-type.dto';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { EmploymentTypeManageStatusDto } from './dto/manage-status.dto';
export declare class EmploymentTypeController {
    private readonly employmentTypeService;
    constructor(employmentTypeService: EmploymentTypeService);
    create(createEmploymentTypeDto: CreateEmploymentTypeDto, currentUser: User): Promise<IResponse>;
    findAll(getAllEmploymentTypeDto: GetAllEmploymentTypeDto, currentUser: User): Promise<IResponse>;
    findOne(paramIdDto: ParamIdDto): Promise<IResponse>;
    update(paramIdDto: ParamIdDto, updateEmploymentTypeDto: UpdateEmploymentTypeDto): Promise<IResponse>;
    manage_status(paramDto: ParamIdDto, manageStatusDto: EmploymentTypeManageStatusDto): Promise<IResponse>;
}
