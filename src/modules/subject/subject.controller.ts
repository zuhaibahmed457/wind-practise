import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { RolesDecorator } from 'src/shared/decorators/roles.decorator';
import { UserRole } from 'src/modules/users/entities/user.entity';
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { FormDataRequest } from 'nestjs-form-data';

@Controller('subject')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Post()
  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @FormDataRequest()
  async create(@Body() createSubjectDto: CreateSubjectDto) {
    const subject = await this.subjectService.create(createSubjectDto);
    return { message: 'Subject created successfully', details: subject };
  }

  @Get()
  async findAll(@Query() getAllDto: GetAllDto) {
    const { items, meta } = await this.subjectService.findAll(getAllDto);
    return {
      message: 'Subjects fetched successfully',
      details: items,
      extra: meta,
    };
  }

  @Get(':id')
  async findOne(@Param() paramIdDto: ParamIdDto) {
    const subject = await this.subjectService.findOne(paramIdDto);
    return { message: 'Subject fetched successfully', details: subject };
  }

  @Patch(':id')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @FormDataRequest()
  async update(
    @Param() paramIdDto: ParamIdDto,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ) {
    const subject = await this.subjectService.update(
      paramIdDto,
      updateSubjectDto,
    );
    return { message: 'Subject updated successfully', details: subject };
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async remove(@Param() paramIdDto: ParamIdDto) {
    await this.subjectService.remove(paramIdDto);
    return { message: 'Subject deleted successfully' };
  }
}
