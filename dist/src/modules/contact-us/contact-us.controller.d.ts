import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { ContactUsService } from './contact-us.service';
import { CreateContactUsDto } from './dto/create-contact-us.dto';
export declare class ContactUsController {
    private readonly contactUsService;
    constructor(contactUsService: ContactUsService);
    create(createContactUsDto: CreateContactUsDto): Promise<IResponse>;
    findAll(getAllDto: GetAllDto): Promise<IResponse>;
    findOne(paramIdDto: ParamIdDto): Promise<IResponse>;
    remove(paramIdDto: ParamIdDto): Promise<IResponse>;
}
