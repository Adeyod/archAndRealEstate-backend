import { BadRequestException } from '@nestjs/common';
import { customAlphabet } from 'nanoid';

export const generateRefCode = (): string => {
  const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTVWXYZ0123456789', 8);

  const code = `KB-${nanoid()}`;
  return code;
};

export const generateLeadCode = (): string => {
  const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTVWXYZ0123456789', 8);

  const code = `LEAD-${nanoid()}`;
  return code;
};

export const generatePaymentReference = (payload) => {
  const { userId, projectType } = payload;

  console.log('payload:', payload);

  if (!userId || !projectType) {
    throw new BadRequestException({
      message: 'User ID and project type are required.',
      success: false,
      status: 400,
    });
  }

  const ref = `payment_${projectType}_${userId}_${Date.now()}`;

  return ref;
};
