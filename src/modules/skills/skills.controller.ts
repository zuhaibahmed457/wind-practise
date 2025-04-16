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
import { SkillService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { GetAllSkillsDto } from './dto/get-all-skills.dto';

@Controller('skill')
@UseGuards(AuthenticationGuard, RolesGuard)
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Post('create')
  @FormDataRequest()
  async create(
    @Body() createSkillDto: CreateSkillDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    const skill = await this.skillService.create(createSkillDto, currentUser);
    return {
      message: 'Skill created successfully',
      details: skill,
    };
  }

  @Get('all')
  @RolesDecorator(UserRole.TECHNICIAN, UserRole.ORGANIZATION)
  async findAll(
    @Query() getAllSkillsDto: GetAllSkillsDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    const { items, meta } = await this.skillService.findAll(
      getAllSkillsDto,
      currentUser,
    );
    return {
      message: 'Skills fetched successfully',
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
    const skill = await this.skillService.findOne(paramIdDto, currentUser);
    return {
      message: 'Skill fetched successfully',
      details: skill,
    };
  }

  @Patch(':id')
  @RolesDecorator(UserRole.TECHNICIAN)
  @FormDataRequest()
  async update(
    @Param() paramIdDto: ParamIdDto,
    @Body() updateSkillDto: UpdateSkillDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    const updatedSkill = await this.skillService.update(
      paramIdDto,
      updateSkillDto,
      currentUser,
    );
    return {
      message: 'Skill updated successfully',
      details: updatedSkill,
    };
  }

  @Delete(':id')
  @RolesDecorator(UserRole.TECHNICIAN)
  async remove(
    @Param() paramIdDto: ParamIdDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    await this.skillService.remove(paramIdDto, currentUser);
    return {
      message: 'Skill deleted successfully',
    };
  }
}
