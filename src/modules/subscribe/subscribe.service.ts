import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubscribeDto } from './dto/create-subscribe.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscribe } from './entities/subscribe.entity';
import { IsNull, Repository } from 'typeorm';
import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';

@Injectable()
export class SubscribeService {
  constructor(
    @InjectRepository(Subscribe)
    private subscriberRepo: Repository<Subscribe>,
  ) {}

  async create(createSubscribeDto: CreateSubscribeDto) {
    const isSubscriberExist = await this.subscriberRepo.findOne({
      where: {
        email: createSubscribeDto.email,
      },
    });

    if (isSubscriberExist) throw new BadRequestException('Already subscribed');

    const subscribe = this.subscriberRepo.create(createSubscribeDto);
    return await subscribe.save();
  }

  async findAll(getAllDto: GetAllDto) {
    const { page, per_page, search } = getAllDto;

    const query = this.subscriberRepo
      .createQueryBuilder('sub')
      .where('sub.deleted_at IS NULL');

    if (search) {
      query.andWhere('sub.email ILIKE :search', { search: `%${search}%` });
    }

    const paginationOptions: IPaginationOptions = {
      page: page,
      limit: per_page,
    };

    return await paginate(query, paginationOptions);
  }

  async findOne({ id }: ParamIdDto) {
    const subscribe = await this.subscriberRepo.findOne({
      where: {
        id,
        deleted_at: IsNull(),
      },
    });
    if (!subscribe) {
      throw new NotFoundException(`Subscriber not found`);
    }
    return subscribe;
  }

  async remove(paramIdDto: ParamIdDto) {
    const subscriber = await this.findOne(paramIdDto);
    subscriber.deleted_at = new Date();
    await subscriber.save();
  }
}
