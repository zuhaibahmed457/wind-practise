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
import { DesignationService } from './designation.service';
import { CreateDesignationDto } from './dto/create-designation.dto';
import { UpdateDesignationDto } from './dto/update-designation.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User, UserRole } from '../users/entities/user.entity';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { RolesDecorator } from 'src/shared/decorators/roles.decorator';
import { GetAllDesignationDto } from './dto/get-all-designation.dto';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { FormDataRequest } from 'nestjs-form-data';
import { ManageStatusDto } from 'src/modules/users/dto/manage-status-dto';
import { textCapitalize } from 'src/utils/text-capitalize';
import { DesignationManageStatusDto } from './dto/designation-status.dto';

@Controller('designation')
@UseGuards(AuthenticationGuard, RolesGuard)
@RolesDecorator(UserRole.ORGANIZATION)
export class DesignationController {
  constructor(private readonly designationService: DesignationService) {}

  @Post('create')
  @FormDataRequest()
  async create(
    @Body() createDesignationDto: CreateDesignationDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    const designation = await this.designationService.create(
      createDesignationDto,
      currentUser,
    );
    return {
      message: 'Designation created successfully',
      details: designation,
    };
  }

  @Get()
  async findAll(
    @Query() getAllDesignationDto: GetAllDesignationDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    const { items, meta } = await this.designationService.findAll(
      getAllDesignationDto,
      currentUser,
    );
    return {
      message: 'Designations fetched successfully',
      details: items,
      extra: meta,
    };
  }

  @Get(':id')
  async findOne(
    @Param() paramIdDto: ParamIdDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    const designation = await this.designationService.findOne(
      paramIdDto,
      currentUser,
    );
    return {
      message: 'Designation fetched successfully',
      details: designation,
    };
  }

  @Patch(':id')
  @FormDataRequest()
  async update(
    @Param() paramIdDto: ParamIdDto,
    @Body() updateDesignationDto: UpdateDesignationDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    const updatedDesignation = await this.designationService.update(
      paramIdDto,
      updateDesignationDto,
      currentUser,
    );
    return {
      message: 'Designation updated successfully',
      details: updatedDesignation,
    };
  }

  @Patch('manage-status/:id')
  @FormDataRequest()
  async manage_status(
    @Param() paramDto: ParamIdDto,
    @Body() manageStatusDto: DesignationManageStatusDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    const updatedDesignation = await this.designationService.manageStatus(
      paramDto,
      manageStatusDto,
      currentUser,
    );
    return {
      message: `${textCapitalize(manageStatusDto.status)} successfully`,
      details: updatedDesignation,
    };
  }

  @Delete(':id')
  async remove(
    @Param() paramIdDto: ParamIdDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    await this.designationService.remove(paramIdDto.id, currentUser);
    return {
      message: 'Designation deleted successfully',
      details: null,
    };
  }
}
