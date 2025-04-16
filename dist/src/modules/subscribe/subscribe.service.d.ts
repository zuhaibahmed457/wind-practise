import { CreateSubscribeDto } from './dto/create-subscribe.dto';
import { Subscribe } from './entities/subscribe.entity';
import { Repository } from 'typeorm';
import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
export declare class SubscribeService {
    private subscriberRepo;
    constructor(subscriberRepo: Repository<Subscribe>);
    create(createSubscribeDto: CreateSubscribeDto): Promise<Subscribe>;
    findAll(getAllDto: GetAllDto): Promise<import("nestjs-typeorm-paginate").Pagination<Subscribe, import("nestjs-typeorm-paginate").IPaginationMeta>>;
    findOne({ id }: ParamIdDto): Promise<Subscribe>;
    remove(paramIdDto: ParamIdDto): Promise<void>;
}
