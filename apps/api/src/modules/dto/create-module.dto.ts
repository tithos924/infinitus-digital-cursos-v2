import { IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateModuleDto {
  @IsString()
  @MinLength(2)
  title: string;

  @IsOptional()
  @IsInt()
  order?: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
