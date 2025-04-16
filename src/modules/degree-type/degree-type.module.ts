import { Module } from '@nestjs/common';
import { DegreeTypeService } from './degree-type.service';
import { DegreeTypeController } from './degree-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DegreeType } from './entities/degree-type.entity';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([DegreeType]), SharedModule],
  controllers: [DegreeTypeController],
  providers: [DegreeTypeService],
})
export class DegreeTypeModule {}
