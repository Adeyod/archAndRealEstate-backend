import { Controller, Get, Param, Query } from '@nestjs/common';
import { GetAllUsersDto } from './dto/get-all-users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get('get-a-user-by-id/:userId')
  async findAUserById(@Param('userId') userId: string) {
    return await this.usersService.findUserById(userId);
  }

  @Get('get-all-users')
  async findAllUsers(@Query() getAllUsersDto: GetAllUsersDto) {
    return await this.usersService.findAllUsers(getAllUsersDto);
  }
}
