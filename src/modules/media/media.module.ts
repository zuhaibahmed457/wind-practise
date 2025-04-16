import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';
import { SharedModule } from 'src/shared/shared.module';
import { S3Module } from '../s3/s3.module';


@Module({
  imports: [TypeOrmModule.forFeature([Media]), SharedModule, S3Module],
  providers: [MediaService],
  exports: [MediaService]
})
export class MediaModule {}
