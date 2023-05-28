import { object, array, number, string, nativeEnum, boolean, discriminatedUnion, literal, ZodEnum } from 'zod';

import { OrderStatus } from '../dtos/Order';
import { ProductSize } from '../dtos/Product';
import { ProductImageLocation } from '../dtos/ProductImage';
import { OrderProductItemTextAlign, OrderProductItemType } from '../dtos/OrderProductItem';
import { PositionValidator, SizeValidator, Transform2DValidator } from './Misc';
import { UserValidator } from './User';

export const UpdateOrderStatusParamValidator = object({
  id: string().nonempty(),
  status: nativeEnum(OrderStatus),
});

const validateTextItemShadow = object({
  colorCode: string().nonempty(),
  horizontal: number().min(0),
  vertical: number().min(0),
  blur: number().min(0),
});

const validateTextItemDecoration = object({
  underLine: boolean().optional(),
  lineThrough: boolean().optional(),
  overLine: boolean().optional(),
});

const validateTextItemOutline = object({
  colorCode: string().nonempty(),
  width: number().min(0),
});

const validateTextItemMetadata = object({
  text: string().nonempty().min(1).max(100),
  colorCode: string().nonempty(),
  fontName: string().nonempty(),
  fontSize: number().min(1),
  bold: boolean().optional(),
  italic: boolean().optional(),
  opacity: number().min(0).max(1),
  textAlign: nativeEnum(OrderProductItemTextAlign),
  textShadow: validateTextItemShadow.optional(),
  textDecoration: validateTextItemDecoration.optional(),
  textOutline: validateTextItemOutline.optional(),
});

const validateImageItemMetadata = object({
  url: string().nonempty().url(),
});

const OrderProductItemBaseValidator = object({
  location: nativeEnum(ProductImageLocation),
  size: SizeValidator,
  position: PositionValidator,
  transform2d: Transform2DValidator,
  rotation: number().min(0).max(360),
});

const OrderProductItemTextValidator = OrderProductItemBaseValidator
  .merge(object({
    metadata: validateTextItemMetadata,
    itemType: literal(OrderProductItemType.TEXT),
  }));

const OrderProductItemImageValidator = OrderProductItemBaseValidator
  .merge(object({
    metadata: validateImageItemMetadata,
    itemType: literal(OrderProductItemType.IMAGE),
  }));

export const OrderProductItemValidator = discriminatedUnion('itemType', [
  OrderProductItemTextValidator.strict(),
  OrderProductItemImageValidator.strict(),
]);

export const OrderProductValidator = object({
  productId: string().nonempty(),
  quantity: number().min(1),
  colorCode: string().nonempty(),
  size: nativeEnum(ProductSize),
  orderProductItems: array(OrderProductItemValidator).max(10).min(1),
});

export const DeliveryLocationValidator = UserValidator.omit({
  password: true,
  isAdmin: true,
  isActive: true,
});

export const CreateOrderValidator = object({
  orderId: string().uuid(),
  userId: string().nonempty().optional(),
  transactionReference: string().nonempty(),
  deliveryLocation: DeliveryLocationValidator,
  deliveryCost: number().min(0),
  orderProducts: array(OrderProductValidator).max(10).min(1),
});
