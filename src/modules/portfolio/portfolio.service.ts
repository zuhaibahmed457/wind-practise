import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { User, UserRole } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Portfolio } from './entities/portfolio.entity';
import { IsNull, Repository } from 'typeorm';
import { ProfileDetails } from '../profile-details/entities/profile-details.entity';
import { UserS3Paths } from 'src/static/s3-paths';
import { GetALLPortfolioDto } from './dto/get-all-portfoli.dto';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { MediaService } from '../media/media.service';
import { UploadMediaDto } from './dto/upload-media.dto';
import { EntityType, Media } from '../media/entities/media.entity';
import { PortfolioMediaValidation } from './validation/portfolio-media.validation';
import { DeletePortfolioMediaDto } from './dto/delete-portfolio-media.dto';
import { GetPortfolioDto } from './dto/get-portfolio.dto';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(Portfolio)
    private readonly portfolioRepo: Repository<Portfolio>,
    @InjectRepository(ProfileDetails)
    private readonly profileDetailsRepo: Repository<ProfileDetails>,
    @InjectRepository(Media) private readonly mediaRepo: Repository<Media>,
    private readonly mediaService: MediaService,
  ) {}

  async create(currentUser: User, createPortfolioDto: CreatePortfolioDto) {
    const profileDetails = await this.profileDetailsRepo.findOne({
      where: {
        user: {
          id: currentUser?.id,
        },
      },
    });

    if (!profileDetails)
      throw new NotFoundException('Profile Details not found');

    const portfolio = this.portfolioRepo.create({
      ...createPortfolioDto,
      profile_details: profileDetails,
    });

    return await portfolio.save();
  }

  async uploadMedia(
    { id }: ParamIdDto,
    uploadMediaDto: UploadMediaDto,
    currentUser: User,
  ) {
    const { file } = uploadMediaDto;

    const portfolio = await this.portfolioRepo.findOne({
      where: {
        id,
        deleted_at: IsNull(),
        profile_details: {
          user: {
            id: currentUser?.id,
          },
        },
      },
    });

    if (!portfolio) throw new NotFoundException('Portfolio not found');

    const fileType = file.mimeType.split('/')[0];
    let folder_path: UserS3Paths;

    await PortfolioMediaValidation(
      fileType,
      id,
      EntityType.PORTFOLIO,
      this.mediaRepo,
    );

    if (fileType === 'video') {
      folder_path = UserS3Paths.PORTFOLIO_VIDEO;
    } else if (fileType === 'image') {
      folder_path = UserS3Paths.PORTFOLIO_IMAGE;
    }

    const payload = {
      file,
      folder_path,
      entity_id: id,
      entity_type: EntityType.PORTFOLIO,
    };

    return await this.mediaService.createMedia(payload);
  }

  async findAll(currentUser: User, getALLPortfolioDto: GetALLPortfolioDto) {
    const { page, per_page, search, project_duration, profile_details_id } =
      getALLPortfolioDto;

    const query = this.portfolioRepo
      .createQueryBuilder('portfolio')
      .leftJoinAndSelect('portfolio.profile_details', 'profile')
      .leftJoin('profile.user', 'profile_user')
      .leftJoinAndMapMany(
        'portfolio.media',
        Media,
        'media',
        'media.entity_id::uuid = portfolio.id AND media.entity_type = :entity_type',
        { entity_type: EntityType.PORTFOLIO },
      )
      .where('profile_user.id = :user_id AND portfolio.deleted_at IS NULL', {
        user_id: currentUser?.id,
      });

    if (profile_details_id) {
      query.where('profile.id = :profile_details_id', { profile_details_id });
    }

    if (search) {
      query.andWhere(
        '(portfolio.project_name ILIKE :search OR portfolio.industry ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (project_duration) {
      query.andWhere('portfolio.project_duration = :project_duration', {
        project_duration,
      });
    }

    const paginationOptions: IPaginationOptions = {
      page: page,
      limit: per_page,
    };

    return await paginate(query, paginationOptions);
  }

  async findOne({ id }: ParamIdDto, currentUser: User) {
    const portfolio = await this.portfolioRepo
      .createQueryBuilder('portfolio')
      .leftJoinAndSelect('portfolio.profile_details', 'profile')
      .leftJoinAndSelect('profile.user', 'user')
      .leftJoinAndMapMany(
        'portfolio.media',
        Media,
        'media',
        'media.entity_id::uuid = portfolio.id AND media.entity_type = :entity_type',
        { entity_type: EntityType.PORTFOLIO },
      )
      .where('portfolio.id = :id AND portfolio.deleted_at IS NULL', { id })
      .getOne();

    if (!portfolio) throw new NotFoundException('Portfolio not found');

    if (
      [UserRole.TECHNICIAN].includes(currentUser?.role) &&
      portfolio?.profile_details?.user?.id !== currentUser?.id
    ) {
      throw new ForbiddenException('You are not able to view this portfolio');
    }

    return portfolio;
  }

  async update(
    { id }: ParamIdDto,
    currentUser: User,
    updatePortfolioDto: UpdatePortfolioDto,
  ) {
    const portfolio = await this.portfolioRepo.findOne({
      where: {
        id,
        profile_details: {
          user: {
            id: currentUser?.id,
          },
        },
      },
    });

    if (!portfolio) throw new NotFoundException('Portfolio not found');

    Object.assign(portfolio, updatePortfolioDto);
    return await portfolio.save();
  }

  async deleteMediaFile(deletePortfolioMediaDto: DeletePortfolioMediaDto) {
    const media = await this.mediaRepo.findOne({
      where: {
        id: deletePortfolioMediaDto?.id,
        entity_id: deletePortfolioMediaDto?.portfolio_id,
      },
    });

    if (!media) throw new NotFoundException('Media not found');

    await this.mediaService.deleteMedia({ id: media?.id });
  }

  async remove({ id }: ParamIdDto, currentUser: User) {
    const portfolio = await this.portfolioRepo.findOne({
      where: {
        id,
        profile_details: {
          user: {
            id: currentUser?.id,
          },
        },
      },
    });

    if (!portfolio) throw new NotFoundException('Portfolio not found');

    await this.mediaService.deleteMultipleFiles({ id: portfolio?.id });

    await this.portfolioRepo.delete(portfolio?.id);
  }
}
