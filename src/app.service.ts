import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  onModuleInit() {
    if (this.connection.readyState === 1) {
      console.log(`Server connected to database on: ${this.connection.host}`);
    }
  }
  getHello(): string {
    return 'Hello World!';
  }
}
