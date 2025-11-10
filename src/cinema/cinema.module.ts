import { Module } from '@nestjs/common';
import { CinemaService } from './cinema.service';
import { CinemaController } from './cinema.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from '@src/schema/organization.entity';
import { Cinema } from '@src/schema/cinema.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cinema, Organization])],
  controllers: [CinemaController],
  providers: [CinemaService],
})
export class CinemaModule {}
