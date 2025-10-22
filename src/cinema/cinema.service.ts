import { Injectable } from '@nestjs/common';
import { CreateCinemaDto, UpdateCinemaDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cinema } from '../schema/cinema.entity';

@Injectable()
export class CinemaService {
  constructor(
    @InjectRepository(Cinema)
    private readonly cinemaRepository: Repository<Cinema>,
  ) {}

  create(dto: CreateCinemaDto) {
    return 'This action adds a new cinema';
  }

  findAll() {
    return `This action returns all cinema`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cinema`;
  }

  update(id: number, dto: UpdateCinemaDto) {
    return `This action updates a #${id} cinema`;
  }

  remove(id: number) {
    return `This action removes a #${id} cinema`;
  }
}
