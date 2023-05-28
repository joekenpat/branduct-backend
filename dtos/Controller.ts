import { Request, Response } from "express";
import { Query, Send, ParamsDictionary } from 'express-serve-static-core';

export enum RouterResponseStatus {
  SUCCESS = "success",
  ERROR = "error"
};

export enum RequestPayloadType {
  BODY = "body",
  QUERY = "query",
  PARAMS = "params"
};

interface BaseRouterResponse {
  status: RouterResponseStatus;
  message: string;
};

export interface IRouterResponseDTO<T> extends Response {
  json: Send<BaseRouterResponse & T, this>;
};

export interface IRouterRequestParamsDTO<P extends ParamsDictionary> extends Request {
  params: P;
};

export interface IRouterRequestQueryDTO<Q extends Query> extends Request {
  query: Q;
};

export interface IRouterRequestBodyDTO<B> extends Request {
  body: B;
};

export interface IRouterRequestParamQueryDTO<P extends ParamsDictionary, Q extends Query> extends Request {
  params: P;
  query: Q;
};

export interface IRouterRequestParamBodyDTO<P extends ParamsDictionary, B> extends Request {
  params: P;
  body: B;
};

export interface IRouterRequestQueryBodyDTO<Q extends Query, B> extends Request {
  query: Q;
  body: B;
};

export interface IRouterRequestParamQueryBodyDTO<P extends ParamsDictionary, Q extends Query, B> extends Request {
  params: P;
  query: Q;
  body: B;
};

export interface IErrorResponseDTO {
  errors: Record<string, string[]>;
};

export type IRouterResponse<T = {}> = IRouterResponseDTO<T> | IRouterResponseDTO<IErrorResponseDTO>;
