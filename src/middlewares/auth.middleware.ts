import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config/env.js";

const authMiddleware = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const decoded = jwt.verify(
        token,
        config.JWT_SECRET as string,
      ) as JwtPayload;

      req.user = decoded;

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default authMiddleware;
