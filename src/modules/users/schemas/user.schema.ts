import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

export enum Role {
  admin = 'admin',
  user = 'user',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ required: false })
  referralCode!: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  referredBy!: Types.ObjectId;

  @Prop({ type: String, enum: Role, default: Role.user })
  role!: Role;

  @Prop({ required: true })
  firstName!: string;

  @Prop({ required: true })
  lastName!: string;

  @Prop({ required: true })
  phoneNumber!: string;

  @Prop({ default: false })
  isVerified!: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Lead' })
  leadId!: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
