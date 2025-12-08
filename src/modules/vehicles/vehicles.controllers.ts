import { Request, Response } from "express";
import { vehicleService } from "./vehicles.services.js";

const createVehicle = async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await vehicleService.createVehicle(payload);
  res.status(201).json({
    success: true,
    message: "Vehicle created successfully",
    data: result,
  });
};

const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await vehicleService.getAllVehicles();
    if (!vehicles.length) {
      return res.status(200).json({
        success: true,
        message: "No vehicles found",
        data: [],
      });
    }
    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: vehicles,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
};

const getVehicleById = async (req: Request, res: Response) => {
  try {
    const vehicleId = Number(req.params.vehicleId);
    if (isNaN(vehicleId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid vehicle ID" });
    }
    const vehicle = await vehicleService.getVehicleById(vehicleId);
    if (!vehicle) {
      return res
        .status(404)
        .json({ success: false, message: "Vehicle not found" });
    }
    res.status(200).json({
      success: true,
      message: "Vehicle retrieved successfully",
      data: vehicle,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  try {
    const vehicleId = Number(req.params.vehicleId);
    console.log(vehicleId);
    if (isNaN(vehicleId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid vehicle ID" });
    }
    const updatedVehicle = await vehicleService.updateVehicle(
      vehicleId,
      req.body
    );
    if (!updatedVehicle) {
      return res
        .status(404)
        .json({ success: false, message: "Vehicle not found" });
    }
    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: updatedVehicle,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};

const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const vehicleId = Number(req.params.vehicleId);
    if (isNaN(vehicleId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid vehicle ID" });
    }
    const deletedVehicle = await vehicleService.deleteVehicle(vehicleId);
    if (!deletedVehicle) {
      return res
        .status(404)
        .json({ success: false, message: "Vehicle not found" });
    }
    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const vehiclesController = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
