import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from '@src/schema/organization.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepo: Repository<Organization>,
  ) {}

  async findByApiKey(apiKey: string): Promise<Organization> {
    try {
      const organization = await this.organizationRepo.findOneBy({ apiKey });
      if (!organization) throw new UnauthorizedException('Invalid API key');

      return organization;
    } catch (error) {
      throw error;
    }
  }
}
