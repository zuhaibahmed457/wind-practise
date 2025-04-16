import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeletePortfolioMediaDto {
  @IsUUID('all', { message: 'Invalid id' })
  @IsNotEmpty()
  id: string;

  @IsUUID('all', { message: 'Invalid id' })
  @IsNotEmpty()
  portfolio_id: string;
}
