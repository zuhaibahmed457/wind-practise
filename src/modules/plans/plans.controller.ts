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
import { PlansService } from './plans.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { RolesDecorator } from 'src/shared/decorators/roles.decorator';
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { User, UserRole } from '../users/entities/user.entity';
import { GetAllPlansDto } from './dto/get-all-plans.dto';
import { OptionalAuthGuard } from 'src/shared/guards/optionalAuthentication.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';

@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Post()
  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  async create(@Body() createPlanDto: CreatePlanDto): Promise<IResponse> {
    const plan = await this.plansService.create(createPlanDto);

    return {
      message: 'Plan created successfully',
      details: plan,
    };
  }

  @Get()
  @UseGuards(OptionalAuthGuard)
  async findAll(
    @CurrentUser() currentUser: User,
    @Query() getAllPlansDto: GetAllPlansDto,
  ): Promise<IResponse> {
    const { items, meta } = await this.plansService.findAll(
      currentUser,
      getAllPlansDto,
    );

    return {
      message: 'Plans fetched successfully',
      details: items,
      extra: meta,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.plansService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  async update(
    @Param() paramIdDto: ParamIdDto,
    @Body() updatePlanDto: UpdatePlanDto,
  ): Promise<IResponse> {
    const plan = await this.plansService.update(paramIdDto, updatePlanDto);

    return {
      message: 'Plan updated successfully',
      details: plan,
    };
  }

  @Patch('toggle-status/:id')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  async toggleStatus(@Param() paramIdDto: ParamIdDto) {
    return await this.plansService.toggleStatus(paramIdDto);
  }
}
