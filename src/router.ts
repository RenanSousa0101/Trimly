import { Router } from "express";
import { ensureAdmin, ensureAuth, ensureProvider } from "./middlewares/auth-middleware";
import { addressController, authController, phoneController, rolesController, userController } from "./container";

const router = Router()

router.post("/auth/register", authController.register)
router.post("/auth/login", authController.login)

router.get("/users", ensureAuth, ensureAdmin, userController.index)
router.post("/users", ensureAuth, ensureAdmin, userController.create)
router.get("/users/:id", ensureAuth, ensureAdmin, userController.show)
router.put("/users/:id", ensureAuth, ensureAdmin, userController.update)
router.delete("/users/:id", ensureAuth, ensureAdmin, userController.delete)

router.get("/users/:id/phones", ensureAuth, ensureAdmin, phoneController.show)
router.post("/users/:id/phones", ensureAuth, phoneController.create)
router.put("/users/:id/phones/:phoneId", ensureAuth, phoneController.update)
router.delete("/users/:id/phones/:phoneId", ensureAuth, phoneController.delete)

router.get("/users/:id/addresses", ensureAuth, addressController.show)
router.post("/users/:id/addresses", ensureAuth, addressController.create)
router.put("/users/:id/addresses/:addressId", ensureAuth, addressController.update)
router.delete("/users/:id/addresses/:addressId", ensureAuth, addressController.delete)

router.get("/users/:id/roles", ensureAuth, ensureAdmin, rolesController.show)
router.post("/users/:id/roles", ensureAuth, ensureAdmin, rolesController.create)
router.put("/users/:id/roles/:roleId", ensureAuth, ensureAdmin, rolesController.update)
router.delete("/users/:id/roles/:roleId", ensureAuth, ensureAdmin, rolesController.delete)

export { router };