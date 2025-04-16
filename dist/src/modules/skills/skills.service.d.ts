import { Repository } from 'typeorm';
import { Skill } from './entities/skill.entity';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { User } from '../users/entities/user.entity';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { GetAllSkillsDto } from './dto/get-all-skills.dto';
export declare class SkillService {
    private readonly skillRepository;
    private readonly userRepo;
    constructor(skillRepository: Repository<Skill>, userRepo: Repository<User>);
    create(createSkillDto: CreateSkillDto, currentUser: User): Promise<Skill>;
    findAll(getAllSkillsDto: GetAllSkillsDto, currentUser: User): Promise<import("nestjs-typeorm-paginate").Pagination<Skill, import("nestjs-typeorm-paginate").IPaginationMeta>>;
    findOne({ id }: ParamIdDto, currentUser: User): Promise<Skill>;
    update({ id }: ParamIdDto, updateSkillDto: UpdateSkillDto, currentUser: User): Promise<Skill>;
    remove({ id }: ParamIdDto, currentUser: User): Promise<void>;
}
