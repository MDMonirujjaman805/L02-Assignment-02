import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { vehiclesController } from "./vehicles.controllers.js";

const router = Router();

router.post("/", auth("admin"), vehiclesController.createVehicle);
router.get("/", vehiclesController.getAllVehicles);
router.get(
  "/:vehicleId",
  auth("admin", "customer"),
  vehiclesController.getVehicleById
);
router.put("/:vehicleId", auth("admin"), vehiclesController.updateVehicle);
router.delete("/:vehicleId", auth("admin"), vehiclesController.deleteVehicle);

export const vehiclesRoutes = router;
