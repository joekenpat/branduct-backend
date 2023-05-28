import { Router } from "express";

import { ValidateRequestPayload } from "../middleware/ValidateRequestPayload";
import * as OrderService from "../services/OrderService";
import { RequestPayloadType } from "../dtos/Controller";
import { CreateOrderValidator, UpdateOrderStatusParamValidator } from "../validators/Order";
import { PaginationQueryValidator } from "../validators/Misc";

const OrderController: Router = Router();

OrderController.post("/orders", ValidateRequestPayload(CreateOrderValidator), OrderService.HandleAddOrder);
OrderController.get(
  "/orders",
  ValidateRequestPayload(
    PaginationQueryValidator,
    [RequestPayloadType.QUERY]
  ),
  OrderService.HandleGetOrders
);
OrderController.get("/orders/:id", OrderService.HandleGetOrder);
OrderController.patch(
  "/orders/:id/status/:status",
  ValidateRequestPayload(
    UpdateOrderStatusParamValidator,
    [RequestPayloadType.PARAMS]
  ),
  OrderService.HandleUpdateOrderStatus
);

export default OrderController;
