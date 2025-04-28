import { Router } from "express";
import { UserController } from "./controllers/UserController";
import { PhoneController } from "./controllers/PhoneController";
import { AddressController } from "./controllers/AddressController";

const router = Router()

const userController = new UserController()
const phoneController = new PhoneController()
const addressController = new AddressController()

router.get("/users", userController.index)
router.post("/users", userController.create)
router.get("/users/:id", userController.show)
router.put("/users/:id", userController.update)
router.delete("/users/:id", userController.delete)

router.get("/users/:id/phones", phoneController.show)
router.post("/users/:id/phones", phoneController.create)
router.put("/users/:id/phones/:phoneId", phoneController.update)
router.delete("/users/:id/phones/:phoneId", phoneController.delete)

router.get("/users/:id/addresses", addressController.show)



export { router };