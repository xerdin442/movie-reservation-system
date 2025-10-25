import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CinemaService } from './cinema.service';
import { CreateCinemaDto, UpdateCinemaDto } from './dto';
import { CurrentUser, Roles } from '@src/custom/decorators';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('cinema')
export class CinemaController {
  constructor(private readonly cinemaService: CinemaService) {}

  @Roles('organization')
  @Post('profile/create')
  create(
    @CurrentUser('id') organizationId: number,
    @Body() dto: CreateCinemaDto,
  ) {
    return this.cinemaService.create(organizationId, dto);
  }

  @Get()
  findAll() {
    return this.cinemaService.findAll();
  }

  @Get('profile/:cinemaId')
  findOne(@Param('cinemaId', ParseIntPipe) cinemaId: string) {
    return this.cinemaService.findOne(+cinemaId);
  }

  @Patch('profile/:cinemaId')
  update(
    @Param('cinemaId', ParseIntPipe) cinemaId: string,
    @Body() dto: UpdateCinemaDto,
  ) {
    return this.cinemaService.update(+cinemaId, dto);
  }

  @Delete('profile/:cinemaId')
  remove(@Param('cinemaId', ParseIntPipe) cinemaId: string) {
    return this.cinemaService.delete(+cinemaId);
  }
}
