import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  Patch,
} from '@nestjs/common';
import { JobApplicantService } from './job_applicant.service';
import { ApplyJobApplicantDto } from './dto/apply-job_applicant.dto';
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { RolesDecorator } from 'src/shared/decorators/roles.decorator';
import { User, UserRole } from '../users/entities/user.entity';
import { FormDataRequest } from 'nestjs-form-data';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { GetAllApplyJobDto } from './dto/get-all-apply-job.dto';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { GetAllApplicantsDto } from './dto/get-all-applicants.dto';
import { ManageJobApplicantStatusDto } from './dto/manage-job-applicant-status.dto';
import { textCapitalize } from 'src/utils/text-capitalize';

@Controller('job-applicant')
@UseGuards(AuthenticationGuard, RolesGuard)
export class JobApplicantController {
  constructor(private readonly jobApplicantService: JobApplicantService) {}

  @Post('apply')
  @RolesDecorator(UserRole.TECHNICIAN)
  @FormDataRequest()
  async applyJob(
    @Body() applyJobApplicantDto: ApplyJobApplicantDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    const appliedJob = await this.jobApplicantService.applyJob(
      applyJobApplicantDto,
      currentUser,
    );
    return {
      message: 'Applied successfully',
      details: appliedJob,
    };
  }

  @Get('applied-jobs')
  @RolesDecorator(UserRole.TECHNICIAN)
  async getAllAppliedJobs(
    @Query() getAllApplyJobDto: GetAllApplyJobDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    const { items, meta } = await this.jobApplicantService.getAllAppliedJobs(
      getAllApplyJobDto,
      currentUser,
    );
    return {
      message: 'Applied Jobs fetched successfully',
      details: items,
      extra: meta,
    };
  }

  @Get('applied-job/:id')
  @RolesDecorator(UserRole.TECHNICIAN)
  async getAppliedJob(
    @Param() paramIdDto: ParamIdDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    const appliedJob = await this.jobApplicantService.getAppliedJob(
      paramIdDto,
      currentUser,
    );
    return {
      message: 'Applied Job fetched successfully',
      details: appliedJob,
    };
  }

  @Get()
  @RolesDecorator(UserRole.ORGANIZATION)
  async findAll(
    @Query() getAllApplicantsDto: GetAllApplicantsDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    const { items, meta } = await this.jobApplicantService.findAll(
      getAllApplicantsDto,
      currentUser,
    );
    return {
      message: 'Job Applicants fetched successfully',
      details: items,
      extra: meta,
    };
  }

  @Get(':id')
  @RolesDecorator(UserRole.ORGANIZATION)
  async findOne(
    @Param() paramIdDto: ParamIdDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    const applicantDetails = await this.jobApplicantService.findOne(
      paramIdDto,
      currentUser,
    );
    return {
      message: 'Applicants Details fetched successfully',
      details: applicantDetails,
    };
  }

  @Patch('manage-status/:id')
  @RolesDecorator(UserRole.ORGANIZATION)
  @FormDataRequest()
  async manageStatus(
    @Param() paramIdDto: ParamIdDto,
    @Body() manageJobApplicantStatusDto: ManageJobApplicantStatusDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    const updateJobApplicantStatus =
      await this.jobApplicantService.manageStatus(
        paramIdDto,
        manageJobApplicantStatusDto,
        currentUser,
      );
    return {
      message: `${textCapitalize(manageJobApplicantStatusDto.status)} successfully`,
      details: updateJobApplicantStatus,
    };
  }
}
