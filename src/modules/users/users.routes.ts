import express from "express";
import { usersControllers } from "./users.controllers";
import auth from "../../middleware/auth";

const router = express.Router();

router.get("/users", auth("admin"), usersControllers.getUser);

router.put(
  "/users/:userId",
  auth("admin", "customer"),
  usersControllers.updateUser
);

router.delete("/users/:userId", auth("admin"), usersControllers.deleteUser);

export const usersRoutes = router;
