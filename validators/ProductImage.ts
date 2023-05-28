import { object, string, nativeEnum, array } from 'zod';

import { ProductImageLocation } from '../dtos/ProductImage';
import { PositionValidator, SizeValidator } from './Misc';

const printableAreasValidator = object({
  name: string().nonempty(),
}).merge(SizeValidator).merge(PositionValidator);

export const CreateProductColorImagesDTOValidator = object({
  productId: string().nonempty(),
  colorCode: string().min(4).max(10),
  images: object({
    url: string().url().min(1).max(2048),
    location: nativeEnum(ProductImageLocation),
    printableAreas: array(printableAreasValidator).min(1).max(5)
  }).array().min(1).max(10)
});
