import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SaleDocument = Sale & Document;

@Schema({ timestamps: true })
export class Sale {
  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  projectId!: Types.ObjectId;

  @Prop()
  saleAmount!: number;

  @Prop()
  commission!: number;

  @Prop()
  clientReceives!: number;
}

export const SaleSchema = SchemaFactory.createForClass(Sale);
