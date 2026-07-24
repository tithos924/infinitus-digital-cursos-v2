import { IsString } from 'class-validator';

export class GrantAccessDto {
  @IsString()
  courseId: string;
}
