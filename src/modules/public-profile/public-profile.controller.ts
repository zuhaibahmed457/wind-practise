import { Controller, Get, Param } from '@nestjs/common';
import { PublicProfileService } from './public-profile.service';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { IResponse } from 'src/shared/interfaces/response.interface';

@Controller('public-profile')
export class PublicProfileController {
  constructor(private readonly publicProfileService: PublicProfileService) {}

  @Get(':id')
  async getPublicProfile(@Param() paramIdDto: ParamIdDto): Promise<IResponse> {
    const userProfile =
      await this.publicProfileService.viewPublicProfile(paramIdDto);
    return {
      message: 'Profile fetched successfully',
      details: userProfile,
    };
  }
}
