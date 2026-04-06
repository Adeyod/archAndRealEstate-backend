import { Test, TestingModule } from '@nestjs/testing';
import { ReferralEarningsController } from './referral-earnings.controller';

describe('ReferralEarningsController', () => {
  let controller: ReferralEarningsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReferralEarningsController],
    }).compile();

    controller = module.get<ReferralEarningsController>(ReferralEarningsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
