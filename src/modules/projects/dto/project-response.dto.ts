import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Types } from 'mongoose';
import {
  MediaType,
  ProjectStatus,
  ProjectType,
} from '../schemas/project.schema';

export class MediaResponseDto {
  @ApiProperty({ example: MediaType.image })
  type!: MediaType;

  @ApiProperty({ example: 'https://example.com/image.jpg' })
  url!: string;

  @ApiProperty({ example: 'https://cdn.example.com/image.jpg' })
  publicUrl!: string;
}

export class ProgressUpdateResponseDto {
  @ApiProperty({ example: 'Foundation completed' })
  message!: string;

  @ApiProperty({ type: [MediaResponseDto] })
  media!: MediaResponseDto[];

  @ApiProperty({ example: new Date() })
  date!: Date;
}

export class ProjectResponseDto {
  @ApiProperty({
    description: 'Project ID',
    example: '20394ufu459e933j54f5i49',
  })
  _id!: Types.ObjectId;

  @ApiProperty({
    description: 'This is the title of the project to be done.',
  })
  title!: string;

  @ApiProperty({
    description: 'This gives more description about the project to be done.',
    example: '3D architectural design of a duplex',
  })
  description!: string;

  @ApiProperty({
    description: 'This refer to the type of project to be done.',
    example: ProjectType.design,
  })
  type!: ProjectType;

  @ApiProperty({
    description: 'This is the ID of the owner of the project.',
    example: '20394ufu459e933j54f5i49',
  })
  projectOwner!: Types.ObjectId;

  @ApiProperty({
    description: 'This is the status of the project at a given time.',
    example: ProjectStatus.pending,
  })
  status!: ProjectStatus;

  @ApiPropertyOptional({
    description: 'This is the cost of the project.',
    example: 50000,
  })
  price?: number;

  @ApiProperty({ type: [ProgressUpdateResponseDto] })
  progressUpdate!: ProgressUpdateResponseDto[];

  @ApiProperty({
    description:
      'This tells us whether the property is public or private. It is only public property that can be shown on the homepage that any person can view.',
    example: true,
  })
  isPublic!: boolean;
}
