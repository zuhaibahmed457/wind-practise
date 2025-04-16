import { JobApplicantService } from './job_applicant.service';
import { ApplyJobApplicantDto } from './dto/apply-job_applicant.dto';
import { User } from '../users/entities/user.entity';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { GetAllApplyJobDto } from './dto/get-all-apply-job.dto';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { GetAllApplicantsDto } from './dto/get-all-applicants.dto';
import { ManageJobApplicantStatusDto } from './dto/manage-job-applicant-status.dto';
export declare class JobApplicantController {
    private readonly jobApplicantService;
    constructor(jobApplicantService: JobApplicantService);
    applyJob(applyJobApplicantDto: ApplyJobApplicantDto, currentUser: User): Promise<IResponse>;
    getAllAppliedJobs(getAllApplyJobDto: GetAllApplyJobDto, currentUser: User): Promise<IResponse>;
    getAppliedJob(paramIdDto: ParamIdDto, currentUser: User): Promise<IResponse>;
    findAll(getAllApplicantsDto: GetAllApplicantsDto, currentUser: User): Promise<IResponse>;
    findOne(paramIdDto: ParamIdDto, currentUser: User): Promise<IResponse>;
    manageStatus(paramIdDto: ParamIdDto, manageJobApplicantStatusDto: ManageJobApplicantStatusDto, currentUser: User): Promise<IResponse>;
}
