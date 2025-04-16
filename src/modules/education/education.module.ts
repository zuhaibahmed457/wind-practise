import { Module } from '@nestjs/common';
import { EducationService } from './education.service';
import { EducationController } from './education.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Education } from './entities/education.entity';
import { SharedModule } from 'src/shared/shared.module';
import { DegreeType } from '../degree-type/entities/degree-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Education, DegreeType]), SharedModule],
  controllers: [EducationController],
  providers: [EducationService],
})
export class EducationModule {}
