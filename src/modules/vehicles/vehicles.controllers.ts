import { Request, Response } from "express";
import { vehiclesServices } from "./vehicles.services";

// validator function
const vehicleValidate = (vehicle: any) => {
  const vehicleTypes = ["car", "bike", "van", "SUV"];
  const vehicleStatus = ["available", "booked"];

  if (!vehicleTypes.includes(vehicle.type)) {
    throw new Error("Invalid vehicle type");
  }

  if (!vehicleStatus.includes(vehicle.availability_status)) {
    throw new Error("Invalid availability status");
  }

  if (vehicle.daily_rent_price <= 0) {
    throw new Error("daily_rent_price must be greater than 0");
  }
};

const postVehicle = async (req: Request, res: Response) => {
  try {
    vehicleValidate(req.body);
    const result = await vehiclesServices.postVehicle(req.body);

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const getVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesServices.getVehicles();
    if (!result.length) {
      throw new Error("No vehicles found");
    }
    const message = "Vehicles retrieved successfully";

    res.status(200).json({ success: true, message, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getVehicleByID = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesServices.getVehicleByID(req.params.vehicleId!);
    console.log(result);
    if (!result) {
      res.status(404).json({ success: false, message: "Vehicle not found" });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle retrieved successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const putVehicle = async (req: Request, res: Response) => {
  try {
    vehicleValidate(req.body);
    const updatedVehicle = await vehiclesServices.putVehicle(
      req.body,
      req.params.vehicleId!
    );

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: updatedVehicle,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesServices.deleteVehicles(req.params.vehicleId!);
    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully ",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
export const vehiclesControllers = {
  postVehicle,
  getVehicles,
  getVehicleByID,
  putVehicle,
  deleteVehicles,
};
