import { Request, Response } from "express";
import { vehicleService } from "./vehicles.services.js";

const createVehicle = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const result = await vehicleService.createVehicle(req.body);

    res.status(201).json({
      success: true,
      message: "Data Inserted Successfully.",
      data: result.rows[0],
    });

    console.log("Data Inserted Successfully:", result.rows[0]);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      details: error,
    });
  }
};
const getVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.getVehicles();
    res.status(202).json({
      success: true,
      message: "Users Retrieved Successfully.",
      length: result.rows.length,
      data: result.rows,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: error.message, details: error });
  }
};

export const vehiclesController = {
  createVehicle,getVehicles
};
