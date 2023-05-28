import { Types } from "mongoose";

import { OrderStatus } from "./Order";

export interface IOrderChangeHistoryDTO {
  orderId: Types.ObjectId,
  status: OrderStatus,
  date: Date | string,
  comment: string,
};

export interface IOrderChangeHistoryResponseDTO {
  orderChangeHistory: IOrderChangeHistoryDTO;
};

export interface IOrderChangeHistoriesResponseDTO {
  orderChangeHistories: IOrderChangeHistoryDTO[];
};

export type IOrderChangeHistoryDocument = Document & IOrderChangeHistoryDTO;
