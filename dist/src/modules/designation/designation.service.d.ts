import { CreateDesignationDto } from './dto/create-designation.dto';
import { UpdateDesignationDto } from './dto/update-designation.dto';
import { User } from '../users/entities/user.entity';
import { Designation } from './entities/designation.entity';
import { Repository } from 'typeorm';
import { GetAllDesignationDto } from './dto/get-all-designation.dto';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { DesignationManageStatusDto } from './dto/designation-status.dto';
export declare class DesignationService {
    private readonly designationRepo;
    private readonly userRepo;
    constructor(designationRepo: Repository<Designation>, userRepo: Repository<User>);
    create(createDesignationDto: CreateDesignationDto, currentUser: User): Promise<Designation>;
    findAll(getAllDesignationDto: GetAllDesignationDto, currentUser: User): Promise<import("nestjs-typeorm-paginate").Pagination<Designation, import("nestjs-typeorm-paginate").IPaginationMeta>>;
    findOne({ id }: ParamIdDto, currentUser: User): Promise<Designation>;
    update({ id }: ParamIdDto, updateDesignationDto: UpdateDesignationDto, currentUser: User): Promise<Designation>;
    manageStatus({ id }: ParamIdDto, manageStatusDto: DesignationManageStatusDto, currentUser: User): Promise<Designation>;
    remove(id: string, currentUser: User): Promise<void>;
}
