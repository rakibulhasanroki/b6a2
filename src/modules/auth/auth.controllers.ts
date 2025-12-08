import { Request, Response } from "express";
import { authServices } from "./auth.services";

const signupUser = async (req: Request, res: Response) => {
  const { name, email, password, phone, role } = req.body;

  try {
    if (role === "admin") {
      const authUser = req.user;

      if (!authUser || authUser.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Only admin can create another admin",
        });
      }
    } else if (role !== "customer") {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const result = await authServices.signupUser(
      name,
      email,
      password,
      phone,
      role
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await authServices.loginUser(email, password);
    if (result === null) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (result === false) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }
    res.status(200).json({
      success: true,
      message: "login successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const authController = {
  loginUser,
  signupUser,
};
