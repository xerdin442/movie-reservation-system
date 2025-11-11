import { IsNotEmpty, IsString } from 'class-validator';

export class updateOrganizationDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
