import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { LeadStatus } from '../schemas/lead.schema';

export class LeadResponseDto {
  @ApiProperty({
    description: 'Lead ID',
    example: '304ifj593jd930gfk5',
  })
  _id!: Types.ObjectId;

  @ApiProperty({
    description: 'referrer ID',
    example: '304ifj593jd930gfk5',
  })
  referrerId!: Types.ObjectId;

  @ApiProperty({
    description: 'Lead status',
    example: LeadStatus.new,
  })
  status!: LeadStatus;

  @ApiProperty({
    description: 'Lead source',
    example: 'referral',
  })
  source?: string;

  @ApiProperty({
    description:
      'Lead code of the new user. This is used to track the new user and get its mongoDB _id.',
    example: 'LEAD-34OD40',
  })
  leadCode!: string;
}
