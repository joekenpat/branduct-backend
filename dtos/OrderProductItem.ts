import { OrderProductItemModel } from "../models/OrderProductItem";
import { ITransformScaleDTO, IPositionDTO, ISizeDTO } from "./Misc";
import { ProductImageLocation } from "./ProductImage";

export enum OrderProductItemType {
  IMAGE = "image",
  TEXT = "text",
}; 

export enum OrderProductItemTextAlign {
  LEFT = "left",
  CENTER = "center",
  RIGHT = "right",
};

export interface IOrderProductItemTextShadowDTO {
  colorCode: string,
  horizontal: number,
  vertical: number,
  blur: number,
};

export interface IOrderProductItemTextDecorationDTO {
  underLine: boolean,
  lineThrough: boolean,
  overLine: boolean,
};

export interface IOrderProductItemTextOutlineDTO {
  colorCode: string,
  width: number,
};

export interface IOrderProductItemTextMetadataDTO {
  text: string,
  colorCode: string,
  fontName: string,
  fontSize: number,
  bold: boolean,
  italic: boolean,
  opacity: number,
  textAlign: OrderProductItemTextAlign,
  textShadow: IOrderProductItemTextShadowDTO
  textDecoration: IOrderProductItemTextDecorationDTO,
  textOutline: IOrderProductItemTextOutlineDTO,
};

export interface IOrderProductItemImageMetadataDTO {
  url: string,
};

export interface IOrderProductItemDTO {
  location: ProductImageLocation,
  size: ISizeDTO,
  position: IPositionDTO,
  transform2d: ITransformScaleDTO,
  rotation: number,
  itemType: OrderProductItemType,
  metadata: IOrderProductItemTextMetadataDTO | IOrderProductItemImageMetadataDTO,
};

export interface IOrderProductItemResponseDTO {
  productItem: IOrderProductItemDTO,
}

export interface IOrderProductItemsResponseDTO {
  productItems: IOrderProductItemDTO[],
}

export type IOrderProductItemDocument = Document & IOrderProductItemDTO & {
  cost: number,
}

export class OrderProductItemDTO implements IOrderProductItemDTO {
  location: ProductImageLocation;
  size: ISizeDTO;
  position: IPositionDTO;
  transform2d: ITransformScaleDTO;
  rotation: number;
  itemType: OrderProductItemType
  metadata: IOrderProductItemTextMetadataDTO | IOrderProductItemImageMetadataDTO;
  private _baseArea = 100;
  private _basePrice = 10;
  private _pricePerCharacter = 0.5;
  private _pricePerSquareInch = 0.25;
  private _minImageModificationArea = 50;
  private _maxImageModificationArea = 1000;

  constructor(data: IOrderProductItemDTO) {
    this.location = data.location;
    this.size = data.size;
    this.position = data.position;
    this.rotation = data.rotation;
    this.transform2d = data.transform2d;
    this.itemType = data.itemType;
    this.metadata = data.metadata;
  }

  get cost(): number {
    if (this.itemType === OrderProductItemType.IMAGE) {
      const area =  this.calculateImageArea();
      const areaCost = area > this._baseArea
        ? (area - this._baseArea) * this._pricePerSquareInch
        : 0;

      return this._basePrice + areaCost;
    }

    if (!this.isImageItem && "text" in this.metadata) {
      const baseCharacters = 3;
      const characterCost = this.metadata.text.length > baseCharacters
        ? (this.metadata.text.length - baseCharacters) * this._pricePerCharacter
        : 0;

      return this._basePrice + characterCost;
    }

    return 0;
  }

  private calculateImageArea(): number {
    const { width, height } = this.size;
    const area = width * height;
    const { scaleX, scaleY } = this.transform2d;
    const scale = scaleX * scaleY;
    const modifiedArea = area * scale;
    const minArea = this._minImageModificationArea;
    const maxArea = this._maxImageModificationArea;

    return modifiedArea > minArea && modifiedArea < maxArea
      ? modifiedArea
      : area;
  }

  get isImageItem(): boolean {
    return this.itemType === OrderProductItemType.IMAGE;
  }

  get toObject(): IOrderProductItemDTO & { cost: number } {
    return {
      location: this.location,
      size: this.size,
      position: this.position,
      rotation: this.rotation,
      transform2d: this.transform2d,
      itemType: this.itemType,
      metadata: this.metadata,
      cost: this.cost,
    };
  }

  async save() {
    try {
      return await OrderProductItemModel.create(this.toObject);
    } catch (error) {
      throw error;
    }
  }
};