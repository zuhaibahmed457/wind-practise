import { SubscribeService } from './subscribe.service';
import { CreateSubscribeDto } from './dto/create-subscribe.dto';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import { IResponse } from 'src/shared/interfaces/response.interface';
export declare class SubscribeController {
    private readonly subscribeService;
    constructor(subscribeService: SubscribeService);
    create(createSubscribeDto: CreateSubscribeDto): Promise<{
        message: string;
    }>;
    findAll(getAllDto: GetAllDto): Promise<IResponse>;
    findOne(paramIdDto: ParamIdDto): Promise<{
        message: string;
        details: import("./entities/subscribe.entity").Subscribe;
    }>;
    remove(paramIdDto: ParamIdDto): Promise<IResponse>;
}
