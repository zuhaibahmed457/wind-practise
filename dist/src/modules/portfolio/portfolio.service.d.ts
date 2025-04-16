import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { User } from '../users/entities/user.entity';
import { Portfolio } from './entities/portfolio.entity';
import { Repository } from 'typeorm';
import { ProfileDetails } from '../profile-details/entities/profile-details.entity';
import { GetALLPortfolioDto } from './dto/get-all-portfoli.dto';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { MediaService } from '../media/media.service';
import { UploadMediaDto } from './dto/upload-media.dto';
import { Media } from '../media/entities/media.entity';
import { DeletePortfolioMediaDto } from './dto/delete-portfolio-media.dto';
export declare class PortfolioService {
    private readonly portfolioRepo;
    private readonly profileDetailsRepo;
    private readonly mediaRepo;
    private readonly mediaService;
    constructor(portfolioRepo: Repository<Portfolio>, profileDetailsRepo: Repository<ProfileDetails>, mediaRepo: Repository<Media>, mediaService: MediaService);
    create(currentUser: User, createPortfolioDto: CreatePortfolioDto): Promise<Portfolio>;
    uploadMedia({ id }: ParamIdDto, uploadMediaDto: UploadMediaDto, currentUser: User): Promise<Media>;
    findAll(currentUser: User, getALLPortfolioDto: GetALLPortfolioDto): Promise<import("nestjs-typeorm-paginate").Pagination<Portfolio, import("nestjs-typeorm-paginate").IPaginationMeta>>;
    findOne({ id }: ParamIdDto, currentUser: User): Promise<Portfolio>;
    update({ id }: ParamIdDto, currentUser: User, updatePortfolioDto: UpdatePortfolioDto): Promise<Portfolio>;
    deleteMediaFile(deletePortfolioMediaDto: DeletePortfolioMediaDto): Promise<void>;
    remove({ id }: ParamIdDto, currentUser: User): Promise<void>;
}
