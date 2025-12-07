import { Router } from "express";
import { vehiclesController } from "./vehicles.controllers.js";

const router = Router();

router.post("/", vehiclesController.createVehicle);
router.get("/", vehiclesController.getVehicles);

export const vehiclesRoutes = router;
