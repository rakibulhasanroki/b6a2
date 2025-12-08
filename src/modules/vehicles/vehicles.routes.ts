import express from "express";
import auth from "../../middleware/auth";
import { vehiclesControllers } from "./vehicles.controllers";

const router = express.Router();
// admin only
router.post("/vehicles", auth("admin"), vehiclesControllers.postVehicle);

// // public
router.get("/vehicles", vehiclesControllers.getVehicles);
router.get("/vehicles/:vehicleId", vehiclesControllers.getVehicleByID);

// // admin only
router.put(
  "/vehicles/:vehicleId",
  auth("admin"),
  vehiclesControllers.putVehicle
);
router.delete(
  "/vehicles/:vehicleId",
  auth("admin"),
  vehiclesControllers.deleteVehicles
);

export const vehiclesRoutes = router;
