import { Router } from "express";
import { UserController } from "./controllers/UserController";

const router = Router()

const userController = new UserController()

router.get("/users", userController.index)

export { router };