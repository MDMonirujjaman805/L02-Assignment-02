import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { bookingController } from "./booking.controllers.js";

const router = Router();

router.post("/", auth("admin", "customer"), bookingController.createBooking);
router.get("/", auth("admin", "customer"), bookingController.getAllBookings);
router.put(
  "/:bookingId",
  auth("admin", "customer"),
  bookingController.updateBooking
);

export const bookingRoutes = router;
