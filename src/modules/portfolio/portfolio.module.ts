import { Module } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Portfolio } from './entities/portfolio.entity';
import { SharedModule } from 'src/shared/shared.module';
import { ProfileDetails } from '../profile-details/entities/profile-details.entity';
import { MediaModule } from '../media/media.module';
import { Media } from '../media/entities/media.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Portfolio, ProfileDetails, Media]),
    MediaModule,
    SharedModule,
  ],
  controllers: [PortfolioController],
  providers: [PortfolioService],
})
export class PortfolioModule {}
