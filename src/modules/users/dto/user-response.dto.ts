import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { Role } from '../schemas/user.schema';

export class UserResponseDto {
  @ApiProperty({
    description: 'user ID',
    example: {
      _id: 'user-123',
      email: 'john.doe@example.com',
      password: 'StrongP@ssword!',
      role: 'USER',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '08039383737',
      isVerified: true,
    },
  })
  _id: Types.ObjectId;

  @ApiProperty({
    description: 'user ID',
    example: {
      _id: 'user-123',
      email: 'john.doe@example.com',
      password: 'StrongP@ssword!',
      role: 'USER',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '08039383737',
      isVerified: true,
    },
  })
  email: string;
  @ApiProperty({
    description: 'user Fitst name',
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    description: 'user Lastname',
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({
    description: 'User Password',
    example: 'StrongP@ssword!',
  })
  password?: string;

  @ApiProperty({
    description: 'user Role',
    example: 'USER',
  })
  role: Role;

  @ApiProperty({
    description: 'Phone Number',
    example: '08039383737',
  })
  phoneNumber: string;

  @ApiProperty({
    description: 'Email verification status',
    example: true,
  })
  isVerified: boolean;
}
