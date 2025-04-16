import { CreateEmploymentTypeDto } from './dto/create-employment-type.dto';
import { UpdateEmploymentTypeDto } from './dto/update-employment-type.dto';
import { EmploymentType } from './entities/employment-type.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { GetAllEmploymentTypeDto } from './dto/get-all-employment-type.dto';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { EmploymentTypeManageStatusDto } from './dto/manage-status.dto';
export declare class EmploymentTypeService {
    private readonly employmentTypeRepository;
    constructor(employmentTypeRepository: Repository<EmploymentType>);
    create(createEmploymentTypeDto: CreateEmploymentTypeDto, currentUser: User): Promise<EmploymentType>;
    findAll(getAllEmploymentTypeDto: GetAllEmploymentTypeDto): Promise<import("nestjs-typeorm-paginate").Pagination<EmploymentType, import("nestjs-typeorm-paginate").IPaginationMeta>>;
    findOne({ id }: ParamIdDto): Promise<EmploymentType>;
    update({ id }: ParamIdDto, updateEmploymentTypeDto: UpdateEmploymentTypeDto): Promise<EmploymentType>;
    manageStatus({ id }: ParamIdDto, manageStatusDto: EmploymentTypeManageStatusDto): Promise<EmploymentType>;
}
