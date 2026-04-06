import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProjectDocument = Project & Document;

export enum ProjectType {
  design = 'design',
  construction = 'construction',
  sale = 'sale',
}

export enum ProjectStatus {
  pending = 'pending',
  inProgress = 'inProgress',
  completed = 'completed',
  cancelled = 'cancelled',
}

export enum MediaType {
  image = 'image',
  video = 'video',
}

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ type: String, enum: ProjectType, default: ProjectType.design })
  type!: ProjectType;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  projectOwner!: Types.ObjectId;

  @Prop({ type: String, enum: ProjectStatus, default: ProjectStatus.pending })
  status!: ProjectStatus;

  @Prop()
  price!: number;

  // @Prop({
  //   type: [
  //     {
  //       type: { type: String, enum: MediaType },
  //       url: { type: String },
  //       publicUrl: { type: String },
  //     },
  //   ],
  //   default: [],
  // })
  // media!: {
  //   type: MediaType;
  //   url: string;
  //   publicUrl: string;
  // }[];

  // @Prop({
  //   type: [
  //     {
  //       message: { type: String },
  //       date: { type: Date, default: Date.now },
  //     },
  //   ],
  //   default: [],
  // })
  // progressUpdate!: {
  //   message: string;
  //   date: Date;
  // }[];

  @Prop({
    type: [
      {
        message: { type: String },
        media: [
          {
            type: { type: String, enum: MediaType },
            url: String,
            publicUrl: String,
          },
        ],
        date: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  progressUpdate!: {
    message: string;
    media?: {
      type: MediaType;
      url: string;
      publicUrl: string;
    }[];
    date: Date;
  }[];

  @Prop({ default: false })
  isPublic!: boolean;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
ProjectSchema.index({ isPublic: 1 });
ProjectSchema.index({ projectOwner: 1 });
