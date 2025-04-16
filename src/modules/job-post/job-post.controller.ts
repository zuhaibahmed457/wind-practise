import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JobPostService } from './job-post.service';
import { CreateJobPostDto } from './dto/create-job-post.dto';
import { UpdateJobPostDto } from './dto/update-job-post.dto';
import { FormDataRequest } from 'nestjs-form-data';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User, UserRole } from '../users/entities/user.entity';
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { RolesDecorator } from 'src/shared/decorators/roles.decorator';
import { GetAllJobPostDto } from './dto/get-all-job-post.dto';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { ManageJobPostStatusDto } from './dto/manage-job-post-status.dto';
import { textCapitalize } from 'src/utils/text-capitalize';
import { ToggleArchiveDto } from './dto/toggle-archive.dto';

@Controller('job-post')
@UseGuards(AuthenticationGuard, RolesGuard)
export class JobPostController {
  constructor(private readonly jobPostService: JobPostService) {}

  @Post()
  @RolesDecorator(UserRole.ORGANIZATION)
  @FormDataRequest()
  async create(
    @Body() createJobPostDto: CreateJobPostDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    const jobPost = await this.jobPostService.create(
      createJobPostDto,
      currentUser,
    );
    return {
      message: 'Job Post created successfully',
      details: jobPost,
    };
  }

  @Get()
  async findAll(
    @Query() getAllJobPostDto: GetAllJobPostDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    const { items, meta } = await this.jobPostService.findAll(
      getAllJobPostDto,
      currentUser,
    );
    return {
      message: 'Posted jobs feteched succesfully',
      details: items,
      extra: meta,
    };
  }

  @Get(':id')
  async findOne(
    @Param() paramIdDto: ParamIdDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    const jobPost = await this.jobPostService.findOne(paramIdDto, currentUser);
    return {
      message: 'Posted job feteched succesfully',
      details: jobPost,
    };
  }

  @Patch(':id')
  @RolesDecorator(UserRole.ORGANIZATION)
  @FormDataRequest()
  async update(
    @Param() paramIdDto: ParamIdDto,
    @CurrentUser() currentUser: User,
    @Body() updateJobPostDto: UpdateJobPostDto,
  ): Promise<IResponse> {
    const jobPost = await this.jobPostService.update(
      paramIdDto,
      currentUser,
      updateJobPostDto,
    );
    return {
      message: 'Job post updated successfully',
      details: jobPost,
    };
  }

  @Patch('toggle-archive/:id')
  @RolesDecorator(UserRole.ORGANIZATION)
  @FormDataRequest()
  async toggleArchive(
    @Param() paramDto: ParamIdDto,
    @Body() toggleArchiveDto: ToggleArchiveDto,
    @CurrentUser() user: User,
  ): Promise<IResponse> {
    const updatedJobPost = await this.jobPostService.toggleArchive(
      paramDto,
      toggleArchiveDto,
      user,
    );
    return {
      message: `${textCapitalize(toggleArchiveDto.is_archive === true ? 'archived' : 'unarchived')} job post successfully`,
      details: updatedJobPost,
    };
  }

  @Patch('manage-status/:id')
  @RolesDecorator(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @FormDataRequest()
  async manage_status(
    @Param() paramDto: ParamIdDto,
    @Body() manageJobPostStatusDto: ManageJobPostStatusDto,
    @CurrentUser() user: User,
  ): Promise<IResponse> {
    const updatedJobPost = await this.jobPostService.manageStatus(
      paramDto,
      manageJobPostStatusDto,
      user,
    );
    return {
      message: `${textCapitalize(manageJobPostStatusDto.status)} successfully`,
      details: updatedJobPost,
    };
  }

  @Delete(':id')
  @RolesDecorator(UserRole.ORGANIZATION)
  async remove(
    @Param() paramIdDto: ParamIdDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    await this.jobPostService.remove(paramIdDto, currentUser);
    return {
      message: 'Job post deleted successfully',
    };
  }
}
