import { User } from '../users/entities/user.entity';
import { EducationService } from './education.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { UpdateEducationDto } from './dto/update-education.dto';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { GetAllEducationDto } from './dto/get-all-education.dto';
export declare class EducationController {
    private readonly educationService;
    constructor(educationService: EducationService);
    create(createEducationDto: CreateEducationDto, currentUser: User): Promise<IResponse>;
    findAll(getAllEducationDto: GetAllEducationDto, currentUser: User): Promise<IResponse>;
    findOne(paramIdDto: ParamIdDto, currentUser: User): Promise<IResponse>;
    update(paramIdDto: ParamIdDto, updateEducationDto: UpdateEducationDto, currentUser: User): Promise<IResponse>;
    remove(paramIdDto: ParamIdDto, currentUser: User): Promise<IResponse>;
}
