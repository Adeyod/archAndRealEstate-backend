import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReferralBonusDocument = ReferralBonus & Document;

@Schema({ timestamps: true })
export class ReferralBonus {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  referrerId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Project' })
  projectId!: Types.ObjectId;

  @Prop()
  amount!: number;

  @Prop({ enum: ['PENDING', 'PAID'], default: 'PENDING' })
  status!: string;
}

export const ReferralBonusSchema = SchemaFactory.createForClass(ReferralBonus);
