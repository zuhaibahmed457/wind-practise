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
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { GetAllDto } from 'src/shared/dtos/getAll.dto';

@UseGuards(AuthenticationGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async findAll(
    @Query() getAllDto: GetAllDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    const { items, meta } = await this.notificationsService.findAll(
      getAllDto,
      currentUser,
    );
    return {
      message: 'Notifications fetched successfully',
      details: items,
      extra: meta,
    };
  }

  @Get('unread-notifications')
  async unReadNotificationCount(
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    const notificationCounts =
      await this.notificationsService.unReadNotificationCount(currentUser);
    return {
      message: 'Numbers of unread notifications fetched successfully',
      details: notificationCounts,
    };
  }

  @Get(':id')
  async findOne(
    @Param() paramIdDto: ParamIdDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    const userNotification = await this.notificationsService.findOne(
      paramIdDto,
      currentUser,
    );
    return {
      message: 'Notification fetched successfully',
      details: userNotification,
    };
  }

  @Patch('read-all-notifications')
  async readALLNotification(
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    await this.notificationsService.readALLNotification(currentUser);
    return {
      message: 'All Notifications Read successfully',
    };
  }

  @Patch('read-notification/:id')
  async readNotification(
    @Param() paramIdDto: ParamIdDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    const userNotification = await this.notificationsService.readNotification(
      paramIdDto,
      currentUser,
    );
    return {
      message: 'Notification Read successfully',
      details: userNotification,
    };
  }
}
