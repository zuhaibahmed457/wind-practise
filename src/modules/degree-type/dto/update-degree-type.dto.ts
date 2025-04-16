import { PartialType } from '@nestjs/mapped-types';
import { CreateDegreeTypeDto } from './create-degree-type.dto';

export class UpdateDegreeTypeDto extends PartialType(CreateDegreeTypeDto) {}
