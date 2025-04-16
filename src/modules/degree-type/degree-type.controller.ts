import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { FormDataRequest } from 'nestjs-form-data';
import { DegreeTypeService } from './degree-type.service';
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { UserRole } from '../users/entities/user.entity';
import { RolesDecorator } from 'src/shared/decorators/roles.decorator';
import { CreateDegreeTypeDto } from './dto/create-degree-type.dto';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { UpdateDegreeTypeDto } from './dto/update-degree-type.dto';
import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';

@Controller('degree-type')
export class DegreeTypeController {
  constructor(private readonly degreeTypeService: DegreeTypeService) {}

  @Post('create')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @FormDataRequest()
  async create(
    @Body() createDegreeTypeDto: CreateDegreeTypeDto,
  ): Promise<IResponse> {
    const degreeType = await this.degreeTypeService.create(createDegreeTypeDto);
    return {
      message: 'Degree type created successfully',
      details: degreeType,
    };
  }

  @Get('all')
  async findAll(@Query() getAllDto: GetAllDto): Promise<IResponse> {
    const {items, meta} = await this.degreeTypeService.findAll(getAllDto);
    return {
      message: 'Degree types fetched successfully',
      details: items,
      extra: meta
    };
  }

  @Get(':id')
  async findOne(@Param() paramIdDto: ParamIdDto): Promise<IResponse> {
    const degreeType = await this.degreeTypeService.findOne(paramIdDto);
    return {
      message: 'Degree type fetched successfully',
      details: degreeType,
    };
  }

  @Patch(':id')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @FormDataRequest()
  async update(
    @Param()@Param() paramIdDto: ParamIdDto,
    @Body() updateDegreeTypeDto: UpdateDegreeTypeDto,
  ): Promise<IResponse> {
    const updatedDegreeType = await this.degreeTypeService.update(
      paramIdDto,
      updateDegreeTypeDto,
    );
    return {
      message: 'Degree type updated successfully',
      details: updatedDegreeType,
    };
  }
}
