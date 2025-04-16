import { JobPostService } from './job-post.service';
import { CreateJobPostDto } from './dto/create-job-post.dto';
import { UpdateJobPostDto } from './dto/update-job-post.dto';
import { User } from '../users/entities/user.entity';
import { GetAllJobPostDto } from './dto/get-all-job-post.dto';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { ManageJobPostStatusDto } from './dto/manage-job-post-status.dto';
import { ToggleArchiveDto } from './dto/toggle-archive.dto';
export declare class JobPostController {
    private readonly jobPostService;
    constructor(jobPostService: JobPostService);
    create(createJobPostDto: CreateJobPostDto, currentUser: User): Promise<IResponse>;
    findAll(getAllJobPostDto: GetAllJobPostDto, currentUser: User): Promise<IResponse>;
    findOne(paramIdDto: ParamIdDto, currentUser: User): Promise<IResponse>;
    update(paramIdDto: ParamIdDto, currentUser: User, updateJobPostDto: UpdateJobPostDto): Promise<IResponse>;
    toggleArchive(paramDto: ParamIdDto, toggleArchiveDto: ToggleArchiveDto, user: User): Promise<IResponse>;
    manage_status(paramDto: ParamIdDto, manageJobPostStatusDto: ManageJobPostStatusDto, user: User): Promise<IResponse>;
    remove(paramIdDto: ParamIdDto, currentUser: User): Promise<IResponse>;
}
