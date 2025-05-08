import { Router } from "express";
import { ensureAdmin, ensureAuth, ensureProvider, authorizeAdminOrOwner, ensureNotSelf} from "./middlewares/auth-middleware";
import { addressController, authController, phoneController, providerController, rolesController, userController } from "./container";

const router = Router()

router.post("/auth/register", authController.register)
router.post("/auth/resend-verification", authController.resendVerificationEmail);
router.get("/auth/verify-email", authController.verifyEmail);
router.post('/auth/forgot-password', authController.forgotPassword);
router.post('/auth/reset-password', authController.resetPassword);

router.post("/auth/login", authController.login)

router.get("/users", ensureAuth, ensureAdmin, userController.index)
router.post("/users", ensureAuth, ensureAdmin, userController.create)
router.get("/users/:id", ensureAuth, authorizeAdminOrOwner('id'), userController.show)
router.put("/users/:id", ensureAuth, authorizeAdminOrOwner('id'), userController.update)
router.delete("/users/:id", ensureAuth, ensureAdmin, authorizeAdminOrOwner('id'), ensureNotSelf('id'), userController.delete)

router.get("/users/:id/phones", ensureAuth, authorizeAdminOrOwner('id'), phoneController.show)
router.post("/users/:id/phones", ensureAuth, authorizeAdminOrOwner('id'), phoneController.create)
router.put("/users/:id/phones/:phoneId", ensureAuth, authorizeAdminOrOwner('id'), phoneController.update)
router.delete("/users/:id/phones/:phoneId", ensureAuth, authorizeAdminOrOwner('id'), phoneController.delete)

router.get("/users/:id/addresses", ensureAuth, authorizeAdminOrOwner('id'), addressController.show)
router.post("/users/:id/addresses", ensureAuth, authorizeAdminOrOwner('id'), addressController.create)
router.put("/users/:id/addresses/:addressId", ensureAuth, authorizeAdminOrOwner('id'), addressController.update)
router.delete("/users/:id/addresses/:addressId", ensureAuth, authorizeAdminOrOwner('id'), addressController.delete)

router.get("/users/:id/roles", ensureAuth, authorizeAdminOrOwner('id'), rolesController.show)
router.post("/users/:id/roles", ensureAuth, authorizeAdminOrOwner('id'), rolesController.create)
router.put("/users/:id/roles/:roleId", ensureAuth, ensureAdmin, authorizeAdminOrOwner('id'), rolesController.update)
router.delete("/users/:id/roles/:roleId", ensureAuth, ensureAdmin, rolesController.delete)

router.get("/users/:id/provider", ensureAuth, ensureAdmin, providerController.index)
router.post("/users/:id/provider", ensureAuth, authorizeAdminOrOwner('id'), providerController.create)
router.get("/users/:id/provider/:providerId", ensureAuth, ensureProvider, authorizeAdminOrOwner('id'), providerController.show)
router.put("/users/:id/provider/:providerId", ensureAuth, ensureProvider, authorizeAdminOrOwner('id'), providerController.update)


export { router };