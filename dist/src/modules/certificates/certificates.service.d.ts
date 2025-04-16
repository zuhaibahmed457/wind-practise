import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { Certificate } from './entities/certificate.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { CertificateHistory } from './entities/certificate-history.entity';
import { S3Service } from '../s3/s3.service';
import { GetAllCertificatesDto } from './dto/get-all-certificates.dto';
import { GetAllCertificateHistoryDto } from './dto/get-all-certificate-history.dto';
import { ProfileDetails } from '../profile-details/entities/profile-details.entity';
export declare class CertificatesService {
    private readonly certificateRepository;
    private readonly certificateHistoryRepository;
    private readonly userRepository;
    private readonly profileDetailsRepository;
    private readonly s3Service;
    constructor(certificateRepository: Repository<Certificate>, certificateHistoryRepository: Repository<CertificateHistory>, userRepository: Repository<User>, profileDetailsRepository: Repository<ProfileDetails>, s3Service: S3Service);
    updateUserCertificateExpirationDate(profileDetails: ProfileDetails): Promise<void>;
    create(currentUser: User, createCertificateDto: CreateCertificateDto): Promise<Certificate>;
    findAll(getAllCertificatesDto: GetAllCertificatesDto, currentUser: User): Promise<import("nestjs-typeorm-paginate").Pagination<Certificate, import("nestjs-typeorm-paginate").IPaginationMeta>>;
    findOne({ id }: ParamIdDto, currentUser: User): Promise<Certificate>;
    update({ id }: ParamIdDto, currentUser: User, updateCertificateDto: UpdateCertificateDto): Promise<Certificate>;
    remove({ id }: ParamIdDto, currentUser: User): Promise<Certificate>;
    getAllCertificateHistory({ id }: ParamIdDto, currentUser: User, getAllCertificateHistoryDto: GetAllCertificateHistoryDto): Promise<import("nestjs-typeorm-paginate").Pagination<CertificateHistory, import("nestjs-typeorm-paginate").IPaginationMeta>>;
}
