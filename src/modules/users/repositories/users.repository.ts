import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

  async findById(id: Types.ObjectId) {
    return this.userModel.findById(id);
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({
      email,
    });
  }

  async create(data: Partial<User>) {
    const user = new this.userModel(data);
    await user.save();
    return user;
  }

  async update(id: Types.ObjectId, data: Partial<User>) {
    return await this.userModel.findByIdAndUpdate(id, data, { new: true });
  }
}
