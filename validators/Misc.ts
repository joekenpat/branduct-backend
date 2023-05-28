import { object, number, string, nativeEnum, preprocess } from 'zod';

import { ModelOrderBy } from '../dtos/Misc';

export const PaginationQueryValidator = object({
  page: preprocess(Number, number().min(0)).optional(),
  pageSize: preprocess(Number, number().min(1).max(20)).optional(),
  sortBy: string().optional(),
  orderBy: nativeEnum(ModelOrderBy).optional(),
  status: string().nonempty().optional()
});

export const SizeValidator = object({
  width: number().min(10).max(1000000),
  height: number().min(10).max(1000000),
});

export const PositionValidator = object({
  posX: number().min(0).max(1000000),
  posY: number().min(0).max(1000000),
});

export const Transform2DValidator = object({
  scaleX: number().optional(),
  scaleY: number().optional(),
});
