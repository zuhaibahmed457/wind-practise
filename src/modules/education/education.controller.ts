import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { FormDataRequest } from 'nestjs-form-data';
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard';
import { RolesDecorator } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { User, UserRole } from '../users/entities/user.entity';
import { EducationService } from './education.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { UpdateEducationDto } from './dto/update-education.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { GetAllEducationDto } from './dto/get-all-education.dto';

@Controller('education')
@UseGuards(AuthenticationGuard, RolesGuard)
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Post('create')
  @RolesDecorator(UserRole.TECHNICIAN)
  @FormDataRequest()
  async create(
    @Body() createEducationDto: CreateEducationDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    const education = await this.educationService.create(createEducationDto, currentUser);
    return {
      message: 'Education added successfully',
      details: education,
    };
  }

  @Get('all')
  @RolesDecorator(UserRole.TECHNICIAN, UserRole.ORGANIZATION)
  async findAll(
    @Query() getAllEducationDto: GetAllEducationDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    const { items, meta } = await this.educationService.findAll(getAllEducationDto, currentUser);
    return {
      message: 'Education fetched successfully',
      details: items,
      extra: meta,
    };
  }

  @Get(':id')
  @RolesDecorator(UserRole.TECHNICIAN)
  async findOne(
    @Param() paramIdDto: ParamIdDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    const education = await this.educationService.findOne(paramIdDto, currentUser);
    return {
      message: 'Education retrieved successfully',
      details: education,
    };
  }

  @Patch(':id')
  @RolesDecorator(UserRole.TECHNICIAN)
  @FormDataRequest()
  async update(
    @Param() paramIdDto: ParamIdDto,
    @Body() updateEducationDto: UpdateEducationDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    const updatedEducation = await this.educationService.update(
      paramIdDto,
      updateEducationDto,
      currentUser,
    );
    return {
      message: 'Education updated successfully',
      details: updatedEducation,
    };
  }

  @Delete(':id')
  @RolesDecorator(UserRole.TECHNICIAN)
  async remove(
    @Param() paramIdDto: ParamIdDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    await this.educationService.remove(paramIdDto, currentUser);
    return {
      message: 'Education deleted successfully',
    };
  }
}
