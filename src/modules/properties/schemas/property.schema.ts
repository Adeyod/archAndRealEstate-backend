import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum PropertyStatus {
  available = 'available',
  sold = 'sold',
}
export type PropertyDocument = Property & Document;

@Schema({ timestamps: true })
export class Property {
  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  projectId!: Types.ObjectId;

  @Prop()
  location!: string;

  @Prop()
  price!: number;

  @Prop()
  description!: string;

  @Prop([String])
  images!: string[];

  @Prop({ enum: PropertyStatus, default: PropertyStatus.available })
  status!: PropertyStatus;
}

export const PropertySchema = SchemaFactory.createForClass(Property);
