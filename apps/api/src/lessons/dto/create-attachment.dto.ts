import { IsString, MinLength } from 'class-validator';

export class CreateAttachmentDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @MinLength(5)
  fileUrl: string;
}
