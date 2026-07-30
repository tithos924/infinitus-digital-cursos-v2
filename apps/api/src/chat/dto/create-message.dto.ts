import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateMessageDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  content?: string;

  @IsOptional()
  @IsString()
  audioUrl?: string;
}
