import { Model, model, Schema } from "mongoose";
import { IOrderProductItemDocument, OrderProductItemTextAlign, OrderProductItemType } from "../dtos/OrderProductItem";
import { ProductImageLocation } from "../dtos/ProductImage";

const isImageItem = (itemType: OrderProductItemType) => itemType === OrderProductItemType.IMAGE;

const genericNumberValidator = { type: Number, required: true, min: 0 };
const genericOptionalNumberValidator = { type: Number, default: 0 };
const genericStringValidator = { type: String, required: true };
const genericBooleanValidator = { type: Boolean, default: false };

const textItemDecorationSchema = {
  underline: genericBooleanValidator,
  lineThrough: genericBooleanValidator,
  overline: genericBooleanValidator,
};

const textItemShadowSchema = {
  colorCode: { ...genericStringValidator, required: false, default: '' },
  blur: { ...genericNumberValidator, required: false, default: 0 },
  horizontal: { ...genericNumberValidator, required: false, default: 0 },
  vertical: { ...genericNumberValidator, required: false, default: 0 },
};

const textItemOutlineSchema = {
  colorCode: { ...genericStringValidator, required: false, default: '' },
  width: { ...genericNumberValidator, required: false, default: 0 },
};

const OrderProductItemSchema = new Schema<IOrderProductItemDocument>({
  location: { type: String, required: true, enum: ProductImageLocation },
  rotation: { ...genericNumberValidator, max: 360 },
  itemType: { type: String, required: true, enum: OrderProductItemType },
  cost: { ...genericNumberValidator, required: true },
  size: { width: genericNumberValidator, height: genericNumberValidator },
  position: { posX: genericNumberValidator, posY: genericNumberValidator },
  transform2d: {
    scaleX: { ...genericOptionalNumberValidator, default: 1 },
    scaleY: { ...genericOptionalNumberValidator, default: 1 },
  },
  metadata: {
    url: { ...genericStringValidator, required: isImageItem },
    text: { ...genericStringValidator, required: isImageItem },
    colorCode: { ...genericStringValidator, required: isImageItem },
    fontName: { ...genericStringValidator, required: isImageItem },
    fontSize: { ...genericNumberValidator, required: isImageItem },
    bold: { type: Boolean, default: false },
    italic: { type: Boolean, default: false },
    opacity: { ...genericNumberValidator, max: 1, default: 1 },
    textAlign: { type: String, required: true, enum: OrderProductItemTextAlign, default: 'left' },
    textShadow: textItemShadowSchema,
    textDecoration: textItemDecorationSchema,
    textOutline: textItemOutlineSchema,
  }
},
{
  timestamps: true,
  collection: 'order_product_items',
  toObject: {
    versionKey: false
  }
});

export const OrderProductItemModel: Model<IOrderProductItemDocument> = model<IOrderProductItemDocument>('OrderProductItem', OrderProductItemSchema);
