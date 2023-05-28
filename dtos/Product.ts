import { Document, Types } from "mongoose"

import { IPaginatedDTO } from "./Misc";
import { IProductImageDTO } from "./ProductImage";

export enum ProductSize {
  S = "S",
  M = "M",
  L = "L",
  XL = "XL",
  XXL = "2XL",
};

export interface IProductColorDTO {
  code: string,
  textCode: string
};

export interface IProductDTO {
  name: string,
  price: number,
  description: string,
  colors: IProductColorDTO[],
  sizes: ProductSize[],
  images: (string | Types.ObjectId | IProductImageDTO)[],
};

export interface IProductResponseDTO {
  product: IProductDTO;
};

export interface IProductsResponseDTO {
  products: IPaginatedDTO<IProductDTO>;
};

export type IUpdateProductDTO = Partial<IProductDTO>;

export type IProductDocument = Document & IProductDTO;
