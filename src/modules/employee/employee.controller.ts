import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
  Delete,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { User, UserRole } from '../users/entities/user.entity';
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { RolesDecorator } from 'src/shared/decorators/roles.decorator';
import { FormDataRequest } from 'nestjs-form-data';
import { GetAllEmployeeDto } from './dto/get-all-employee.dto';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { ManageEmployeeStatusDto } from './dto/manage-employee-status.dto';
import { textCapitalize } from 'src/utils/text-capitalize';

@Controller('employee')
@UseGuards(AuthenticationGuard, RolesGuard)
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @FormDataRequest()
  @RolesDecorator(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.ORGANIZATION)
  async create(
    @Body() createProfileDetailsDto: CreateEmployeeDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    const profileDetails = await this.employeeService.create(
      createProfileDetailsDto,
      currentUser,
    );
    return {
      message: 'Employee created successfully',
      details: profileDetails,
    };
  }

  @Get()
  async findAll(
    @Query() getAllEmployeeDto: GetAllEmployeeDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    const { items, meta } = await this.employeeService.findAll(
      getAllEmployeeDto,
      currentUser,
    );
    return {
      message: 'Employee feteched successfully',
      details: items,
      extra: meta,
    };
  }

  @Get(':id')
  async findOne(
    @Param() paramIdDto: ParamIdDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    const employee = await this.employeeService.findOne(
      paramIdDto,
      currentUser,
    );
    return {
      message: 'Employee feteched successfully',
      details: employee,
    };
  }

  @Patch(':id')
  @FormDataRequest()
  async update(
    @Param() paramIdDto: ParamIdDto,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    const updatedEmployee = await this.employeeService.update(
      paramIdDto,
      updateEmployeeDto,
      currentUser,
    );
    return {
      message: 'Employee updated successfully',
      details: updatedEmployee,
    };
  }

  @Patch('manage-status/:id')
  @RolesDecorator(UserRole.ORGANIZATION)
  @FormDataRequest()
  async manage_status(
    @Param() paramDto: ParamIdDto,
    @Body() manageEmployeeStatusDto: ManageEmployeeStatusDto,
    @CurrentUser() user: User,
  ): Promise<IResponse> {
    const updatedJobPost = await this.employeeService.manageStatus(
      paramDto,
      manageEmployeeStatusDto,
      user,
    );
    return {
      message: `${textCapitalize(manageEmployeeStatusDto.status)} successfully`,
      details: updatedJobPost,
    };
  }

  @Delete(':id')
  async delete(
    @Param() paramIdDto: ParamIdDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    await this.employeeService.delete(paramIdDto, currentUser);
    return {
      message: 'Employee Delete successfully',
    };
  }
}
