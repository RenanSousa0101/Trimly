import { Router } from "express";
import { ensureAdmin, ensureAuth, ensureProvider } from "./middlewares/auth-middleware";
import { addressController, authController, phoneController, rolesController, userController } from "./container";

const router = Router()

router.post("/auth/register", authController.register)
router.post("/auth/login", authController.login)

router.get("/users", ensureAuth, userController.index)
router.post("/users", ensureAuth, ensureAdmin, userController.create)
router.get("/users/:id", ensureAuth, userController.show)
router.put("/userRole/:userRoleId/users/:id", ensureAuth, userController.update)
router.delete("/userRole/:userRoleId/users/:id", ensureAuth, ensureAdmin, userController.delete)

router.get("/users/:id/phones", ensureAuth, phoneController.show)
router.post("/users/:id/phones", ensureAuth, phoneController.create)
router.put("/users/:id/phones/:phoneId", ensureAuth, phoneController.update)
router.delete("/users/:id/phones/:phoneId", ensureAuth, phoneController.delete)

router.get("/users/:id/addresses", ensureAuth, addressController.show)
router.post("/users/:id/addresses", ensureAuth, addressController.create)
router.put("/users/:id/addresses/:addressId", ensureAuth, addressController.update)
router.delete("/users/:id/addresses/:addressId", ensureAuth, addressController.delete)

router.get("/users/:id/roles", ensureAuth, rolesController.show)
router.post("/userRole/:userRoleId/users/:id/roles", ensureAuth, rolesController.create)
router.put("/userRole/:userRoleId/users/:id/roles/:roleId", ensureAuth, ensureAdmin, rolesController.update)
router.delete("/userRole/:userRoleId/users/:id/roles/:roleId", ensureAuth, ensureAdmin, rolesController.delete)

export { router };