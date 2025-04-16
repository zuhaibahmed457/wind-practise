import { CertificatesService } from './certificates.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { User } from '../users/entities/user.entity';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { GetAllCertificatesDto } from './dto/get-all-certificates.dto';
import { GetAllCertificateHistoryDto } from './dto/get-all-certificate-history.dto';
import { GetOneCertificateDto } from './dto/get-one.certificate.dto';
export declare class CertificatesController {
    private readonly certificatesService;
    constructor(certificatesService: CertificatesService);
    create(currentUser: User, createCertificateDto: CreateCertificateDto): Promise<IResponse>;
    findAll(getAllCertificatesDto: GetAllCertificatesDto, currentUser: User): Promise<IResponse>;
    findOne(paramIdDto: ParamIdDto, getOneCertificateDto: GetOneCertificateDto, currentUser: User): Promise<{
        message: string;
        details: import("./entities/certificate.entity").Certificate;
    }>;
    findCertificateHistory(paramIdDto: ParamIdDto, currentUser: User, getAllCertificateHistoryDto: GetAllCertificateHistoryDto): Promise<{
        message: string;
        details: import("nestjs-typeorm-paginate").Pagination<import("./entities/certificate-history.entity").CertificateHistory, import("nestjs-typeorm-paginate").IPaginationMeta>;
    }>;
    update(paramIdDto: ParamIdDto, currentUser: User, updateCertificateDto: UpdateCertificateDto): Promise<IResponse>;
    remove(paramIdDto: ParamIdDto, user: User): Promise<IResponse>;
}
