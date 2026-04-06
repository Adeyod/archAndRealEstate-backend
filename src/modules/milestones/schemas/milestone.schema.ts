import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum MilestoneType {
  pending = 'pending',
  paid = 'paid',
  inProgress = 'inProgress',
  completed = 'completed',
}

export type MilestoneDocument = Milestone & Document;

@Schema({ timestamps: true })
export class Milestone {
  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  projectId!: Types.ObjectId;

  @Prop()
  name!: string;

  @Prop()
  amount!: string;

  @Prop({ enum: MilestoneType, default: MilestoneType.pending })
  status!: MilestoneType;

  @Prop()
  dueDate!: Date;
}

export const MilestoneSchema = SchemaFactory.createForClass(Milestone);
