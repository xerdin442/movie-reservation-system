import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Please enter a valid email address' })
  @IsNotEmpty()
  email: string;
}

export class SignupDto extends LoginDto {
  @IsString()
  @IsNotEmpty()
  name: string;
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
  @IsOptional()
  mfaToken?: string;

  @IsString()
  @IsOptional()
  password?: string;
}
