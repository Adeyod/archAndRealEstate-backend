import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { QueryWithPaginationDto } from '../../../common/dto/query-with-pagination';
import { generateLeadCode } from '../../../common/utils/helper';
import { Lead, LeadDocument, LeadStatus } from '../schemas/lead.schema';

@Injectable()
export class LeadsRepository {
  constructor(
    @InjectModel(Lead.name)
    private leadModel: Model<LeadDocument>,
  ) {}

  async generateMyLeadCode(): Promise<string> {
    let leadCode: string;
    let exists = true;

    do {
      const code = generateLeadCode();
      leadCode = code;
      const existing = await this.leadModel.exists({
        leadCode: leadCode.trim().toLowerCase(),
      });
      exists = !!existing;
    } while (exists);

    return leadCode;
  }
  async createLead(
    status: LeadStatus,
    referrerId?: string,
  ): Promise<LeadDocument | null> {
    const id = new Types.ObjectId(referrerId);

    const myLeadCode = await this.generateMyLeadCode();

    const newLead = await new this.leadModel({
      referrerId: id,
      status,
      leadCode: myLeadCode,
    }).save();

    return newLead;
  }

  async getLeadById(leadId: string): Promise<LeadDocument | null> {
    const id = new Types.ObjectId(leadId);
    const lead = await this.leadModel.findById(id);
    return lead;
  }

  async getAll(queryWithPaginationDto: QueryWithPaginationDto): Promise<{
    leadObj: LeadDocument[];
    totalPages: number;
    totalCount: number;
  }> {
    const { page, searchParams, limit } = queryWithPaginationDto;

    let query = this.leadModel.find();

    if (searchParams) {
      const regex = new RegExp(searchParams, 'i');

      query = query.where({
        $or: [{ source: { $regex: regex } }, { status: { $regex: regex } }],
      });
    }

    const count = await query.clone().countDocuments();
    let pages = 0;

    if (page !== undefined && limit !== undefined && count !== 0) {
      const offset = (page - 1) * limit;

      query = query.skip(offset).limit(limit);
      pages = Math.ceil(count / limit);

      if (page > pages) {
        throw new NotFoundException({
          message: 'Page can not be found.',
          success: false,
          status: 404,
        });
      }
    }

    const leads = await query.sort({ createdAt: -1 });

    if (leads.length === 0) {
      throw new NotFoundException({
        message: 'Leads not found.',
        success: false,
        status: 404,
      });
    }

    const response = {
      leadObj: leads,
      totalCount: count,
      totalPages: pages,
    };

    return response;
  }
}
