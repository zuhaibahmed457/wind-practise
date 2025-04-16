import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
  IsArray,
  ArrayMinSize,
  ValidateIf,
  IsNumber,
} from 'class-validator';
import { PlanType, PlanFor } from '../entities/plan.entity';
import { BadRequestException } from '@nestjs/common';

export class CreatePlanDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsEnum(PlanType)
  type: PlanType;

  @IsEnum(PlanFor)
  for: PlanFor;

  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsArray({ message: 'At least one feature is required' })
  features: string[];

  @Min(1)
  @Max(365)
  @IsInt()
  @ValidateIf((o: CreatePlanDto) => {
    if (o.type === PlanType.FREE) {
      return true;
    } else if (o.free_duration) {
      throw new BadRequestException(
        'Free duration is not allowed for paid plans',
      );
    }
  })
  free_duration?: number; // Number of days (optional)

  @Min(0)
  @IsNumber()
  @ValidateIf((o: CreatePlanDto) => {
    if (o.type !== PlanType.FREE) {
      return true;
    } else if (o.price) {
      throw new BadRequestException('Price is not allowed for free plans');
    }
  })
  price?: number;

  @Min(1)
  @Max(365)
  @IsInt()
  @IsNotEmpty()
  @ValidateIf((o: CreatePlanDto) => {
    if (o.for === PlanFor.ORGANIZATION) {
      return true;
    } else if (o.number_of_employees_allowed) {
      throw new BadRequestException('Number of employees field is not allowed');
    }
  })
  number_of_employees_allowed: number;
}
