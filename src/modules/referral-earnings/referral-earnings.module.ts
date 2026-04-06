import { Module } from '@nestjs/common';
import { ReferralEarningsController } from './referral-earnings.controller';
import { ReferralEarningsService } from './referral-earnings.service';

@Module({
  controllers: [ReferralEarningsController],
  providers: [ReferralEarningsService]
})
export class ReferralEarningsModule {}
