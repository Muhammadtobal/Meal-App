import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "../enum";
declare global {
  namespace Express {
    interface Request {
      userr?: {
        role: UserRole;
        [key: string]: any;
      };
    }
  }
}

export default function verifyToken(roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    let token: string | undefined;

    token =
      req.headers.postman === "postman"
        ? req.headers.authorization
        : req.cookies["Authorization"];

    if (!token) {
      throw new Error("No token provided.");
    }

    try {
      const extractedToken = token.startsWith("Bearer ")
        ? token.split(" ")[1]
        : token;

      const decoded = jwt.verify(
        extractedToken,
        process.env.SECRET_TOKEN as string
      ) as { role: UserRole; [key: string]: any };

      req.userr = decoded;

      if (roles.includes(req.userr.role)) {
        return next();
      } else {
        throw new Error("You do not have authorization.");
      }
    } catch (error) {
      next(error);
    }
  };
}
