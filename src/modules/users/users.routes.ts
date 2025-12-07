import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { userControllers } from "./users.controllers.js";

const router = Router();

router.get("/", auth("admin"), userControllers.getAllUsers);
router.put("/:userId", auth("admin", "customer"), userControllers.updateUser);
router.delete("/:userId", auth("admin"), userControllers.deleteUser);

export const usersRoutes = router;
