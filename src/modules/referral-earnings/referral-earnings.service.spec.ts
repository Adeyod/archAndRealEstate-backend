import { Test, TestingModule } from '@nestjs/testing';
import { ReferralEarningsService } from './referral-earnings.service';

describe('ReferralEarningsService', () => {
  let service: ReferralEarningsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReferralEarningsService],
    }).compile();

    service = module.get<ReferralEarningsService>(ReferralEarningsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
