import { BadRequestException, Injectable } from '@nestjs/common';
import { SubscriptionTier } from '@src/common/enums';
import { Organization } from '@src/schema/organization.entity';
import { BASIC_TIER, FREE_TIER, PREMIUM_TIER } from './helpers';
import { EnterpriseTier } from '@src/schema/enterprise-tier.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(EnterpriseTier)
    private readonly enterpriseTierRepository: Repository<EnterpriseTier>,
  ) {}

  async cinemaCreationCheck(organization: Organization): Promise<void> {
    try {
      const enterpriseTier = await this.enterpriseTierRepository.findOneOrFail({
        where: { organization },
      });

      switch (organization.subscriptionTier) {
        case SubscriptionTier.FREE:
          if (
            organization.cinemas.length === FREE_TIER.cinemasPerOrganization
          ) {
            throw new BadRequestException(
              `${organization.name} can only create ${FREE_TIER.cinemasPerOrganization} cinema in the Free tier. Upgrade to add more cinemas`,
            );
          }

          break;

        case SubscriptionTier.BASIC:
          if (
            organization.cinemas.length === BASIC_TIER.cinemasPerOrganization
          ) {
            throw new BadRequestException(
              `${organization.name} can only create ${BASIC_TIER.cinemasPerOrganization} cinemas in the Basic tier. Upgrade to add more cinemas`,
            );
          }

          break;

        case SubscriptionTier.PREMIUM:
          if (
            organization.cinemas.length === PREMIUM_TIER.cinemasPerOrganization
          ) {
            throw new BadRequestException(
              `${organization.name} can only create ${PREMIUM_TIER.cinemasPerOrganization} cinemas in the Premium tier. Upgrade to add more cinemas`,
            );
          }

          break;

        case SubscriptionTier.ENTERPRISE:
          if (
            organization.cinemas.length ===
            enterpriseTier.cinemasPerOrganization
          ) {
            throw new BadRequestException(
              `${organization.name} can only create ${enterpriseTier.cinemasPerOrganization} cinemas in the Enterprise tier. Contact sales team to modify your custom needs`,
            );
          }

          break;

        default:
          break;
      }

      return;
    } catch (error) {
      throw error;
    }
  }

  cinemaScreensCheck(): void {}
}
