import { Model, model, Schema } from "mongoose";

import { IOrderDocument, OrderStatus } from "../dtos/Order";
import { OrderProductModel } from "./OrderProduct";

const genericNumberValidator = { type: Number, required: true, min: 0 };
const genericStringValidator = { type: String, required: true };
const OrderSchema = new Schema<IOrderDocument>({
 orderId: genericStringValidator,
 transactionReference: genericStringValidator,
 transactionMerchant: { ...genericStringValidator, default: 'paystack' },
 userId: { type: Schema.Types.ObjectId, required: false, default: null, ref: 'users' },
 status: { type: String, required: true, enum: OrderStatus },
 deliveryCost: genericNumberValidator,
 totalCost: genericNumberValidator,
 orderProducts: [{ type: Schema.Types.ObjectId, required: true, ref: OrderProductModel }],
 deliveryLocation: {
    state: genericStringValidator,
    lga: genericStringValidator,
    address: genericStringValidator,
    email: genericStringValidator,
    phone: genericStringValidator,
 }
},
{
  timestamps: true,
  collection: 'orders',
  toObject: {
    versionKey: false
  }
});

export const OrderModel: Model<IOrderDocument> = model<IOrderDocument>('Order', OrderSchema);
