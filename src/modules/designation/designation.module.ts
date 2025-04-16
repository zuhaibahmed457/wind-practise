import { Module } from '@nestjs/common';
import { DesignationService } from './designation.service';
import { DesignationController } from './designation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Designation } from './entities/designation.entity';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([Designation]), SharedModule],
  controllers: [DesignationController],
  providers: [DesignationService],
})
  export class DesignationModule {}
