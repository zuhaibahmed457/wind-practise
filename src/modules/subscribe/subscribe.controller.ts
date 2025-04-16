import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SubscribeService } from './subscribe.service';
import { CreateSubscribeDto } from './dto/create-subscribe.dto';
import { UpdateSubscribeDto } from './dto/update-subscribe.dto';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { FormDataRequest } from 'nestjs-form-data';
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { RolesDecorator } from 'src/shared/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('subscribe')
export class SubscribeController {
  constructor(private readonly subscribeService: SubscribeService) {}

  @Post()
  @FormDataRequest()
  async create(@Body() createSubscribeDto: CreateSubscribeDto) {
    await this.subscribeService.create(createSubscribeDto);
    return {
      message: 'Subscribed successfully',
    };
  }

  @Get()
  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async findAll(@Query() getAllDto: GetAllDto): Promise<IResponse> {
    const { items, meta } = await this.subscribeService.findAll(getAllDto);
    return {
      message: 'Subscription fetched successfully',
      details: items,
      extra: meta,
    };
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async findOne(@Param() paramIdDto: ParamIdDto) {
    const subscription = await this.subscribeService.findOne(paramIdDto);
    return {
      message: 'Subscription fetched successfully',
      details: subscription,
    };
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async remove(@Param() paramIdDto: ParamIdDto): Promise<IResponse> {
    await this.subscribeService.remove(paramIdDto);
    return{
      message: 'Subscriber deleted successfully'
    }
  }
}
