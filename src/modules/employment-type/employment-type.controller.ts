import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EmploymentTypeService } from './employment-type.service';
import { CreateEmploymentTypeDto } from './dto/create-employment-type.dto';
import { UpdateEmploymentTypeDto } from './dto/update-employment-type.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User, UserRole } from '../users/entities/user.entity';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { GetAllEmploymentTypeDto } from './dto/get-all-employment-type.dto';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { FormDataRequest } from 'nestjs-form-data';
import { EmploymentTypeManageStatusDto } from './dto/manage-status.dto';
import { textCapitalize } from 'src/utils/text-capitalize';
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { RolesDecorator } from 'src/shared/decorators/roles.decorator';

@Controller('employment-type')
export class EmploymentTypeController {
  constructor(private readonly employmentTypeService: EmploymentTypeService) {}

  @Post()
  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @FormDataRequest()
  async create(
    @Body() createEmploymentTypeDto: CreateEmploymentTypeDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    const employmentType = await this.employmentTypeService.create(
      createEmploymentTypeDto,
      currentUser,
    );
    return {
      message: 'Employment type created successfully',
      details: employmentType,
    };
  }

  @Get()
  async findAll(
    @Query() getAllEmploymentTypeDto: GetAllEmploymentTypeDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    const { items, meta } = await this.employmentTypeService.findAll(
      getAllEmploymentTypeDto,
    );
    return {
      message: 'Employment types fetched successfully',
      details: items,
      extra: meta,
    };
  }

  @Get(':id')
  async findOne(@Param() paramIdDto: ParamIdDto): Promise<IResponse> {
    const employmentType = await this.employmentTypeService.findOne(paramIdDto);
    return {
      message: 'Employment type fetched successfully',
      details: employmentType,
    };
  }

  @Patch(':id')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @FormDataRequest()
  async update(
    @Param() paramIdDto: ParamIdDto,
    @Body() updateEmploymentTypeDto: UpdateEmploymentTypeDto,
  ): Promise<IResponse> {
    const employmentType = await this.employmentTypeService.update(
      paramIdDto,
      updateEmploymentTypeDto,
    );
    return {
      message: 'Employment type updated successfully',
      details: employmentType,
    };
  }

  @Patch('manage-status/:id')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @FormDataRequest()
  async manage_status(
    @Param() paramDto: ParamIdDto,
    @Body() manageStatusDto: EmploymentTypeManageStatusDto,
  ): Promise<IResponse> {
    const updatedDesignation = await this.employmentTypeService.manageStatus(
      paramDto,
      manageStatusDto,
    );
    return {
      message: `${textCapitalize(manageStatusDto.status)} successfully`,
      details: updatedDesignation,
    };
  }
}
