import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { StaffService } from './staff.service';

@Controller('cinema/staff')
export class StaffController {
  private readonly context: string = StaffController.name;

  constructor(private readonly staffService: StaffService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login() {}
}
