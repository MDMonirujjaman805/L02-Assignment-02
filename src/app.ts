import express, { Request, Response } from "express";
import { initDB } from "./config/db.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { vehiclesRoutes } from "./modules/vehicles/vehicles.routes.js";
import { usersRoutes } from "./modules/users/users.routes.js";
import { bookingRoutes } from "./modules/bookings/booking.routes.js";

const app = express();

// parser
app.use(express.json());

// initializing DB
initDB();

app.get("/", (req: Request, res: Response) => {
  res.send(
    "Hello World! My name is Monir.This is Vehicle Rental System Project."
  );
  console.log(req.method);
  console.log(req.path);
});

// CRUD Operations
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/vehicles", vehiclesRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/bookings", bookingRoutes);

// Global 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "The requested resource was not found.",
    path: req.originalUrl,
  });
});

export default app;
