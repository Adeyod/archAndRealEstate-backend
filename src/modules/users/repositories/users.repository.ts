import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { generateRefCode } from 'src/common/utils/helper';
import { GetAllUsersDto } from '../dto/get-all-users.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { Role, User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

  async findById(id: Types.ObjectId) {
    return this.userModel.findById(id);
  }

  async findAll(getAllUsersDto: GetAllUsersDto): Promise<{
    userObj: UserResponseDto[];
    totalPages: number;
    totalCount: number;
  }> {
    const { page, searchParams, limit } = getAllUsersDto;

    let query = this.userModel.find({ role: Role.user });

    if (searchParams) {
      const regex = new RegExp(searchParams, 'i');

      query = query.where({
        $or: [
          { firstName: { $regex: regex } },
          { lastName: { $regex: regex } },
          { email: { $regex: regex } },
        ],
      });
    }

    const count = await query.clone().countDocuments();
    let pages = 0;

    if (page !== undefined && limit !== undefined && count !== 0) {
      const offset = (page - 1) * limit;

      query = query.skip(offset).limit(limit);
      pages = Math.ceil(count / limit);

      if (page > pages) {
        throw new NotFoundException({
          message: 'Page can not be found',
          status: 404,
          success: false,
        });
      }
    }

    const users = await query.sort({ createdAt: -1 });

    if (users.length === 0) {
      throw new NotFoundException({
        message: 'Users not found',
        success: false,
        status: 404,
      });
    }

    const response = {
      totalCount: count,
      totalPages: pages,
      userObj: users,
    };

    return response;
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({
      email,
    });
  }

  // async create(data: Partial<User>) {
  //   const user = new this.userModel(data);
  //   await user.save();
  //   return user;
  // }

  async generateRefCode(): Promise<string> {
    let refCode: string;
    let exists = true;

    do {
      const code = generateRefCode();
      refCode = code;
      const existing = await this.userModel.exists({
        referralCode: refCode.trim().toLowerCase(),
      });
      exists = !!existing;
    } while (exists);

    return refCode;
  }
  async create(data: Partial<User>): Promise<UserDocument> {
    const refCode = await this.generateRefCode();

    data.referralCode = refCode;

    const user = new this.userModel(data);
    await user.save();

    console.log('refCode:', refCode);
    console.log('Created user:', user);
    return user;
  }

  async update(id: Types.ObjectId, data: Partial<User>) {
    return await this.userModel.findByIdAndUpdate(id, data, { new: true });
  }
}
