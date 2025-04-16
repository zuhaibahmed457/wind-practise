import { InvoicesService } from './invoices.service';
import { GetAllInvoiceDto } from './dto/get-all-invoices-schema.dto';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { User } from '../users/entities/user.entity';
export declare class InvoicesController {
    private readonly invoicesService;
    constructor(invoicesService: InvoicesService);
    findAll(currentUser: User, getAllInvoicesDto: GetAllInvoiceDto): Promise<IResponse>;
}
