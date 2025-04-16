import { PartialType } from '@nestjs/mapped-types';
import { CreateProfileDetailDto } from './create-profile-detail.dto';

export class UpdateProfileDetailDto extends PartialType(CreateProfileDetailDto) {}
