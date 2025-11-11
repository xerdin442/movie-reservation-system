import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCinemaDto, UpdateCinemaDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cinema } from '../schema/cinema.entity';
import { PaymentsService } from '@src/payments/payments.service';
import { Organization } from '@src/schema/organization.entity';
import { SubscriptionService } from '@src/subscription/subscription.service';
import { SubscriptionTier } from '@src/db/enums';

@Injectable()
export class CinemaService {
  constructor(
    @InjectRepository(Cinema)
    private readonly cinemaRepo: Repository<Cinema>,
    @InjectRepository(Organization)
    private readonly organizationRepo: Repository<Organization>,
    private readonly paymentsService: PaymentsService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  async create(organizationId: number, dto: CreateCinemaDto): Promise<Cinema> {
    try {
      const organization = await this.organizationRepo.findOneOrFail({
        where: { id: organizationId },
      });

      // Check the limit of the Organization's subscription tier
      await this.subscriptionService.cinemaCreationCheck(organization);

      // Verify account details and create transfer recipient for payouts
      await this.paymentsService.verifyAccountDetails({ ...dto });
      const recipientCode = await this.paymentsService.createTransferRecipient({
        ...dto,
      });

      // Configure some creation options based on the Organization's subscription tier
      let tierValue: boolean = false;
      if (
        organization.subscriptionTier === SubscriptionTier.PREMIUM ||
        organization.subscriptionTier === SubscriptionTier.ENTERPRISE
      ) {
        tierValue = true;
      }

      // Create new cinema
      const cinema = this.cinemaRepo.create({
        ...dto,
        recipientCode,
        organization,
        enableMembership: tierValue,
        enableUsdcPayments: tierValue,
      });
      await this.cinemaRepo.save(cinema);

      return cinema;
    } catch (error) {
      throw error;
    }
  }

  async findAll(organizationId: number): Promise<Cinema[]> {
    try {
      return this.cinemaRepo.findBy({
        organization: { id: organizationId },
      });
    } catch (error) {
      throw error;
    }
  }

  async findOne(organizationId: number, cinemaId: number): Promise<Cinema> {
    try {
      const cinema = await this.cinemaRepo.findOneBy({
        id: cinemaId,
        organization: { id: organizationId },
      });

      if (!cinema) throw new BadRequestException('Invalid Cinema ID');

      return cinema;
    } catch (error) {
      throw error;
    }
  }

  update(id: number, dto: UpdateCinemaDto) {
    return `This action updates a #${id} cinema`;
  }

  delete(id: number) {
    return `This action removes a #${id} cinema`;
  }
}
