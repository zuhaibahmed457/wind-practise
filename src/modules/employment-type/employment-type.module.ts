import { Module } from '@nestjs/common';
import { EmploymentTypeService } from './employment-type.service';
import { EmploymentTypeController } from './employment-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmploymentType } from './entities/employment-type.entity';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([EmploymentType]), SharedModule],
  controllers: [EmploymentTypeController],
  providers: [EmploymentTypeService],
})
export class EmploymentTypeModule {}
