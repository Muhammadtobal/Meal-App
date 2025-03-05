import { ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((error) => ({
      field: error.path.join("."),
      message: error.message,
    }));
    return res.status(400).json({ error: formattedErrors });
  } else if (err instanceof Error) {
    return res.status(500).json({ error: err.message });
  } else {
    return res.status(500).json({ error: "An unknown error occurred" });
  }
};
export default errorHandler;
