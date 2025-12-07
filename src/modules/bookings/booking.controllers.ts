import { Request, Response } from "express";
import bookingService from "./booking.service.js";

const createBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingService.createBooking(req.body);
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAllBookings = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const bookings = await bookingService.getAllBookings(user);
    res.status(200).json({
      success: true,
      message:
        user!.role === "admin"
          ? "Bookings retrieved successfully"
          : "Your bookings retrieved successfully",
      data: bookings,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    const bookingId = Number(req.params.bookingId);
    const status = req.body.status;
    const user = req.user;

    const updatedBooking = await bookingService.updateBooking(
      bookingId,
      status,
      user
    );

    res.status(200).json({
      success: true,
      message: updatedBooking.message,
      data: updatedBooking.data,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const bookingController = {
  createBooking,
  getAllBookings,
  updateBooking,
};
