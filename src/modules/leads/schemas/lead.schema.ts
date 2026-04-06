import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum LeadStatus {
  new = 'new',
  contacted = 'contacted',
  converted = 'converted',
}

export type LeadDocument = Lead & Document;

@Schema({ timestamps: true })
export class Lead {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  referrerId!: Types.ObjectId;

  @Prop({ enum: LeadStatus, default: LeadStatus.new })
  status!: LeadStatus;

  @Prop({ default: 'referral' })
  source?: string;

  @Prop({ required: true })
  leadCode!: string;
}

export const LeadSchema = SchemaFactory.createForClass(Lead);
