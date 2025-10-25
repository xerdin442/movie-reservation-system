import { Injectable } from '@nestjs/common';
import { CreateCinemaDto, UpdateCinemaDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cinema } from '../schema/cinema.entity';
import { PaymentsService } from '@src/payments/payments.service';
import { Organization } from '@src/schema/organization.entity';

@Injectable()
export class CinemaService {
  constructor(
    @InjectRepository(Cinema)
    private readonly cinemaRepository: Repository<Cinema>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    private readonly paymentsService: PaymentsService,
  ) {}

  async create(organizationId: number, dto: CreateCinemaDto) {
    try {
      const organization = await this.organizationRepository.findOneOrFail({
        where: { id: organizationId },
      });

      // Check the Organization subscription tier and if it has reached its cinema limit
    } catch (error) {
      throw error;
    }
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

  delete(id: number) {
    return `This action removes a #${id} cinema`;
  }
}
