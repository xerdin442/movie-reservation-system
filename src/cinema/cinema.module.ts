import { Module } from '@nestjs/common';
import { CinemaService } from './cinema.service';
import { CinemaController } from './cinema.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cinema } from '../schema/cinema.entity';
import { Organization } from '@src/schema/organization.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cinema, Organization])],
  controllers: [CinemaController],
  providers: [CinemaService],
})
export class CinemaModule {}
