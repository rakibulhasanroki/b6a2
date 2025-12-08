import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const adminAuth = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const role = req.body.role;
      if (role === "customer") {
        return next();
      }
      if (role === "admin") {
        const bearerToken = req.headers.authorization;
        const token = bearerToken?.split(" ")[1];

        if (!token) {
          return res
            .status(401)
            .json({ success: false, message: "Admin token required" });
        }

        const decoded = jwt.verify(
          token,
          config.secret as string
        ) as JwtPayload;
        req.user = decoded;
        if (decoded.role !== "admin") {
          return res.status(403).json({
            success: false,
            message: "Only admins can create admin accounts",
          });
        }

        return next();
      }
      return res.status(400).json({ success: false, message: "Invalid role" });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  };
};

export default adminAuth;
