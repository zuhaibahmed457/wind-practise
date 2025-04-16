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
import { AccessRequestService } from './access-request.service';
import { CreateAccessRequestDto } from './dto/create-access-request.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User, UserRole } from '../users/entities/user.entity';
import { FormDataRequest } from 'nestjs-form-data';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { RolesDecorator } from 'src/shared/decorators/roles.decorator';
import { GetAllAccessRequestDto } from './dto/get-all-access-request.dto';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { ManageAccessRequestDto } from './dto/manage-access-request.dto';
import { textCapitalize } from 'src/utils/text-capitalize';
import { ViewAccessRequestDto } from './dto/view-access-request.dto';

@Controller('access-request')
export class AccessRequestController {
  constructor(private readonly accessRequestService: AccessRequestService) {}

  @Post()
  @FormDataRequest()
  async create(
    @Body() createAccessRequestDto: CreateAccessRequestDto,
  ): Promise<IResponse> {
    const accessRequest = await this.accessRequestService.create(
      createAccessRequestDto,
    );
    return {
      message: `Your request has been successfully submitted and is pending approval.`,
      details: accessRequest,
    };
  }

  @Get('view-request-status')
  @FormDataRequest()
  async viewAccessRequest(
    @Query() viewAccessRequestDto: ViewAccessRequestDto,
  ): Promise<IResponse> {
    const accessRequest = await this.accessRequestService.viewAccessRequest(
      viewAccessRequestDto,
    );
    return {
      message: `Your Access Request Status is ${accessRequest.status}.`,
      details: accessRequest,
    };
  }

  @Get()
  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.TECHNICIAN)
  async findAll(
    @Query() getAllAccessRequestDto: GetAllAccessRequestDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    const { items, meta } = await this.accessRequestService.findAll(
      getAllAccessRequestDto,
      currentUser,
    );
    return {
      message: 'Access requests fetched successfully',
      details: items,
      extra: meta,
    };
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.TECHNICIAN)
  async findOne(
    @Param() paramIdDto: ParamIdDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    const accessRequest = await this.accessRequestService.findOne(
      paramIdDto,
      currentUser,
    );
    return {
      message: 'Access request fetched successfully',
      details: accessRequest,
    };
  }

  @Patch('manage-status/:id')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.TECHNICIAN)
  @FormDataRequest()
  async manageStatus(
    @Param() paramIdDto: ParamIdDto,
    @CurrentUser() currentUser: User,
    @Body() manageAccessRequestDto: ManageAccessRequestDto,
  ): Promise<IResponse> {
    const updatedAccessRequestStatus =
      await this.accessRequestService.manageStatus(
        paramIdDto,
        currentUser,
        manageAccessRequestDto,
      );
    return {
      message: `${textCapitalize(manageAccessRequestDto.status)} successfully`,
      details: updatedAccessRequestStatus,
    };
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.TECHNICIAN)
  async remove(
    @Param() paramIdDto: ParamIdDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    const accessRequest = await this.accessRequestService.remove(
      paramIdDto,
      currentUser,
    );
    return {
      message: 'Access request Deleted successfully',
    };
  }
}
