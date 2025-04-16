import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { RolesDecorator } from 'src/shared/decorators/roles.decorator';
import { User, UserRole } from '../users/entities/user.entity';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { FormDataRequest } from 'nestjs-form-data';
import { GetAllCertificatesDto } from './dto/get-all-certificates.dto';
import { GetAllCertificateHistoryDto } from './dto/get-all-certificate-history.dto';
import { AccessRequestGuard } from 'src/shared/guards/access-request.guard';
import { OptionalAuthGuard } from 'src/shared/guards/optionalAuthentication.guard';
import { GetOneCertificateDto } from './dto/get-one.certificate.dto';

@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Post()
  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.ORGANIZATION, UserRole.TECHNICIAN)
  @FormDataRequest()
  async create(
    @CurrentUser() currentUser: User,
    @Body() createCertificateDto: CreateCertificateDto,
  ): Promise<IResponse> {
    const certificate = await this.certificatesService.create(
      currentUser,
      createCertificateDto,
    );

    return {
      message: 'Certificate created successfully',
      details: certificate,
    };
  }

  @Get()
  @UseGuards(OptionalAuthGuard, AccessRequestGuard)
  async findAll(
    @Query() getAllCertificatesDto: GetAllCertificatesDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    const { meta, items } = await this.certificatesService.findAll(
      getAllCertificatesDto,
      currentUser,
    );

    return {
      message: 'Certificate fetched successfully',
      details: items,
      extra: meta,
    };
  }

  @Get(':id')
  @UseGuards(OptionalAuthGuard, AccessRequestGuard)
  async findOne(
    @Param() paramIdDto: ParamIdDto,
    @Query() getOneCertificateDto: GetOneCertificateDto,
    @CurrentUser() currentUser: User,
  ) {
    const certificate = await this.certificatesService.findOne(
      paramIdDto,
      currentUser,
    );

    return {
      message: 'Certificate fetched successfully',
      details: certificate,
    };
  }

  @Get('certificate-history/:id')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.ORGANIZATION, UserRole.TECHNICIAN)
  async findCertificateHistory(
    @Param() paramIdDto: ParamIdDto,
    @CurrentUser() currentUser: User,
    @Query() getAllCertificateHistoryDto: GetAllCertificateHistoryDto,
  ) {
    const certificate = await this.certificatesService.getAllCertificateHistory(
      paramIdDto,
      currentUser,
      getAllCertificateHistoryDto,
    );

    return {
      message: 'Certificate fetched successfully',
      details: certificate,
    };
  }

  @Patch(':id')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.ORGANIZATION, UserRole.TECHNICIAN)
  @FormDataRequest()
  async update(
    @Param() paramIdDto: ParamIdDto,
    @CurrentUser() currentUser: User,
    @Body() updateCertificateDto: UpdateCertificateDto,
  ): Promise<IResponse> {
    const certificate = await this.certificatesService.update(
      paramIdDto,
      currentUser,
      updateCertificateDto,
    );

    return {
      message: 'Certificate Updated successfully',
      details: certificate,
    };
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.ORGANIZATION, UserRole.TECHNICIAN)
  async remove(
    @Param() paramIdDto: ParamIdDto,
    @CurrentUser() user: User,
  ): Promise<IResponse> {
    const certificate = await this.certificatesService.remove(paramIdDto, user);

    return {
      message: 'Certificate delete successfully',
      details: certificate,
    };
  }
}
