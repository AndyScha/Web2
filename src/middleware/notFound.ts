import { Request, Response, NextFunction } from "express";

export const notFound = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new Error(`Route nicht gefunden - ${req.originalUrl}`) as any;
  error.statusCode = 404;
  next(error);
};
