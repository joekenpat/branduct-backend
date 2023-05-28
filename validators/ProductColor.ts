import { string, object } from 'zod';

export const ProductColorValidator = object({
  code: string().min(1).max(255),
  textCode: string().min(1).max(255),
});