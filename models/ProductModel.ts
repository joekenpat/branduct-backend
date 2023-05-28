import { Model, model, Schema } from "mongoose";

import { IProductDocument, ProductSize } from "../dtos/Product";
import { ProductImageModel } from "./ProductImageModel";

const productSchema = new Schema<IProductDocument>({
  name: { type: String, required: true, min: 5, max: 255 },
  price: { type: Number, required: true },
  description: { type: String, required: true, min: 10, max: 2048 },
  colors: [{
    code: { type: String, required: true },
    textCode: { type: String, required: false, default: '#000000' }
  }, { min: 1, max: 10 } ],
  sizes: [{ type: String, required: true, enum: ProductSize, min: 1, max: 3 }],
  images: [{ type: Schema.Types.ObjectId, required: true, ref: ProductImageModel }],
},
{
  timestamps: true,
  collection: 'products',
  toObject: {
    versionKey: false
  }
});

export const ProductModel: Model<IProductDocument> = model<IProductDocument>('Product', productSchema);
