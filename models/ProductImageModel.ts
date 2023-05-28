import { model, Model, Schema } from "mongoose";

import { IProductImageDocument, ProductImageLocation } from "../dtos/ProductImage";

const productImageSchema = new Schema<IProductImageDocument>({
  url: { type: String, required: true, min: 5, max: 2048 },
  productId: { type: Schema.Types.ObjectId, required: true, ref: 'products'},
  location: { type: String, required: true, enum: ProductImageLocation, min: 4, max: 10 },
  colorCode: { type: String, required: true, min: 4, max: 10 },
  printableAreas: [{
    name: { type: String, required: true, min: 4, max: 10 },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    posX: { type: Number, required: true },
    posY: { type: Number, required: true },
  }],
},
{
  timestamps: true,
  collection: 'product_images',
  toObject: {
    versionKey: false
  }
});

export const ProductImageModel: Model<IProductImageDocument> = model<IProductImageDocument>('ProductImage', productImageSchema);
