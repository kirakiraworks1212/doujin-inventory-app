import { IsInt, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsInt()
  circleId: number;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @IsPositive()
  price: number;

  @IsInt()
  @Min(0)
  initialStock: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  price?: number;
}

export class AdjustStockDto {
  @IsInt()
  newStock: number;
}

export class RecordSaleDto {
  @IsInt()
  @IsPositive()
  quantity: number;
}