import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import logger from '@src/common/logger';
import { OrganizationService } from './organization.service';
import { LoginDto, SignupDto, VerifyLoginDto, VerifySignupDto } from './dto';

@Controller('dashboard/org')
export class OrganizationController {
  private readonly context: string = OrganizationController.name;

  constructor(private readonly organizationService: OrganizationService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async signup(@Body() dto: SignupDto): Promise<{ message: string }> {
    try {
      await this.organizationService.signup(dto);

      logger.info(
        `[${this.context}] Organization signup initiated by ${dto.email}\n`,
      );

      return { message: 'A verification code has been sent to your email' };
    } catch (error) {
      logger.error(
        `[${this.context}] An error occurred during initiation of Organization signup. Error: ${error.message}\n`,
      );

      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('signup/verify')
  async verifySignup(
    @Body() dto: VerifySignupDto,
  ): Promise<{ qrcode: string }> {
    try {
      const { email, qrcode } =
        await this.organizationService.verifySignup(dto);

      logger.info(
        `[${this.context}] Organization signup successfully verified by ${email}\n`,
      );

      return { qrcode };
    } catch (error) {
      logger.error(
        `[${this.context}] An error occurred during Organization signup verification. Error: ${error.message}\n`,
      );

      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() dto: LoginDto,
  ): Promise<{ requestId: string; message: string }> {
    try {
      const requestId = await this.organizationService.login(dto);

      logger.info(
        `[${this.context}] Organization login initiated by ${dto.email}\n`,
      );

      return {
        requestId,
        message: 'Email validation successful; awaiting MFA verification',
      };
    } catch (error) {
      logger.error(
        `[${this.context}] An error occurred during initiation of Organization login. Error: ${error.message}\n`,
      );

      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('login/verify')
  async verifyLogin(@Body() dto: VerifyLoginDto): Promise<{ token: string }> {
    try {
      const { token, email } = await this.organizationService.verifyLogin(dto);

      logger.info(
        `[${this.context}] Organization login successfully verified by ${email}\n`,
      );

      return { token };
    } catch (error) {
      logger.error(
        `[${this.context}] An error occurred during Organization login verification. Error: ${error.message}\n`,
      );

      throw error;
    }
  }
}
