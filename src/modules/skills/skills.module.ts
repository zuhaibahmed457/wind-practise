import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Skill } from './entities/skill.entity';
import { SkillController } from './skills.controller';
import { SkillService } from './skills.service';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([Skill]), SharedModule],
  controllers: [SkillController],
  providers: [SkillService],
})
export class SkillsModule {}
