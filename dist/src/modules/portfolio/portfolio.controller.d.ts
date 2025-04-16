import { PortfolioService } from './portfolio.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { User } from '../users/entities/user.entity';
import { GetALLPortfolioDto } from './dto/get-all-portfoli.dto';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { UploadMediaDto } from './dto/upload-media.dto';
import { DeletePortfolioMediaDto } from './dto/delete-portfolio-media.dto';
import { GetOnePortfolioDto } from './dto/get-one-portfolio.dto';
export declare class PortfolioController {
    private readonly portfolioService;
    constructor(portfolioService: PortfolioService);
    create(createPortfolioDto: CreatePortfolioDto, currentUser: User): Promise<IResponse>;
    uploadMedia(paramIdDto: ParamIdDto, uploadMediaDto: UploadMediaDto, currentUser: User): Promise<IResponse>;
    findAll(getALLPortfolioDto: GetALLPortfolioDto, currentUser: User): Promise<IResponse>;
    findOne(paramIdDto: ParamIdDto, getPortfolioDto: GetOnePortfolioDto, currentUser: User): Promise<IResponse>;
    update(paramIdDto: ParamIdDto, currentUser: User, updatePortfolioDto: UpdatePortfolioDto): Promise<IResponse>;
    deleteMediaFile(deletePortfolioMediaDto: DeletePortfolioMediaDto): Promise<IResponse>;
    remove(paramIdDto: ParamIdDto, currentUser: User): Promise<IResponse>;
}
