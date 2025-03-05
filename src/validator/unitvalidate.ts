import { Request, Response, NextFunction } from "express";
import { ZodError, ZodType } from "zod";
import argon2 from "argon2";

import { uploadPathCategory, uploadPathItem } from "../utils/uploads";
import { deleteFile } from "../utils/uploads";
export const validateDataAndImage =
  (schema: ZodType<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
     await schema.parseAsync(req.body);
      next();
    } catch (err: any) {
      if (req.file) {
        const paths = [uploadPathCategory, uploadPathItem];
        await deleteFile(req.file.filename, paths);
      }

      next(err);
    }
  };

export async function hashPassword(password: any) {
  const hashPassword = await argon2.hash(password);
  return hashPassword;
}
export async function comparePassword(val: string, value: string) {
  return await argon2.verify(val, value);
}
