import { Model, model, Schema } from "mongoose";

import { IOrderProductDocument } from "../dtos/OrderProduct";
import { ProductSize } from "../dtos/Product";
import { OrderProductItemModel } from "./OrderProductItem";
import { ProductModel } from "./ProductModel";

const genericNumberValidator = { type: Number, required: true, min: 0 };
const OrderProductSchema = new Schema<IOrderProductDocument>({
  productId: { type: Schema.Types.ObjectId, required: true, ref: ProductModel },
  size: { type: String, required: true, enum: ProductSize },
  colorCode: { type: String, required: true },
  quantity: genericNumberValidator,
  cost: genericNumberValidator,
  orderProductItems: [{ type: Schema.Types.ObjectId, required: true, ref: OrderProductItemModel }],
},
{
  timestamps: true,
  collection: 'order_products',
  toObject: {
    versionKey: false
  }
});

export const OrderProductModel: Model<IOrderProductDocument> = model<IOrderProductDocument>('OrderProduct', OrderProductSchema);
