import { CreateJobPostDto } from './dto/create-job-post.dto';
import { UpdateJobPostDto } from './dto/update-job-post.dto';
import { JobPost } from './entities/job-post.entity';
import { Repository } from 'typeorm';
import { Designation } from '../designation/entities/designation.entity';
import { EmploymentType } from '../employment-type/entities/employment-type.entity';
import { User } from '../users/entities/user.entity';
import { GetAllJobPostDto } from './dto/get-all-job-post.dto';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { ManageJobPostStatusDto } from './dto/manage-job-post-status.dto';
import { ToggleArchiveDto } from './dto/toggle-archive.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class JobPostService {
    private readonly jobPostRepo;
    private readonly userRepo;
    private readonly designationRepo;
    private readonly jobTypeRepo;
    private readonly eventEmitter;
    constructor(jobPostRepo: Repository<JobPost>, userRepo: Repository<User>, designationRepo: Repository<Designation>, jobTypeRepo: Repository<EmploymentType>, eventEmitter: EventEmitter2);
    create(createJobPostDto: CreateJobPostDto, currentUser: User): Promise<JobPost>;
    findAll(getAllJobPostDto: GetAllJobPostDto, currentUser: User): Promise<import("nestjs-typeorm-paginate").Pagination<JobPost, import("nestjs-typeorm-paginate").IPaginationMeta>>;
    findOne({ id }: ParamIdDto, currentUser: User): Promise<JobPost>;
    update({ id }: ParamIdDto, currentUser: User, updateJobPostDto: UpdateJobPostDto): Promise<JobPost>;
    toggleArchive({ id }: ParamIdDto, toggleArchiveDto: ToggleArchiveDto, currentUser: User): Promise<JobPost>;
    manageStatus({ id }: ParamIdDto, manageJobPostStatusDto: ManageJobPostStatusDto, currentUser: User): Promise<JobPost>;
    remove({ id }: ParamIdDto, currentUser: User): Promise<void>;
}
