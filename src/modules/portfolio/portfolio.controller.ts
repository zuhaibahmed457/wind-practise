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
import { PortfolioService } from './portfolio.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User, UserRole } from '../users/entities/user.entity';
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { RolesDecorator } from 'src/shared/decorators/roles.decorator';
import { GetALLPortfolioDto } from './dto/get-all-portfoli.dto';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { FormDataRequest } from 'nestjs-form-data';
import { UploadMediaDto } from './dto/upload-media.dto';
import { DeletePortfolioMediaDto } from './dto/delete-portfolio-media.dto';
import { OptionalAuthGuard } from 'src/shared/guards/optionalAuthentication.guard';
import { AccessRequestGuard } from 'src/shared/guards/access-request.guard';
import { GetOnePortfolioDto } from './dto/get-one-portfolio.dto';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Post()
  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.TECHNICIAN)
  @FormDataRequest()
  async create(
    @Body() createPortfolioDto: CreatePortfolioDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    const portfolio = await this.portfolioService.create(
      currentUser,
      createPortfolioDto,
    );
    return {
      message: 'Portfolio added successfully',
      details: portfolio,
    };
  }

  @Patch('upload/:id')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.TECHNICIAN)
  @FormDataRequest()
  async uploadMedia(
    @Param() paramIdDto: ParamIdDto,
    @Body() uploadMediaDto: UploadMediaDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    const media = await this.portfolioService.uploadMedia(
      paramIdDto,
      uploadMediaDto,
      currentUser,
    );
    return {
      message: 'Media added successfully',
      details: media,
    };
  }

  @Get()
  @UseGuards(OptionalAuthGuard, AccessRequestGuard)
  async findAll(
    @Query() getALLPortfolioDto: GetALLPortfolioDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    const { items, meta } = await this.portfolioService.findAll(
      currentUser,
      getALLPortfolioDto,
    );
    return {
      message: 'Porfolio feteched successfully',
      details: items,
      extra: meta,
    };
  }

  @Get(':id')
  @UseGuards(OptionalAuthGuard, AccessRequestGuard)
  async findOne(
    @Param() paramIdDto: ParamIdDto,
    @Query() getPortfolioDto: GetOnePortfolioDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    const portfolio = await this.portfolioService.findOne(
      paramIdDto,
      currentUser,
    );
    return {
      message: 'Porfolio feteched successfully',
      details: portfolio,
    };
  }

  @Patch(':id')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.TECHNICIAN)
  @FormDataRequest()
  async update(
    @Param() paramIdDto: ParamIdDto,
    @CurrentUser() currentUser: User,
    @Body() updatePortfolioDto: UpdatePortfolioDto,
  ): Promise<IResponse> {
    const portfolio = await this.portfolioService.update(
      paramIdDto,
      currentUser,
      updatePortfolioDto,
    );
    return {
      message: 'Portfolio updated successfully',
      details: portfolio,
    };
  }

  @Delete('media/:id/:portfolio_id')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.TECHNICIAN)
  async deleteMediaFile(
    @Param() deletePortfolioMediaDto: DeletePortfolioMediaDto,
  ): Promise<IResponse> {
    await this.portfolioService.deleteMediaFile(deletePortfolioMediaDto);
    return {
      message: 'File deleted successfully',
    };
  }

  @Delete(':id')
  @RolesDecorator(UserRole.TECHNICIAN)
  async remove(
    @Param() paramIdDto: ParamIdDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    await this.portfolioService.remove(paramIdDto, currentUser);
    return {
      message: 'Portfolio deleted successfully',
    };
  }
}
