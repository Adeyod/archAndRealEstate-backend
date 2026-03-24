import { customAlphabet } from 'nanoid';

export const generateRefCode = (): string => {
  const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTVWXYZ0123456789', 8);

  const code = `KB-${nanoid()}`;
  return code;
};
