import { Response,Request, NextFunction } from "express";

const GlobalErrorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || 'error';
  const statusCode =  err.statusCode || 500;

  console.log(JSON.stringify(err, null, 2));

  return res.status(statusCode).json({
    status,
    message: err.message,
  });
};

export default GlobalErrorHandler;