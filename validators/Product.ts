import { object, array, number, string, nativeEnum } from 'zod';

import { ProductColorValidator } from './ProductColor';
import { ProductSize } from '../dtos/Product';

const [
  nameValidator,
  priceValidator,
  descriptionValidator,
  colorsValidator,
  sizesValidator
] = [
  string().max(255).min(5, "Product name is too short"),
  number().max(1000000).min(1, "Product price must be greater than 0"),
  string().max(2048).min(10, "Product description is too short"),
  array(ProductColorValidator).max(10).min(1, "Product must have at least one color"),
  array(nativeEnum(ProductSize)).max(100).min(1, "Product must have at least one size")
]

export const CreateProductValidator = object({
  name: nameValidator,
  price: priceValidator,
  colors: colorsValidator,
  sizes: sizesValidator,
  description: descriptionValidator,
});

export const UpdateProductValidator = object({
  name: nameValidator.optional(),
  price: priceValidator.optional(),
  colors: colorsValidator.optional(),
  sizes: sizesValidator.optional(),
  description: descriptionValidator.optional()
});
