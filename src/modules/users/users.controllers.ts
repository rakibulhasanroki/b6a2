import { Request, Response } from "express";
import { usersServices } from "./users.services";

const getUser = async (req: Request, res: Response) => {
  try {
    const result = await usersServices.getUser();
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const currentUser = req.user as { id: string; role: string };

  const currentUserId = String(currentUser.id);
  const updateUserId = String(req.params.userId);

  if (currentUser.role !== "admin" && currentUserId !== updateUserId) {
    return res.status(403).json({
      success: false,
      message: "You can only update your own profile",
    });
  }

  if (currentUser.role !== "admin") {
    if (req.body.email || req.body.role) {
      return res.status(403).json({
        success: false,
        message: "You cannot update email or role as a customer",
      });
    }
  }

  try {
    const result = await usersServices.updateUser(req.body, updateUserId);
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await usersServices.deleteUser(req.params.userId!);

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "user not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "user deleted successfully",
        data: result.rows,
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const usersControllers = {
  getUser,
  updateUser,
  deleteUser,
};
