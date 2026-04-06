import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CloudinaryModule } from './common/infrastructure/cloudinary/cloudinary.module';
import configuration from './config/configuration';
import { MailModule } from './mail/mail.module';
import { AuthModule } from './modules/auth/auth.module';
import { LeadsModule } from './modules/leads/leads.module';
import { MilestonesModule } from './modules/milestones/milestones.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { RefreshTokensModule } from './modules/refresh-tokens/refresh-tokens.module';
import { TokensModule } from './modules/tokens/tokens.module';
import { UsersController } from './modules/users/users.controller';
import { UsersModule } from './modules/users/users.module';
import { PropertiesModule } from './modules/properties/properties.module';
import { SalesModule } from './modules/sales/sales.module';
import { ReferralEarningsModule } from './modules/referral-earnings/referral-earnings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.string().required(),
        MONGO_URI: Joi.string().required(),
      }),
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('MONGO_URI'),
      }),
    }),

    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.getOrThrow<string>(
            'envValues.redis_host',
            'localhost',
          ),
          port: configService.getOrThrow<number>('envValues.redis_port', 6379),
        },
      }),
    }),
    AuthModule,
    UsersModule,
    TokensModule,
    MailModule,
    RefreshTokensModule,
    ProjectsModule,
    CloudinaryModule,
    LeadsModule,
    MilestonesModule,
    PropertiesModule,
    SalesModule,
    ReferralEarningsModule,
  ],
  controllers: [AppController, UsersController],
  providers: [AppService],
})
export class AppModule {}
