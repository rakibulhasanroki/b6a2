import express from "express";
import auth from "../../middleware/auth";
import { bookingsController } from "./bookings.controllers";

const router = express.Router();

router.post(
  "/bookings",
  auth("admin", "customer"),
  bookingsController.postBooking
);
router.get(
  "/bookings",
  auth("admin", "customer"),
  bookingsController.getBooking
);
router.put(
  "/bookings/:bookingId",
  auth("admin", "customer"),
  bookingsController.updateBooking
);

export const bookingsRouters = router;
