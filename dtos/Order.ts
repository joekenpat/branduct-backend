import { Document, Types } from "mongoose";
import { IOrderProductDTO, OrderProductDTO } from "./OrderProduct";
import { OrderModel } from "../models/Order";
import { IPaginatedDTO } from "./Misc";
import { IUserDTO } from "./User";

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
  OUT_FOR_DELIVERY = "out-for-delivery",
  DELIVERED = "delivered",
  RETURNED = "returned",
  REFUNDED = "refunded"
};

export type IOrderDeliveryLocationDTO = Omit<IUserDTO, "active" | "isAdmin">

export interface IOrderDTO {
  orderId: string,
  transactionReference: string,
  transactionMerchant: string,
  userId?: Types.ObjectId,
  status: OrderStatus,
  deliveryLocation: IOrderDeliveryLocationDTO,
  deliveryCost: number,
  totalCost: number,
  orderProducts: (string | Types.ObjectId | IOrderProductDTO)[],
};

export type IOrderCostRequestDTO =  Pick<IOrderDTO, "deliveryCost" | "orderProducts">;

export interface IOrderProductCostDTO {
  id: string | Types.ObjectId,
  cost: number,
  productPrice: number
}

export interface IOrderCostResponseDTO {
  delivery: number,
  total: number,
  subTotal: number,
  orderProductCosts: IOrderProductCostDTO[],
}

export type ISaveOrderDTO = Omit<IOrderDTO, "totalCost" | "transactionMerchant">;

export interface IOrderResponseDTO {
  order: IOrderDTO;
};

export interface IOrdersResponseDTO {
  orders: IOrderDTO[];
};

export interface IOrderPaginationResponseDTO {
  orders: IPaginatedDTO<IOrderDTO>;
}

export type IUpdateOrderDTO = Partial<IOrderDTO>;

export type IOrderDocument = Document & IOrderDTO;

export class OrderDTO implements ISaveOrderDTO, IOrderDTO {
  orderId: string;
  transactionReference: string;
  transactionMerchant = "paystack";
  userId?: Types.ObjectId;
  status: OrderStatus;
  deliveryLocation: IOrderDeliveryLocationDTO;
  deliveryCost: number;
  orderProducts: (string | Types.ObjectId | IOrderProductDTO)[];

  constructor(data: ISaveOrderDTO | IOrderDTO) {
    this.orderId = data.orderId;
    this.transactionReference = data.transactionReference;
    this.userId = data.userId;
    this.status = data.status || OrderStatus.PENDING;
    this.deliveryLocation = data.deliveryLocation;
    this.deliveryCost = data.deliveryCost || 0;
    this.orderProducts = data.orderProducts;
  }

  get totalCost(): number {
    return this.orderProducts.reduce((acc, item) => {
      if (typeof item === "string" || item instanceof Types.ObjectId) {
        return acc;
      }

      return acc + new OrderProductDTO(item).cost;
    }, this.deliveryCost);
  };

  get toObject(): IOrderDTO {
    return {
      orderId: this.orderId,
      transactionReference: this.transactionReference,
      transactionMerchant: this.transactionMerchant,
      userId: this.userId,
      status: this.status,
      deliveryLocation: this.deliveryLocation,
      deliveryCost: this.deliveryCost,
      totalCost: this.totalCost,
      orderProducts: this.orderProducts,
    };
  }

  async save() {
    try {
      const { orderProducts: items, ...data } = this.toObject;
      const orderProducts = await Promise.all(items.map(item => {
        if (typeof item === "string" || item instanceof Types.ObjectId) {
          return item;
        }

        return new OrderProductDTO(item).save();
      }));

      const orderProductIds = orderProducts.map(item => {
        if (typeof item === "string"){
          return new Types.ObjectId(item);
        } else if (item instanceof Types.ObjectId) {
          return item;
        }
        return item._id;
      });

      return await OrderModel.create({
        ...data,
        orderProducts: orderProductIds,
      });
    } catch (error) {
      throw error;
    }
  }
}
