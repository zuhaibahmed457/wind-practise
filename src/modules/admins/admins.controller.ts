import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard';
import { RolesDecorator } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User, UserRole } from '../users/entities/user.entity';
import { AdminsService } from './admins.service';
import { SubscriptionStatsDto } from './dto/subscription-stats.dto';
import { RevenueStatsDto } from './dto/revenue-stats.dto';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Get('dashboard/stats')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  async dashboard(@CurrentUser() user: User): Promise<IResponse> {
    const data = await this.adminsService.dashboard(user);
    return {
      message: 'Dashboard fetched successfully',
      details: data,
    };
  }

  @Get('dashboard/subscriptions')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  async subscriptions(
    @CurrentUser() user: User,
    @Query() subscriptionStatsDto: SubscriptionStatsDto,
  ): Promise<IResponse> {
    const data = await this.adminsService.subscriptions(
      user,
      subscriptionStatsDto,
    );
    return {
      message: 'Dashboard fetched successfully',
      details: data,
    };
  }

  @Get('dashboard/revenue')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  async revenue(
    @CurrentUser() user: User,
    @Query() revenueStatsDto: RevenueStatsDto,
  ): Promise<IResponse> {
    const data = await this.adminsService.revenue(user, revenueStatsDto);
    return {
      message: 'Dashboard fetched successfully',
      details: data,
    };
  }
}
