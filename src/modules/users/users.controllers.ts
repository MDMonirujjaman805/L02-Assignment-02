import { Request, Response } from "express";
import { userServices } from "./users.services.js";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    // auth middleware already restricted to admin, but double-check for safety
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    const users = await userServices.getAllUsers();
    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (err: any) {
    console.error("getAllUsers:", err);
    return res
      .status(500)
      .json({ success: false, message: err.message || "Server error" });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    if (isNaN(userId) || userId <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid userId" });
    }
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const payload = req.body || {};
    // If customer, ensure updating own profile only
    if (req.user.role === "customer" && req.user.id !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own profile",
      });
    }
    // If non-admin tries to change role, reject
    if (req.user.role !== "admin" && payload.role) {
      return res
        .status(403)
        .json({ success: false, message: "Only admin can change role" });
    }
    const updated = await userServices.updateUser(userId, payload);
    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updated,
    });
  } catch (err: any) {
    console.error("updateUser:", err);
    return res.status(400).json({
      success: false,
      message: err.message || "Could not update user",
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    if (isNaN(userId) || userId <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid userId" });
    }
    // auth middleware already ensures admin, double-check
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    await userServices.deleteUser(userId);
    return res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (err: any) {
    console.error("deleteUser:", err);
    // business rule violation
    if (err.message && err.message.includes("active bookings")) {
      return res.status(400).json({ success: false, message: err.message });
    }
    return res.status(500).json({
      success: false,
      message: err.message || "Could not delete user",
    });
  }
};
export const userControllers = { getAllUsers, updateUser, deleteUser };
