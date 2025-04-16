import { Invoice } from './entities/invoice.entity';
import { Repository } from 'typeorm';
import { GetAllInvoiceDto } from './dto/get-all-invoices-schema.dto';
import { User } from '../users/entities/user.entity';
import { Subscription } from '../subscriptions/entities/subscription.entity';
export declare class InvoicesService {
    private readonly invoicesRepository;
    private readonly subscriptionsRepository;
    constructor(invoicesRepository: Repository<Invoice>, subscriptionsRepository: Repository<Subscription>);
    findAll(currentUser: User, getAllInvoiceDto: GetAllInvoiceDto): Promise<import("nestjs-typeorm-paginate").Pagination<Invoice, import("nestjs-typeorm-paginate").IPaginationMeta>>;
}
