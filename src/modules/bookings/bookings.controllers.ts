import { Request, Response } from "express";
import { bookingsServices } from "./bookings.services";

const postBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingsServices.postBooking(req.body);

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const getBooking = async (req: Request, res: Response) => {
  try {
    const user = req.user as { id: string; role: string };
    const result = await bookingsServices.getBooking(user);

    if (!result.length) {
      return res.status(404).json({
        success: false,
        message: "No booking found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        user.role === "admin"
          ? "Bookings retrieved successfully"
          : "Your bookings retrieved successfully",
      data: result,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    const user = req.user as { id: string; role: string };
    const bookingId = req.params.bookingId;
    const { status } = req.body;

    const result = await bookingsServices.updateBooking(
      bookingId!,
      status,
      user
    );

    return res.status(200).json({
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const bookingsController = {
  postBooking,
  getBooking,
  updateBooking,
};
