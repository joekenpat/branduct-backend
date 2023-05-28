import { Types } from "mongoose"

import { ProductSize } from "./Product"
import { IOrderProductItemDTO, OrderProductItemDTO } from "./OrderProductItem"
import { OrderProductModel } from "../models/OrderProduct";

export interface IOrderProductDTO {
  productId: Types.ObjectId,
  colorCode: string,
  size: ProductSize,
  quantity: number,
  orderProductItems: (string | Types.ObjectId | IOrderProductItemDTO)[],
};

export type IOrderProductDocument = Document & IOrderProductDTO & {
  cost: number,
}

export class OrderProductDTO implements IOrderProductDTO {
  productId: Types.ObjectId;
  colorCode: string;
  size: ProductSize;
  quantity: number;
  orderProductItems: (string | Types.ObjectId | IOrderProductItemDTO)[];

  constructor(data: IOrderProductDTO) {
    this.productId = data.productId;
    this.colorCode = data.colorCode;
    this.size = data.size;
    this.quantity = data.quantity;
    this.orderProductItems = data.orderProductItems;
  };

  get cost(): number {
    return this.orderProductItems.reduce((acc, item) => {
      if (typeof item === "string" || item instanceof Types.ObjectId) {
        return acc;
      }

      return acc + new OrderProductItemDTO(item).cost;
    }, 0) * this.quantity;
  };

  get toObject(): IOrderProductDTO & { cost: number } {
    return {
      productId: this.productId,
      colorCode: this.colorCode,
      size: this.size,
      quantity: this.quantity,
      orderProductItems: this.orderProductItems,
      cost: this.cost,
    };
  };

  async save() {
    try {
      const { orderProductItems: items, ...data } = this.toObject;
      const productItems = await Promise.all(items.map(item => {
        if (typeof item === "string" || item instanceof Types.ObjectId) {
          return item;
        }

        return new OrderProductItemDTO(item).save();
      }));
      const productItemIds = productItems.map(item => {
        if (typeof item === "string"){
          return new Types.ObjectId(item);
        } else if (item instanceof Types.ObjectId) {
          return item;
        }
        return item._id;
      });

      return await OrderProductModel.create({
        ...data,
        orderProductItems: productItemIds,
      });
    } catch (err) {
      throw err;
    }
  }
};
