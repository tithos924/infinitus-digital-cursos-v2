import { IsInt, IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

export class CreateToolDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(5)
  url: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsInt()
  order?: number;
}
