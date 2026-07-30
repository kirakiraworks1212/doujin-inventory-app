import { IsOptional, IsString } from 'class-validator';

export class CreateCircleDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  spaceNumber?: string;
}

export class UpdateCircleDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  spaceNumber?: string;
}