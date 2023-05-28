import { NextFunction, Request } from 'express';
import { AnyZodObject, ZodError, ZodIssue } from 'zod';

import { IRouterResponseDTO, IErrorResponseDTO, RequestPayloadType, RouterResponseStatus } from "../dtos/Controller";

const transformErrorsToObject = (errors: ZodIssue[]): Record<string, string[]> => {
  return errors.reduce((acc, error) => {
    const key = error.path.join('.');
    const message = error.message;

    return {
      ...acc,
      [key]: [...(acc[key] || []), message],
    };
  }, {} as Record<string, string[]>);
};

export const ValidateRequestPayload =
  (schema: AnyZodObject, payloadTypes: RequestPayloadType[] = [RequestPayloadType.BODY]) =>
  (req: Request, res: IRouterResponseDTO<IErrorResponseDTO>, next: NextFunction) => {
    const payload = payloadTypes.reduce((acc, payloadType) => {
      return { ...acc, ...req[payloadType] };
    }, {});

    try {
      schema.parse(payload);
      next();
    } catch (err: any) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          status: RouterResponseStatus.ERROR,
          message: 'Invalid request data',
          errors: transformErrorsToObject(err.errors),
        });
      }
      next(err);
    }
  };
