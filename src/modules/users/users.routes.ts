import { Router } from "express";
import { userControllers } from "./users.controllers.js";

const router = Router();

// router.post("/", userControllers.createUser);
router.get("/", userControllers.getUsers);
router.put("/:userId", userControllers.updatedUser);
router.delete("/:userId", userControllers.deletedUser);

export const usersRoutes = router;
