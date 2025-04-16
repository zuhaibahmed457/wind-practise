import { Controller, Body, Patch, UseGuards, Get, Query } from '@nestjs/common';
import { ProfileDetailsService } from './profile-details.service';
import { UpdateProfileDetailDto } from './dto/update-profile-detail.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User, UserRole } from '../users/entities/user.entity';
import { FormDataRequest } from 'nestjs-form-data';
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { RolesDecorator } from 'src/shared/decorators/roles.decorator';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { GetAllProfileDetailsDto } from './dto/get-all-profile-details.dto';

@Controller('profile-details')
@UseGuards(AuthenticationGuard, RolesGuard)
export class ProfileDetailsController {
  constructor(private readonly profileDetailsService: ProfileDetailsService) {}

  @Get()
  @RolesDecorator(UserRole.TECHNICIAN, UserRole.ORGANIZATION)
  async findAll(
    @Query() getAllProfileDetailsDto: GetAllProfileDetailsDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    const profileDetails = await this.profileDetailsService.getProfileDetails(
      getAllProfileDetailsDto,
      currentUser,
    );
    return {
      message: 'Profile Details fetched successfully',
      details: profileDetails,
    };
  }

  @Patch()
  @RolesDecorator(UserRole.TECHNICIAN)
  @FormDataRequest()
  async update(
    @Body() updateProfileDetailDto: UpdateProfileDetailDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    const updatedProfileDetails =
      await this.profileDetailsService.updateProfileDetails(
        updateProfileDetailDto,
        currentUser,
      );
    return {
      message: 'Profile Details updated successfully',
      details: updatedProfileDetails,
    };
  }
}
