import { IsBoolean, IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateBannerDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsString()
  @MinLength(5)
  imageUrl: string;

  @IsOptional()
  @IsString()
  linkUrl?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsInt()
  order?: number;
}
