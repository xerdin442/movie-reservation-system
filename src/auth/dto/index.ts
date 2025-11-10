import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class InitiateAuthDto {
  @IsEmail({}, { message: 'Please enter a valid email address' })
  @IsNotEmpty()
  email: string;
}

export class VerifySignupDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class VerifyLoginDto {
  @IsString()
  @IsNotEmpty()
  requestId: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}
