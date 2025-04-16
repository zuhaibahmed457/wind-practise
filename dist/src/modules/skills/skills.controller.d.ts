import { User } from '../users/entities/user.entity';
import { SkillService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { GetAllSkillsDto } from './dto/get-all-skills.dto';
export declare class SkillController {
    private readonly skillService;
    constructor(skillService: SkillService);
    create(createSkillDto: CreateSkillDto, currentUser: User): Promise<IResponse>;
    findAll(getAllSkillsDto: GetAllSkillsDto, currentUser: User): Promise<IResponse>;
    findOne(paramIdDto: ParamIdDto, currentUser: User): Promise<IResponse>;
    update(paramIdDto: ParamIdDto, updateSkillDto: UpdateSkillDto, currentUser: User): Promise<IResponse>;
    remove(paramIdDto: ParamIdDto, currentUser: User): Promise<IResponse>;
}
