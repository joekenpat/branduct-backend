import { Document, Types } from "mongoose"

import { IPositionDTO, ISizeDTO } from "./Misc";

export enum ProductImageLocation {
  FRONT = "front",
  BACK = "back",
  SHOULDER = "shoulder",
  HAND = "hand",
  THIGH = "thigh"
};

export interface PrintableArea extends ISizeDTO, IPositionDTO {
  name: string,
}

export interface IProductImageDTO {
  productId: Types.ObjectId,
  url: string,
  location: ProductImageLocation,
  colorCode: string,
  printableAreas: PrintableArea[]
};

export interface IUpdateProductImageDTO extends Partial<IProductImageDTO> { };

export interface ICreateProductColorImagesDTO {
  productId: string,
  colorCode: string,
  images: Omit<IProductImageDTO, "colorCode" | "productId">[]
};

export interface IProductImageResponseDTO {
  productImages: IProductImageDTO[]
};

export type IProductImageDocument = Document & IProductImageDTO;
