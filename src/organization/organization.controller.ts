import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import logger from '@src/common/logger';
import { OrganizationService } from './organization.service';
import { SignupDto, VerifySignupDto } from './dto';

@Controller('organization')
export class OrganizationController {
  private readonly context: string = OrganizationController.name;

  constructor(private readonly organizationService: OrganizationService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async signup(@Body() dto: SignupDto): Promise<{ message: string }> {
    try {
      await this.organizationService.signup(dto);

      logger.info(
        `[${this.context}] Organization registration process initiated by ${dto.email}\n`,
      );

      return { message: 'A verification code has been sent to your email' };
    } catch (error) {
      logger.error(
        `[${this.context}] An error occurred during organization signup. Error: ${error.message}\n`,
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
        `[${this.context}] Organization successfully verified by ${email}\n`,
      );

      return { qrcode };
    } catch (error) {
      logger.error(
        `[${this.context}] An error occurred during the organization verification process. Error: ${error.message}\n`,
      );

      throw error;
    }
  }
}
