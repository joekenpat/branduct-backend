import { QueryOptions } from 'mongoose';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { Request } from 'express';

import { IErrorResponseDTO, IRouterRequestBodyDTO, IRouterRequestParamsDTO, IRouterResponseDTO, RouterResponseStatus } from '../dtos/Controller';
import { IOrderResponseDTO, IOrderDTO, OrderDTO, IOrderPaginationResponseDTO } from '../dtos/Order';
import { IPaginateModelRequestQueryDTO } from '../dtos/Misc';
import { PaginateModel } from '../utils/PaginateModel';
import { OrderModel } from '../models/Order';

const updateOptions: QueryOptions = {
  upsert: false,
  new: true,
}

export const HandleAddOrder = async (
  req: IRouterRequestBodyDTO<IOrderDTO>,
  res: IRouterResponseDTO<IOrderResponseDTO | IErrorResponseDTO>
) => {
  const data = new OrderDTO(req.body)
  const order = await data.save();

  return res.status(StatusCodes.CREATED).json({
    status: RouterResponseStatus.SUCCESS,
    message: "Order product item added successfully",
    order
  });
};

export const HandleGetOrders = async (
  req: Request<IPaginateModelRequestQueryDTO>,
  res: IRouterResponseDTO<IOrderPaginationResponseDTO | IErrorResponseDTO>
) => {
  const query = req.query as IPaginateModelRequestQueryDTO;
  const filter = query.status ? { status: query.status } : {};
  const orders = await PaginateModel(
    OrderModel,
    query.page,
    query.pageSize,
    query.sortBy,
    query.orderBy,
    [{
      path: 'orderProducts',
      populate: [{
        path: 'orderProductItems',
      }]
    }],
    filter
  );

  return res.status(StatusCodes.OK).json({
    status: RouterResponseStatus.SUCCESS,
    message: ReasonPhrases.OK,
    orders
  });
};

export const HandleGetOrder = async (
  req: IRouterRequestParamsDTO<{ id: string }>,
  res: IRouterResponseDTO<IOrderResponseDTO | IErrorResponseDTO>
) => {
  const order = await OrderModel.findById(req.params.id).lean().populate({
    path: 'orderProducts',
    populate: [{
      path: 'orderProductItems',
    }]
  });

  if (!order) {
    return res.status(StatusCodes.NOT_FOUND).json({
      status: RouterResponseStatus.ERROR,
      message: "Order not found",
      errors: {
        server: [`Order with id: ${req.params.id} not found`],
      }
    });
  }

  return res.status(StatusCodes.OK).json({
    status: RouterResponseStatus.SUCCESS,
    message: ReasonPhrases.OK,
    order
  });
}

export const HandleUpdateOrderStatus = async (
  req: IRouterRequestParamsDTO<{ id: string, status: string }>,
  res: IRouterResponseDTO<IOrderResponseDTO | IErrorResponseDTO>
) => {
  const order = await OrderModel.findByIdAndUpdate(
    req.params.id,
    { status: req.params.status },
    updateOptions
    ).lean();

  if (!order) {
    return res.status(StatusCodes.NOT_FOUND).json({
      status: RouterResponseStatus.ERROR,
      message: "Order not found",
      errors: {
        server: [`Order with id: ${req.params.id} not found`],
      }
    });
  }

  return res.status(StatusCodes.OK).json({
    status: RouterResponseStatus.SUCCESS,
    message: ReasonPhrases.OK,
    order
  });
}
