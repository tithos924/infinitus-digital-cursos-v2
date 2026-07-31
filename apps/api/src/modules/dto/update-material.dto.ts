import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateMaterialDto {
  @IsOptional()
  @IsBoolean()
  locked?: boolean;
}
