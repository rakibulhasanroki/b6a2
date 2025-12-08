import { pool } from "../../config/db";

const postBooking = async (payload: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  const rentSTart = new Date(rent_start_date as string);
  const rentEnd = new Date(rent_end_date as string);

  if (rentEnd <= rentSTart) {
    throw new Error("rent_end_date must be after rent_start_date");
  }

  const vehicleResult = await pool.query("SELECT * FROM vehicles WHERE id=$1", [
    vehicle_id,
  ]);
  const vehicle = vehicleResult.rows[0];

  if (!vehicle) throw new Error("Vehicle not found");

  if (vehicle.availability_status === "booked") {
    throw new Error("Vehicle is already booked");
  }

  const oneDay = 1000 * 60 * 60 * 24;
  const days = Math.ceil((rentEnd.getTime() - rentSTart.getTime()) / oneDay);
  const total_price = days * parseFloat(vehicle.daily_rent_price);

  const bookingResult = await pool.query(
    `INSERT INTO bookings 
     (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      "active",
    ]
  );
  const bookings = bookingResult.rows[0];

  await pool.query(
    `UPDATE vehicles SET availability_status='booked' WHERE id=$1`,
    [vehicle_id]
  );

  return {
    ...bookings,
    vehicle: {
      vehicle_name: vehicle.vehicle_name,
      daily_rent_price: vehicle.daily_rent_price,
    },
  };
};

const getBooking = async (user: { id: string; role: string }) => {
  if (user.role === "admin") {
    const result = await pool.query("SELECT * FROM bookings");

    const allUsersBooking = [];

    for (const user of result.rows) {
      const customerInfo = await pool.query(
        "SELECT name, email FROM users WHERE id=$1",
        [user.customer_id]
      );
      const customer = customerInfo.rows[0];

      const vehicleInfo = await pool.query(
        "SELECT vehicle_name, registration_number FROM vehicles WHERE id=$1",
        [user.vehicle_id]
      );
      const vehicle = vehicleInfo.rows[0];

      allUsersBooking.push({
        ...user,
        customer,
        vehicle,
      });
    }

    return allUsersBooking;
  } else {
    const result = await pool.query(
      "SELECT id, vehicle_id, rent_start_date, rent_end_date, total_price, status FROM bookings WHERE customer_id=$1",
      [user.id]
    );

    const customerOnly = [];

    for (const user of result.rows) {
      const vehicleRes = await pool.query(
        "SELECT vehicle_name, registration_number, type FROM vehicles WHERE id=$1",
        [user.vehicle_id]
      );
      const vehicle = vehicleRes.rows[0];

      customerOnly.push({
        ...user,
        vehicle,
      });
    }

    return customerOnly;
  }
};

const updateBooking = async (
  bookingId: string,
  status: string,
  user: { id: string; role: string }
) => {
  // bookingId
  const bookingResult = await pool.query("SELECT * FROM bookings WHERE id=$1", [
    bookingId,
  ]);
  const booking = bookingResult.rows[0];

  if (!booking) throw new Error("Booking not found");

  const currentDate = new Date();
  const rentStart = new Date(booking.rent_start_date);

  // customer cancelled
  if (user.role === "customer" && status === "cancelled") {
    if (booking.customer_id !== parseInt(user.id)) {
      throw new Error("You can only cancel your own bookings");
    }

    if (rentStart <= currentDate) {
      throw new Error("Cannot cancel booking after start date");
    }

    const updateResult = await pool.query(
      "UPDATE bookings SET status='cancelled' WHERE id=$1 RETURNING *",
      [bookingId]
    );

    await pool.query(
      "UPDATE vehicles SET availability_status='available' WHERE id=$1",
      [booking.vehicle_id]
    );

    return {
      data: updateResult.rows[0],
      message: "Booking cancelled successfully",
    };
  }
  // validation check
  if (user.role !== "admin" && status === "returned") {
    throw new Error("You are not authorized to mark a booking as returned");
  }
  // admin returned
  if (user.role === "admin" && status === "returned") {
    const updateResult = await pool.query(
      "UPDATE bookings SET status='returned' WHERE id=$1 RETURNING *",
      [bookingId]
    );
    const vehicleResult = await pool.query(
      "UPDATE vehicles SET availability_status='available' WHERE id=$1 RETURNING *",
      [booking.vehicle_id]
    );

    const status = vehicleResult.rows[0].availability_status;

    return {
      message: "Booking marked as returned. Vehicle is now available",
      data: {
        ...updateResult.rows[0],
        vehicle: {
          availability_status: status,
        },
      },
    };
  }

  throw new Error("Invalid action or insufficient permissions");
};

// autoupdate logic
export const autoReturnLogic = () => {
  setInterval(async () => {
    const currentDate = new Date();

    const result = await pool.query(
      "SELECT id, vehicle_id, rent_end_date FROM bookings WHERE status='active'"
    );

    for (const booking of result.rows) {
      const rentEnd = new Date(booking.rent_end_date);

      if (rentEnd < currentDate) {
        await pool.query("UPDATE bookings SET status='returned' WHERE id=$1", [
          booking.id,
        ]);

        await pool.query(
          "UPDATE vehicles SET availability_status='available' WHERE id=$1",
          [booking.vehicle_id]
        );
      }
    }
  }, 3600000);
};

export const bookingsServices = {
  postBooking,
  getBooking,
  updateBooking,
};
