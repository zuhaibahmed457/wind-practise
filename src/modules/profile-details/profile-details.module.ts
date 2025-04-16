import { Module } from '@nestjs/common';
import { ProfileDetailsService } from './profile-details.service';
import { ProfileDetailsController } from './profile-details.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { ProfileDetails } from './entities/profile-details.entity';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, ProfileDetails]), SharedModule],
  controllers: [ProfileDetailsController],
  providers: [ProfileDetailsService],
})
export class ProfileDetailsModule {}
