import { SetMetadata } from '@nestjs/common';
import { RequestType } from 'src/modules/access-request/entities/access-request.entity';

export const RequestTypeDecorator = (...requestTypes: RequestType[]) =>
  SetMetadata('requestType', requestTypes);