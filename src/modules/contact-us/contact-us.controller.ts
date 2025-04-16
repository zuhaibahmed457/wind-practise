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
import { IResponse } from 'src/shared/interfaces/response.interface';
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { RolesDecorator } from 'src/shared/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { ContactUsService } from './contact-us.service';
import { CreateContactUsDto } from './dto/create-contact-us.dto';
import { FormDataRequest } from 'nestjs-form-data';

@Controller('contact-us')
export class ContactUsController {
  constructor(private readonly contactUsService: ContactUsService) {}

  @Post()
  @FormDataRequest()
  async create(
    @Body() createContactUsDto: CreateContactUsDto,
  ): Promise<IResponse> {
    const contact = await this.contactUsService.create(createContactUsDto);
    return {
      message: 'Contact submission created successfully',
      details: contact,
    };
  }

  @Get()
  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async findAll(@Query() getAllDto: GetAllDto): Promise<IResponse> {
    const { items, meta } = await this.contactUsService.findAll(getAllDto);
    return {
      message: 'Contact submissions fetched successfully',
      details: items,
      extra: meta,
    };
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async findOne(@Param() paramIdDto: ParamIdDto): Promise<IResponse> {
    const contact = await this.contactUsService.findOne(paramIdDto);
    return {
      message: 'Contact submission fetched successfully',
      details: contact,
    };
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async remove(@Param() paramIdDto: ParamIdDto): Promise<IResponse> {
    await this.contactUsService.remove(paramIdDto);
    return {
      message: 'Contact submission deleted successfully',
    };
  }
}
