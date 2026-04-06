import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { QueryWithPaginationDto } from '../../common/dto/query-with-pagination';
import { UsersRepository } from '../users/repositories/users.repository';
import { LeadResponseDto } from './dtos/lead-response.dto';
import { LeadsRepository } from './repositories/lead.repository';
import { LeadStatus } from './schemas/lead.schema';

@Injectable()
export class LeadsService {
  constructor(
    private leadsRepository: LeadsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async createLead(referrerCode: string, status: LeadStatus) {
    const referral = await this.usersRepository.findByRefCode(referrerCode);

    const lead = await this.leadsRepository.createLead(
      status,
      referral?._id?.toString(),
    );

    if (!lead) {
      throw new BadRequestException({
        message: 'Unable to create lead.',
        success: false,
        status: 400,
      });
    }

    return lead;
  }

  async getLeadById(leadId: string) {
    const lead = await this.leadsRepository.getLeadById(leadId);

    if (!lead) {
      throw new NotFoundException({
        message: 'Lead not found.',
        success: false,
        status: 400,
      });
    }

    return lead;
  }

  async getAllLeads(queryWithPaginationDto: QueryWithPaginationDto): Promise<{
    leadObj: LeadResponseDto[];
    totalPages: number;
    totalCount: number;
  }> {
    const leads = await this.leadsRepository.getAll(queryWithPaginationDto);

    const { leadObj, totalCount, totalPages } = leads;

    const leadObjs = leadObj.map((l) => {
      return {
        _id: l._id,
        source: l.source,
        status: l.status,
        referrerId: l.referrerId,
        leadCode: l.leadCode,
      };
    });

    return {
      leadObj: leadObjs,
      totalCount,
      totalPages,
    };
  }
}
