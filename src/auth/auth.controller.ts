import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import logger from '@src/common/logger';
import { AuthService } from '@src/auth/auth.service';
import { VerifySignupDto, VerifyLoginDto, InitiateAuthDto } from './dto';

@Controller('auth')
export class AuthController {
  private readonly context: string = AuthController.name;

  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async initiateSignup(
    @Body() dto: InitiateAuthDto,
  ): Promise<{ message: string }> {
    try {
      await this.authService.initiateSignup(dto);

      logger.info(`[${this.context}] Signup initiated by ${dto.email}\n`);

      return { message: 'A verification OTP has been sent to your email' };
    } catch (error) {
      logger.error(
        `[${this.context}] An error occurred during initiation of signup process. Error: ${error.message}\n`,
      );

      throw error;
    }
  }

  @Post('signup/verify')
  async verifySignup(
    @Body() dto: VerifySignupDto,
  ): Promise<{ qrcode: string; token: string }> {
    try {
      const { email, qrcode, token } = await this.authService.verifySignup(dto);

      logger.info(
        `[${this.context}] Signup verification completed by ${email}\n`,
      );

      return { qrcode, token };
    } catch (error) {
      logger.error(
        `[${this.context}] An error occurred during signup verification. Error: ${error.message}\n`,
      );

      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async initiateLogin(
    @Body() dto: InitiateAuthDto,
  ): Promise<{ requestId: string; role: string }> {
    try {
      const { requestId, role } = await this.authService.initiateLogin(dto);

      logger.info(`[${this.context}] User login initiated by ${dto.email}\n`);

      return { requestId, role };
    } catch (error) {
      logger.error(
        `[${this.context}] An error occurred during initiation of user login. Error: ${error.message}\n`,
      );

      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('login/verify')
  async verifyLogin(@Body() dto: VerifyLoginDto): Promise<{ token: string }> {
    try {
      const { token, email } = await this.authService.verifyLogin(dto);

      logger.info(
        `[${this.context}] Login verification completed by ${email}\n`,
      );

      return { token };
    } catch (error) {
      logger.error(
        `[${this.context}] An error occurred during verification of user login. Error: ${error.message}\n`,
      );

      throw error;
    }
  }
}
