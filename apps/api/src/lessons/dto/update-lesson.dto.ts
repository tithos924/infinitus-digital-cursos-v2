import { IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateLessonDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  title?: string;

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  contentHtml?: string;

  @IsOptional()
  @IsInt()
  order?: number;
}
