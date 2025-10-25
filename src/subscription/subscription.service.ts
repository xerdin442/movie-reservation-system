import { BadRequestException, Injectable } from '@nestjs/common';
import { SubscriptionTier } from '@src/common/enums';
import { Organization } from '@src/schema/organization.entity';
import { BASIC_PLAN, FREE_PLAN, PREMIUM_PLAN } from './helpers';

@Injectable()
export class SubscriptionService {
  constructor() {}

  cinemaCreationCheck(organization: Organization): void {
    try {
      switch (organization.subscriptionTier) {
        case SubscriptionTier.FREE:
          if (
            organization.cinemas.length === FREE_PLAN.cinemasPerOrganization
          ) {
            throw new BadRequestException(
              `${organization.name} can only create ${FREE_PLAN.cinemasPerOrganization} cinema in the Free tier. Upgrade to add more cinemas`,
            );
          }

          break;

        case SubscriptionTier.BASIC:
          if (
            organization.cinemas.length === BASIC_PLAN.cinemasPerOrganization
          ) {
            throw new BadRequestException(
              `${organization.name} can only create ${BASIC_PLAN.cinemasPerOrganization} cinemas in the Basic tier. Upgrade to add more cinemas`,
            );
          }

          break;

        case SubscriptionTier.PREMIUM:
          if (
            organization.cinemas.length === PREMIUM_PLAN.cinemasPerOrganization
          ) {
            throw new BadRequestException(
              `${organization.name} can only create ${PREMIUM_PLAN.cinemasPerOrganization} cinemas in the Premium tier. Upgrade to add more cinemas`,
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

  cinemaStaffCheck(): void {}

  cinemaScreensCheck(): void {}
}
