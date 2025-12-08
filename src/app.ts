import express from "express";

import initDB from "./config/db";
import { authRoutes } from "./modules/auth/auth.routes";
import { vehiclesRoutes } from "./modules/vehicles/vehicles.routes";
import { usersRoutes } from "./modules/users/users.routes";
import { bookingsRouters } from "./modules/bookings/bookings.routes";
import { autoReturnLogic } from "./modules/bookings/bookings.services";
const app = express();

// parser for get body data
app.use(express.json());

// initializing db
initDB();

autoReturnLogic();

// check-server
app.get("/", (req, res) => {
  res.send("Vehicle Rental System");
});

// Routes
app.use("/api/v1", authRoutes);
app.use("/api/v1", vehiclesRoutes);
app.use("/api/v1", usersRoutes);
app.use("/api/v1", bookingsRouters);

export default app;
