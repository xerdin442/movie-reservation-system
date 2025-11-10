import {
  UseGuards,
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
} from '@nestjs/common';
import logger from '@src/common/logger';
import { AuthenticatedUser } from '@src/common/types';
import { GetOrganization } from '@src/custom/decorators';
import { ApiKeyGuard } from '@src/custom/guards';
import { Cinema } from '@src/schema/cinema.entity';
import { CinemaService } from './cinema.service';
import { CreateCinemaDto, UpdateCinemaDto } from './dto';

@UseGuards(ApiKeyGuard)
@Controller('cinemas')
export class CinemaController {
  private readonly context: string = CinemaController.name;

  constructor(private readonly cinemaService: CinemaService) {}

  @Post('create')
  async create(
    @GetOrganization() organization: AuthenticatedUser,
    @Body() dto: CreateCinemaDto,
  ): Promise<{ cinema: Cinema }> {
    try {
      const cinema = await this.cinemaService.create(organization.id, dto);

      logger.info(
        `[${this.context}] New cinema profile created by ${organization.email}\n`,
      );

      return { cinema };
    } catch (error) {
      logger.error(
        `[${this.context}] An error occurred during creation of new cinema profile. Error: ${error.message}\n`,
      );

      throw error;
    }
  }

  @Get()
  async findAll(
    @GetOrganization() organization: AuthenticatedUser,
  ): Promise<{ cinemas: Cinema[] }> {
    try {
      const cinemas = await this.cinemaService.findAll(organization.id);

      logger.info(
        `[${this.context}] All cinema profiles retrieved by Organization. Email: ${organization.email}\n`,
      );

      return { cinemas };
    } catch (error) {
      logger.error(
        `[${this.context}] An error occurred during retrieval of cinema profiles. Error: ${error.message}\n`,
      );

      throw error;
    }
  }

  @Get(':cinemaId')
  async findOne(
    @GetOrganization() organization: AuthenticatedUser,
    @Param('cinemaId', ParseIntPipe) cinemaId: number,
  ): Promise<{ cinema: Cinema }> {
    try {
      const cinema = await this.cinemaService.findOne(
        organization.id,
        cinemaId,
      );

      logger.info(
        `[${this.context}] Cinema profile retrieved by Organization. Email: ${organization.email}\n`,
      );

      return { cinema };
    } catch (error) {
      logger.error(
        `[${this.context}] An error occurred during retrieval of cinema profile by ID. Error: ${error.message}\n`,
      );

      throw error;
    }
  }

  @Patch(':cinemaId')
  update(
    @Param('cinemaId', ParseIntPipe) cinemaId: number,
    @Body() dto: UpdateCinemaDto,
  ) {
    return this.cinemaService.update(cinemaId, dto);
  }

  @Delete(':cinemaId')
  remove(@Param('cinemaId', ParseIntPipe) cinemaId: number) {
    return this.cinemaService.delete(cinemaId);
  }
}
