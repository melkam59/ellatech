import { IsInt, IsNotEmpty, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { TransactionType } from 'src/entities/transaction.entity';

export class UpdateProductDto {
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @IsEnum(TransactionType)
  @IsOptional()
  type?: TransactionType;

  @IsUUID()
  @IsOptional()
  userId?: string;
}
