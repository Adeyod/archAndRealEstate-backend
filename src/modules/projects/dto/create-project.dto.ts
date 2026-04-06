import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ProjectType } from '../schemas/project.schema';

export class CreateProjectDto {
  @ApiProperty({
    description: 'This is the title of the project.',
    example: '3D design for a complex',
  })
  @IsNotEmpty({ message: 'Title is required.' })
  @IsString({ message: 'Title must be a string' })
  title!: string;

  @ApiProperty({
    description: 'This describes the project details.',
    example: 'This is a shopping complex with multiple stores.',
  })
  @IsNotEmpty({ message: 'Description is required.' })
  @IsString({ message: 'Description must be a string.' })
  description!: string;

  @ApiProperty({
    description:
      'This refer to the type of service that the user want us to render to them.',
    example: ProjectType.design,
  })
  @IsEnum(ProjectType, { message: 'Type must a valid project type.' })
  type!: ProjectType;

  @ApiPropertyOptional({
    description:
      'This is the price that the company charges user for the service we are rendering for the user.',
    example: 50000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Price must be a number' })
  price?: number;
}
