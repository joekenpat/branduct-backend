import { Request } from "express";
import { IRouterResponseDTO, RouterResponseStatus } from "../dtos/Controller";
import { IHealthCheckResponseDTO } from "../dtos/HealthCheck";

export const Check = (_request: Request, response: IRouterResponseDTO<IHealthCheckResponseDTO>) => {
  return response
    .status(200)
    .json({
      status: RouterResponseStatus.SUCCESS,
      message: "Ok",
      uptimeInSeconds: Math.round(process.uptime()),
    });
};